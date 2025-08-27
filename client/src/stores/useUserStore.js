import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  // user states
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    // 1) set the loading to be true
    set({ loading: true });

    // 2) check the confirm password is true
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    // 3) send request to signup in backend
    try {
      const res = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      set({ user: res.data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response?.data?.message || "Something wrong during signup"
      );
    }
  },

  login: async (email, password) => {
    // 1) set the loading to be true
    set({ loading: true });

    // 2) try to send request to the server
    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(
        error?.response?.data?.message || "Something wrong during login"
      );
    }
  },
}));
