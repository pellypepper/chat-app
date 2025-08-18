// stores/useAuthStore.ts - Updated for Authorization headers
import { create } from "zustand";
import axios from "axios";
import { devtools } from "zustand/middleware";
import { User } from "../types/user"; 

// Remove withCredentials since we're using headers instead
axios.defaults.baseURL = "https://chat-app-frdxoa-production.up.railway.app";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionChecked: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;

  login: (credentials: { email: string; password: string }) => Promise<void>;
  googleLogin: () => void;
  getSession: () => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  reset: () => void;
}

// Helper function to create axios instance with current token
const createAuthenticatedRequest = (token: string | null) => {
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return { headers };
};

export const useAuthStore = create<AuthState>()(
  devtools((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    sessionChecked: false,
    error: null,
    accessToken: null,
    refreshToken: null,

    refreshAccessToken: async (): Promise<boolean> => {
      const { refreshToken } = get();
      
      if (!refreshToken) {
        return false;
      }

      try {
        const response = await axios.post("/login/refresh", {}, {
          headers: { Authorization: `Bearer ${refreshToken}` },
          timeout: 10000
        });
        
        const newAccessToken = response.data.accessToken;
        set({ accessToken: newAccessToken, error: null });
        
        // Store in localStorage for persistence
        localStorage.setItem('accessToken', newAccessToken);
        
        return true;
      } catch (error) {
        console.log("Refresh token failed:", error);
        
        // Clear invalid tokens
        set({ 
          accessToken: null, 
          refreshToken: null,
          user: null,
          isAuthenticated: false 
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        return false;
      }
    },

    getSession: async () => {
      set({ isLoading: true, error: null });
      
      try {
        let { accessToken } = get();
        
        // Try to get token from localStorage if not in state
        if (!accessToken) {
          accessToken = localStorage.getItem('accessToken');
          if (accessToken) {
            set({ accessToken });
          }
        }

        if (!accessToken) {
          // Try to refresh token
          const refreshSuccessful = await get().refreshAccessToken();
          if (!refreshSuccessful) {
            set({
              user: null,
              isAuthenticated: false,
              sessionChecked: true,
              isLoading: false
            });
            return;
          }
          accessToken = get().accessToken;
        }

        // Get current user with access token
        const res = await axios.get("/login/user", {
          ...createAuthenticatedRequest(accessToken),
          timeout: 10000
        });
        
        const user = res.data.user;
        set({
          user,
          isAuthenticated: user?.verified ?? false,
          isLoading: false,
          error: null,
          sessionChecked: true
        });
        
      } catch (err: any) {
        console.log("Session check failed, trying refresh...");
        
        // Try to refresh and retry once
        const refreshSuccessful = await get().refreshAccessToken();
        if (refreshSuccessful) {
          try {
            const { accessToken } = get();
            const res = await axios.get("/login/user", {
              ...createAuthenticatedRequest(accessToken),
              timeout: 10000
            });
            
            const user = res.data.user;
            set({
              user,
              isAuthenticated: user?.verified ?? false,
              isLoading: false,
              error: null,
              sessionChecked: true
            });
            return;
          } catch (retryError) {
            console.log("Retry after refresh failed:", retryError);
          }
        }
        
        // Final fallback - clear everything
        set({
          user: null,
          isAuthenticated: false,
          error: "Session expired",
          sessionChecked: true,
          isLoading: false,
          accessToken: null,
          refreshToken: null
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    },

    login: async ({ email, password }) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post("/login", { email, password }, {
          timeout: 15000,
          withCredentials: true // Still use cookies for login response
        });
        
        // Extract tokens from response body instead of cookies
        const { user, accessToken, refreshToken } = response.data;
        
        // Store tokens
        set({ 
          user, 
          isAuthenticated: user?.verified ?? false,
          sessionChecked: true,
          accessToken,
          refreshToken
        });
        
        // Persist tokens to localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
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
        const { accessToken } = get();
        
        await axios.post("/login/logout", {}, {
          ...createAuthenticatedRequest(accessToken),
          timeout: 10000
        });
        
        // Clear everything
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null, 
          sessionChecked: true,
          accessToken: null,
          refreshToken: null
        });
        
        // Clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('googleLoginInProgress');
        
      } catch (err: any) {
        // Even if logout fails on server, clear local state
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null,
          accessToken: null,
          refreshToken: null
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        set({ isLoading: false });
      }
    },

    reset: () => {
      set({ 
        user: null, 
        isLoading: false, 
        error: null, 
        sessionChecked: false,
        accessToken: null,
        refreshToken: null
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  }))
);