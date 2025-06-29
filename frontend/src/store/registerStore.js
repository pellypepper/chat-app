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
    isLoading: false,
    error: null,
    verificationSent: false,
    register: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios_1.default.post("/register", data);
            set({
                user: response.data.user,
                verificationSent: true,
            });
        }
        catch (err) {
            set({ error: err.response?.data?.error || err.message });
        }
        finally {
            set({ isLoading: false });
        }
    },
    verifyEmail: async (email, code) => {
        set({ isLoading: true, error: null });
        try {
            const userRes = await axios_1.default.post("/register/verify", { email, code });
            set({
                user: userRes.data.user,
                verificationSent: false,
            });
        }
        catch (err) {
            set({ error: err.response?.data?.error || err.message });
        }
        finally {
            set({ isLoading: false });
        }
    },
    reset: () => set({
        user: null,
        isLoading: false,
        error: null,
        verificationSent: false,
    }),
})));
