import { create } from "zustand";
import axios from "axios";
import { devtools } from "zustand/middleware";
import { User } from "../types/user";

// Set base URL based on environment
axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-railway.app'
  : "http://localhost:8080";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionChecked: boolean;
  error: string | null;

  login: (credentials: { email: string; password: string }) => Promise<void>;
  googleLogin: () => void;
  handleGoogleCallback: (accessToken: string, refreshToken: string) => Promise<void>;
  getSession: () => Promise<void>;
  logout: () => Promise<void>;
  reset: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    sessionChecked: false,
    error: null,

    clearError: () => set({ error: null }),

    getSession: async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (!accessToken && !refreshToken) {
        set({ user: null, isAuthenticated: false, sessionChecked: true });
        return;
      }

      if (!accessToken && refreshToken) {
        // Try to refresh token first
        try {
          const refreshRes = await axios.post("/login/refresh", {}, {
            headers: { "x-refresh-token": refreshToken }
          });
          
          const newAccessToken = refreshRes.data.accessToken;
          if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
            // Continue with the new access token
            await get().getSession();
            return;
          }
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          localStorage.removeItem("refreshToken");
          set({
            user: null,
            isAuthenticated: false,
            error: "Session expired",
            sessionChecked: true,
          });
          return;
        }
      }

      try {
        // Try to get current user with access token
        const currentAccessToken = localStorage.getItem("accessToken");
        const res = await axios.get("/login/user", {
          headers: { Authorization: `Bearer ${currentAccessToken}` }
        });
        
        const user = res.data.user;
        set({
          user,
          isAuthenticated: user?.verified ?? false,
          isLoading: false,
          error: null,
          sessionChecked: true,
        });
      } catch (err: any) {
        // If access token failed, try refresh token
        if (refreshToken && err.response?.status === 403) {
          try {
            const refreshRes = await axios.post("/login/refresh", {}, {
              headers: { "x-refresh-token": refreshToken }
            });
            
            const newAccessToken = refreshRes.data.accessToken;
            if (newAccessToken) {
              localStorage.setItem("accessToken", newAccessToken);
              
              // Try to get user info again with new access token
              const res = await axios.get("/login/user", {
                headers: { Authorization: `Bearer ${newAccessToken}` }
              });
              
              const user = res.data.user;
              set({
                user,
                isAuthenticated: user?.verified ?? false,
                isLoading: false,
                error: null,
                sessionChecked: true,
              });
            } else {
              throw new Error('No access token received');
            }
          } catch (refreshError) {
            console.error('Refresh failed:', refreshError);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            set({
              user: null,
              isAuthenticated: false,
              error: "Session expired",
              sessionChecked: true,
            });
          }
        } else {
          console.error('Session check failed:', err);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          set({
            user: null,
            isAuthenticated: false,
            error: "Session expired",
            sessionChecked: true,
          });
        }
      }
    },

    login: async ({ email, password }) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post("/login", { email, password });
        
        const user = response.data.user;
        const { accessToken, refreshToken } = response.data;
        
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        
        set({ 
          user, 
          isAuthenticated: user?.verified ?? false,
          sessionChecked: true,
          error: null 
        });
      } catch (err: any) {
        console.error('Login error:', err);
        set({ error: err.response?.data?.message || err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    googleLogin: () => {
      
      window.location.href =" https://chat-app-frdxoa-production.up.railway.app/login/google";
    },

    handleGoogleCallback: async (accessToken: string, refreshToken: string) => {
      set({ isLoading: true, error: null });
      
      try {
        // Store tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        
        // Get user data
        const res = await axios.get("/login/user", {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        const user = res.data.user;
        set({
          user,
          isAuthenticated: user?.verified ?? false,
          sessionChecked: true,
          error: null,
          isLoading: false
        });
      } catch (err: any) {
        console.error('Google callback error:', err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ 
          error: 'Failed to complete Google login',
          isLoading: false,
          sessionChecked: true
        });
      }
    },

    logout: async () => {
      set({ isLoading: true, error: null });
      try {
        // Call logout endpoint
        await axios.post("/login/logout");
      } catch (err: any) {
        console.error('Logout error:', err);
      } finally {
        // Always clear local storage and state
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null, 
          sessionChecked: true,
          isLoading: false 
        });
      }
    },

    reset: () => set({ 
      user: null, 
      isLoading: false, 
      error: null, 
      sessionChecked: false,
      isAuthenticated: false 
    }),
  }))
);