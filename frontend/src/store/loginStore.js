"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthStore = void 0;
// stores/useAuthStore.ts
const zustand_1 = require("zustand");
const axios_1 = __importDefault(require("axios"));
const middleware_1 = require("zustand/middleware");
axios_1.default.defaults.withCredentials = true;
axios_1.default.defaults.baseURL = "https://chat-app-tk-blg.fly.dev";
exports.useAuthStore = (0, zustand_1.create)()((0, middleware_1.devtools)((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    getSession: async () => {
        try {
            const res = await axios_1.default.get("/login/user", {
                withCredentials: true,
            });
            const user = res.data.user;
            set({
                user,
                isAuthenticated: user?.verified ?? true,
                isLoading: false,
                error: null,
            });
        }
        catch (err) {
            // Try to refresh token
            try {
                await axios_1.default.post("/login/refresh", {}, { withCredentials: true });
                // Retry session fetch after refreshing token
                const res = await axios_1.default.get("/login/user", {
                    withCredentials: true,
                });
                const user = res.data.user;
                set({
                    user,
                    isAuthenticated: user?.verified ?? true,
                    isLoading: false,
                    error: null,
                });
            }
            catch (refreshError) {
                set({ user: null, isAuthenticated: false, error: "Session expired" });
            }
        }
    },
    login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios_1.default.post("/login", { email, password });
            set({ user: response.data.user, isAuthenticated: response.data.user?.verified ?? false });
        }
        catch (err) {
            set({ error: err.response?.data?.message || err.message });
        }
        finally {
            set({ isLoading: false });
        }
    },
    googleLogin: () => {
        // Redirects user to Google login page
        window.location.href = "login/google";
    },
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios_1.default.post("/login/logout");
            set({ user: null, isAuthenticated: false, error: null });
        }
        catch (err) {
            set({ error: err.response?.data?.message || err.message });
        }
        finally {
            set({ isLoading: false });
        }
    },
    reset: () => set({ user: null, isLoading: false, error: null }),
})));
