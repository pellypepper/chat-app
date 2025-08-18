// stores/useAuthStore.ts - Improved version
import { create } from "zustand";
import axios from "axios";
import { devtools } from "zustand/middleware";
import { User } from "../types/user"; 

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://chat-app-frdxoa-production.up.railway.app";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionChecked: boolean;
  error: string | null;
  retryCount: number; // Add retry counter

  login: (credentials: { email: string; password: string }) => Promise<void>;
  googleLogin: () => void;
  getSession: () => Promise<void>;
  logout: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    sessionChecked: false,
    error: null,
    retryCount: 0,

    getSession: async () => {
      const { retryCount } = get();
      
      // Prevent infinite retry loops
      if (retryCount >= 3) {
        set({
          user: null,
          isAuthenticated: false,
          sessionChecked: true,
          error: "Session check failed after multiple attempts",
          isLoading: false
        });
        return;
      }

      set({ isLoading: true, error: null });
      
      try {
        // Add a small delay for mobile devices
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const res = await axios.get("/login/user", { 
          withCredentials: true,
          timeout: 10000 // 10 second timeout
        });
        
        const user = res.data.user;
        set({
          user,
          isAuthenticated: user?.verified ?? false,
          isLoading: false,
          error: null,
          sessionChecked: true,
          retryCount: 0 // Reset on success
        });
      } catch (err: any) {
        console.log("Initial session check failed, trying refresh...");
        
        try {
          await axios.post("/login/refresh", {}, { 
            withCredentials: true,
            timeout: 10000
          });
          
          // Add small delay before retry
          await new Promise(resolve => setTimeout(resolve, 200));
          
          const res = await axios.get("/login/user", { 
            withCredentials: true,
            timeout: 10000
          });
          
          const user = res.data.user;
          set({
            user,
            isAuthenticated: user?.verified ?? false,
            isLoading: false,
            error: null,
            sessionChecked: true,
            retryCount: 0
          });
        } catch (refreshError: any) {
          console.log("Refresh failed:", refreshError);
          
          // Increment retry count and potentially retry
          const newRetryCount = retryCount + 1;
          set({
            retryCount: newRetryCount
          });
          
          if (newRetryCount < 3) {
            // Retry after a delay on mobile
            setTimeout(() => {
              get().getSession();
            }, 1000 * newRetryCount); // Progressive delay
          } else {
            set({
              user: null,
              isAuthenticated: false,
              error: "Session expired",
              sessionChecked: true,
              isLoading: false
            });
          }
        }
      }
    },

    login: async ({ email, password }) => {
      set({ isLoading: true, error: null, retryCount: 0 });
      try {
        const response = await axios.post("/login", { email, password }, {
          timeout: 15000 // Longer timeout for login
        });
        
        // Wait a bit for cookies to be set properly on mobile
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set({ 
          user: response.data.user, 
          isAuthenticated: response.data.user?.verified ?? false,
          sessionChecked: true 
        });
      } catch (err: any) {
        set({ error: err.response?.data?.message || err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    googleLogin: () => {
      // Store a flag to know we're returning from Google
      sessionStorage.setItem('googleLoginInProgress', 'true');
      window.location.href = "https://chat-app-frdxoa-production.up.railway.app/login/google";
    },

    logout: async () => {
      set({ isLoading: true, error: null });
      try {
        await axios.post("/login/logout", {}, {
          timeout: 10000
        });
        
        // Clear any stored flags
        sessionStorage.removeItem('googleLoginInProgress');
        
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null, 
          sessionChecked: true,
          retryCount: 0
        });
      } catch (err: any) {
        set({ error: err.response?.data?.message || err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    reset: () => set({ 
      user: null, 
      isLoading: false, 
      error: null, 
      sessionChecked: false,
      retryCount: 0
    }),
  }))
);