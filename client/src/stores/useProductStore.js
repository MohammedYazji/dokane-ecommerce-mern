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
      // Create FormData instead of JSON
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("category", productData.category);

      // Append the file directly (not base64)
      if (productData.image) {
        formData.append("image", productData.image);
      }

      const res = await axios.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

  getAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      set({ products: res.data.products, loading: false });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Error fetching products";
      toast.error(msg);
      set({ loading: false });
    }
  },
  toggleFeatured: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.put(`/products/${id}`);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === id ? res.data.updatedProduct : product
        ),
        loading: false,
      }));
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Error toggle featured";
      toast.error(msg);
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.delete(`/products/${id}`);
      set((prevState) => ({
        products: prevState.products.filter((product) => product._id !== id),
        loading: false,
      }));
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Error delete product";
      toast.error(msg);
      set({ loading: false });
    }
  },

  getProductsByCategory: async (cat) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/category/${cat}`);
      set({ products: res.data.products, loading: false });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Error fetching products by category";
      toast.error(msg);
      set({ loading: false });
    }
  },

  getFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products/featured");
      set({ products: res.data.featured_products, loading: false });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Error fetching products by category";
      toast.error(msg);
      set({ loading: false });
    }
  },
}));
