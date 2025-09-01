import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subTotal: 0,
  isCouponApplied: false,

  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      toast.success("Added to cart successfully");

      set((prevState) => {
        const isExistBefore = prevState.cart.find(
          (item) => item.product._id === product._id
        );

        const newCart = isExistBefore
          ? prevState.cart.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { product, quantity: 1 }];

        return { cart: newCart };
      });

      get().calcTotal();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Error adding product to cart";
      toast.error(msg);
      set({ cart: [] });
    }
  },

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data.cart });
      get().calcTotal();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Error get cart products";
      toast.error(msg);
      set({ cart: [] });
    }
  },

  calcTotal: () => {
    const { cart, coupon } = get();
    const subTotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    let total = subTotal;

    if (coupon) {
      const discount = subTotal * (coupon.discountPercentage / 100);
      total = subTotal - discount;
    }

    set({ subTotal, total });
  },

  deleteFromCart: async (id) => {
    try {
      await axios.delete(`/cart`, { data: { productId: id } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item.product._id !== id),
      }));
      get().calcTotal();
      toast.success("Item removed from cart");
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Failed to remove item from cart";
      toast.error(msg);
    }
  },

  updateQuantity: async (id, quantity) => {
    if (quantity < 1) {
      get().deleteFromCart(id);
      return;
    }
    try {
      await axios.put(`/cart/${id}`, { quantity });
      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item.product._id === id ? { ...item, quantity } : item
        ),
      }));
      get().calcTotal();
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to update quantity";
      toast.error(msg);
    }
  },
  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subTotal: 0 });
  },
}));
