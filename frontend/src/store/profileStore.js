"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProfileStore = void 0;
const zustand_1 = require("zustand");
const axios_1 = __importDefault(require("axios"));
const middleware_1 = require("zustand/middleware");
axios_1.default.defaults.withCredentials = true;
axios_1.default.defaults.baseURL = "https://chat-app-tk-blg.fly.dev";
exports.useProfileStore = (0, zustand_1.create)()((0, middleware_1.devtools)((set) => ({
    user: null,
    isLoading: false,
    error: null,
    message: null,
    getProfile: async () => {
        set({ isLoading: true, error: null, message: null });
        try {
            const response = await axios_1.default.get("/profile");
            set({ user: response.data.user, message: null, isLoading: false });
        }
        catch (err) {
            set({ error: err.response?.data?.error || err.message });
        }
        finally {
            set({ isLoading: false });
        }
    },
    updateProfile: async (data) => {
        set({ isLoading: true, error: null, message: null });
        try {
            const res = await axios_1.default.put("/profile", data);
            const refreshed = await axios_1.default.get("/profile");
            set({ user: refreshed.data.user, message: res.data.message });
        }
        catch (err) {
            set({ error: err.response?.data?.error || err.message });
        }
        finally {
            set({ isLoading: false });
        }
    },
    changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true, error: null, message: null });
        try {
            const res = await axios_1.default.put("/profile/change-password", {
                currentPassword,
                newPassword,
            });
            set({ message: res.data.message });
            return res.data;
        }
        catch (err) {
            const backendError = err.response?.data?.error || err.response?.data?.message || err.message;
            set({ error: backendError });
            throw new Error(backendError);
        }
        finally {
            set({ isLoading: false });
        }
    },
    forgotPassword: async (email) => {
        set({ isLoading: true, error: null, message: null });
        try {
            const res = await axios_1.default.post("/profile/forget-password", { email });
            set({ message: res.data.message });
        }
        catch (err) {
            set({ error: err.response?.data?.error || err.message });
        }
        finally {
            set({ isLoading: false });
        }
    },
    resetPassword: async ({ email, token, newPassword }) => {
        set({ isLoading: true, error: null, message: null });
        try {
            const res = await axios_1.default.post("/profile/reset-password", {
                email,
                token,
                newPassword,
            });
            set({ message: res.data.message });
        }
        catch (err) {
            set({ error: err.response?.data?.error || err.message });
        }
        finally {
            set({ isLoading: false });
        }
    },
    uploadProfilePicture: async (file) => {
        set({ isLoading: true, error: null, message: null });
        const formData = new FormData();
        formData.append("image", file);
        try {
            const res = await axios_1.default.post("/profile/upload-profile-picture", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            set({ message: res.data.message });
            await exports.useProfileStore.getState().getProfile();
        }
        catch (err) {
            set({ error: err.response?.data?.error || err.message });
        }
        finally {
            set({ isLoading: false });
        }
    },
    clearState: () => set({ isLoading: false, error: null, message: null }),
})));
