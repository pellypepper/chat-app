// stores/useAuthStore.ts
import { create } from "zustand";
import axios from "axios";
import { devtools } from "zustand/middleware";
import { User } from "../types/user"; 

axios.defaults.withCredentials = true;
axios.defaults.baseURL ="https://chat-app-frdxoa-production.up.railway.app";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionChecked: boolean;  // <-- Add this
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
    sessionChecked: false, // <-- initialize
    error: null,

    getSession: async () => {
      try {
        const res = await axios.get("/login/user", { withCredentials: true });
        const user = res.data.user;
        set({
          user,
          isAuthenticated: user?.verified ?? false,
          isLoading: false,
          error: null,
          sessionChecked: true, // <-- mark session as checked
        });
      } catch (err: any) {
        try {
          await axios.post("/login/refresh", {}, { withCredentials: true });
          const res = await axios.get("/login/user", { withCredentials: true });
          const user = res.data.user;
          set({
            user,
            isAuthenticated: user?.verified ?? false,
            isLoading: false,
            error: null,
            sessionChecked: true,
          });
        } catch (refreshError) {
          set({
            user: null,
            isAuthenticated: false,
            error: "Session expired",
            sessionChecked: true, // <-- mark session as checked even if failed
          });
        }
      }
    },

    login: async ({ email, password }) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post("/login", { email, password });
        set({ user: response.data.user, isAuthenticated: response.data.user?.verified ?? false });
      } catch (err: any) {
        set({ error: err.response?.data?.message || err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    googleLogin: () => {
      window.location.href = "https://chat-app-frdxoa-production.up.railway.app/login/google";
    },

    logout: async () => {
      set({ isLoading: true, error: null });
      try {
        await axios.post("/login/logout");
        set({ user: null, isAuthenticated: false, error: null, sessionChecked: true });
      } catch (err: any) {
        set({ error: err.response?.data?.message || err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    reset: () => set({ user: null, isLoading: false, error: null, sessionChecked: false }),
  }))
);
