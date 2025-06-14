// stores/useAuthStore.ts
import { create } from "zustand";
import axios from "axios";
import { devtools } from "zustand/middleware";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:4000"; // Adjust if needed

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  verified: boolean;
  // add any other user fields you return
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: { email: string; password: string }) => Promise<void>;
  googleLogin: () => void;
  getSession: () => Promise<void>;
  logout: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
      isAuthenticated: false,
    isLoading: false,
    error: null,

getSession: async () => {
      try {
        const res = await axios.get("http://localhost:4000/login/user", {
          withCredentials: true,
        });
        const user = res.data.user;
        set({
          user,
          isAuthenticated: user?.verified ?? true,
          isLoading: false,
          error: null,
        });
      } catch (err: any) {
        // Try to refresh token
        try {
          await axios.post("/login/refresh", {}, { withCredentials: true });
          // Retry session fetch after refreshing token
          const res = await axios.get("/login/user", {
            withCredentials: true,
          });
          const user = res.data.user;
          set({
            user,
            isAuthenticated: user?.verified ?? true,
            isLoading: false,
            error: null,
          });
        } catch (refreshError) {
          set({ user: null, isAuthenticated: false, error: "Session expired" });
        }
      }
    },
    login: async ({ email, password }) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post("/login", { email, password });
        set({ user: response.data.user , isAuthenticated: response.data.user?.verified ?? false });
       
      } catch (err: any) {
        set({ error: err.response?.data?.message || err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    googleLogin: () => {
      // Redirects user to Google login page
      window.location.href = "http://localhost:4000/login/google";
    },

    logout: async () => {
      set({ isLoading: true, error: null });
      try {
        await axios.post("/login/logout");
        set({ user: null, isAuthenticated: false, error: null });
      } catch (err: any) {
        set({ error: err.response?.data?.message || err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    reset: () => set({ user: null, isLoading: false, error: null }),
  }))
);
