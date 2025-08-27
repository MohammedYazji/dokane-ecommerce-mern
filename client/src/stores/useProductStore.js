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
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data.product],
        loading: false,
      }));
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Error creating product";
      toast.error(msg);
      set({ loading: false });
    }
  },
}));
