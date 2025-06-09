// stores/useAuthStore.ts
import { create } from "zustand";
import axios from "axios";
import { devtools } from "zustand/middleware";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:4000";

interface User {
  firstname: string;
  lastname: string;
  email: string;
  verified: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  verificationSent: boolean;

  register: (data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) => Promise<void>;

  verifyEmail: (email: string, code: string) => Promise<void>;

  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    isLoading: false,
    error: null,
    verificationSent: false,

    register: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post("/register", data);

        set({
          user: response.data.user,
          verificationSent: true,
        });
      } catch (err: any) {
        set({ error: err.response?.data?.error || err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    verifyEmail: async (email, code) => {
      set({ isLoading: true, error: null });
      try {
          const userRes = await axios.post("/register/verify", { email, code });

        set({
          user: userRes.data.user,
          verificationSent: false,
        });
      } catch (err: any) {
        set({ error: err.response?.data?.error || err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    reset: () =>
      set({
        user: null,
        isLoading: false,
        error: null,
        verificationSent: false,
      }),
  }))
);
