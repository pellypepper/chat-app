import { create } from "zustand";
import axios from "axios";
import { devtools } from "zustand/middleware";
import {User} from "../types/user"; 

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://chat-app-tk-blg.fly.dev";




interface ProfileState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  message: string | null;


  getProfile: () => Promise<void>;
  updateProfile: (data: Partial<Omit<User, "id" | "verified">>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<void>;
  resetPassword: (data: { email: string; token: string; newPassword: string }) => Promise<void>;
  clearState: () => void;
}

export const useProfileStore = create<ProfileState>()(
  devtools((set) => ({
    user: null,
    isLoading: false,
    error: null,
    message: null,


    getProfile: async () => {
      set({ isLoading: true, error: null, message: null });
      try {
        const response = await axios.get("/profile");
        set({ user: response.data.user, message: null,  isLoading: false });
      } catch (err: any) {
        set({ error: err.response?.data?.error || err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    updateProfile: async (data) => {
      set({ isLoading: true, error: null, message: null });
      try {
        const res = await axios.put("/profile", data);
        const refreshed = await axios.get("/profile");
        set({  user: refreshed.data.user, message: res.data.message  });
      } catch (err: any) {
        set({ error: err.response?.data?.error || err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    changePassword: async (currentPassword, newPassword) => {
  set({ isLoading: true, error: null, message: null });
  try {
    const res = await axios.put("/profile/change-password", {
      currentPassword,
      newPassword,
    });
    set({ message: res.data.message });
    return res.data;
  } catch (err: any) {
 
    const backendError = err.response?.data?.error || err.response?.data?.message || err.message;
   
    set({ error: backendError });
    throw new Error(backendError); 
  } finally {
    set({ isLoading: false });
  }
   } ,

    forgotPassword: async (email) => {
      set({ isLoading: true, error: null, message: null });
      try {
        const res = await axios.post("/profile/forget-password", { email });
        set({ message: res.data.message });
      } catch (err: any) {
        set({ error: err.response?.data?.error || err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    resetPassword: async ({ email, token, newPassword }) => {
      set({ isLoading: true, error: null, message: null });
      try {
        const res = await axios.post("/profile/reset-password", {
          email,
          token,
          newPassword,
        });
        set({ message: res.data.message });
      } catch (err: any) {
        set({ error: err.response?.data?.error || err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    uploadProfilePicture: async (file: File) => {
      set({ isLoading: true, error: null, message: null });
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await axios.post("/profile/upload-profile-picture", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        set({ message: res.data.message });
    
        await useProfileStore.getState().getProfile();
      } catch (err: any) {
        set({ error: err.response?.data?.error || err.message });
      } finally {
        set({ isLoading: false });
      }
    },

    clearState: () => set({ isLoading: false, error: null, message: null }),
  }))
);


