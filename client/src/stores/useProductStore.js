import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios.js";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      console.log(productData);
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data.product],
        loading: false,
      }));
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "error during creating the product"
      );
      set({ loading: false });
    }
  },
}));
