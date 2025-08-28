import { create } from "zustand";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subTotal: 0,

  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      toast.success("Added to cart successfully");

      set((prevState) => {
        const isExistBefore = prevState.cart.find(
          (item) => item._id === product._id
        );
        console.log(isExistBefore);
        const newCart = isExistBefore
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
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
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subTotal;

    if (coupon) {
      const discount = subTotal * (coupon.discountPercentage / 100);
      total = subTotal - discount;
    }

    set({ subTotal, total });
  },
}));
