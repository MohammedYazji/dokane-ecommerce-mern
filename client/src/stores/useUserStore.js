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

  // to make pages refresh auto and if user exist to decide any page to use [without refresh the page manually after each process]
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.get("/auth/profile");
      set({ user: res.data.user, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      toast.error(
        toast.response?.data?.message || "Something wrong during logout"
      );
    }
  },
  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const res = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return res.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

// Axios interceptor for token refresh [refresh access token each 15 minutes]
let refreshPromise = null; // Store ongoing refresh request to prevent multiple simultaneous refreshes

axios.interceptors.response.use(
  (response) => response, // If response is successful, just return it
  async (error) => {
    const originalRequest = error.config; // The request that caused the error

    // Check if error is 401 (unauthorized) and request has not been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried to prevent infinite loops

      try {
        // If a token refresh is already in progress, wait for it to finish
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest); // Retry original request with new token
        }

        // Start a new token refresh process
        refreshPromise = useUserStore.getState().refreshToken(); // Call refresh token function from store
        await refreshPromise; // Wait for refresh to complete
        refreshPromise = null; // Clear the refreshPromise after completion

        return axios(originalRequest); // Retry original request with refreshed token
      } catch (refreshError) {
        // If token refresh fails, log the user out or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError); // Reject with refresh error
      }
    }

    // If error is not 401 or request already retried, just reject the original error
    return Promise.reject(error);
  }
);
