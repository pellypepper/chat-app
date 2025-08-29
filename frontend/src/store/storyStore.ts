import { create } from 'zustand';
import axios from 'axios';

axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
   ? 'https://chat-app-frdxoa-production.up.railway.app'
  : "http://localhost:8080";

interface Story {
  id: number;
  content: string;
  type: 'image' | 'text';
  createdAt: string;
  expiresAt?: string;
}

interface UserStoryGroup {
  userId: number;
  firstname: string;
  lastname: string;
  email?: string;
  stories: Story[];
}

interface Viewer {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  viewedAt: string;
}

interface StoryStore {
  stories: UserStoryGroup[];
  myStoryGroup: UserStoryGroup | null;
  viewers: Viewer[];
  loading: boolean;
  error: string | null;
  selectedStory: Story | null;
  setSelectedStory: (story: Story | null) => void;
  isUploadModalOpen: boolean;
  setUploadModalOpen: (state: boolean) => void;

  fetchFriendStories: () => Promise<void>;
  fetchMyStories: () => Promise<void>;
  uploadStory: (data: FormData) => Promise<void>;
  markViewed: (storyId: number) => Promise<void>;
  getStoryViewers: (storyId: number) => Promise<void>;
  deleteStory: (storyId: number) => Promise<void>;
}

export const useStoryStore = create<StoryStore>((set) => ({
  stories: [],
  myStoryGroup: null,
  viewers: [],
  loading: false,
  error: null,
  selectedStory: null,
  setSelectedStory: (story) => set({ selectedStory: story }),
  isUploadModalOpen: false,
  setUploadModalOpen: (state) => set({ isUploadModalOpen: state }),

  fetchFriendStories: async () => {
    set({ loading: true, error: null });
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get('/story/friends', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      set({ stories: res.data.groupedStories, loading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch stories';
      set({ error: message, loading: false });
    }
  },

  fetchMyStories: async () => {
    set({ loading: true, error: null });
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get('/story/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      set({ myStoryGroup: res.data.userStories, loading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch your stories';
      set({ error: message, loading: false });
    }
  },

  uploadStory: async (data: FormData) => {
    set({ loading: true, error: null });
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.post('/story/upload', data, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      });
      await Promise.all([
        useStoryStore.getState().fetchFriendStories(),
        useStoryStore.getState().fetchMyStories(),
      ]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to upload story';
      set({ error: message, loading: false });
    }
  },

  markViewed: async (storyId: number) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.post(`/story/view/${storyId}`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    } catch (error) {
      console.error('Failed to mark as viewed', error);
    }
  },

  getStoryViewers: async (storyId: number) => {
    set({ loading: true, error: null });
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(`/story/view/user/${storyId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const viewers = Array.isArray(res.data.viewers) ? res.data.viewers : [];
      set({ viewers, loading: false });
      return viewers;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch viewers';
      set({ error: message, loading: false, viewers: [] });
      return [];
    }
  },

  deleteStory: async (storyId: number) => {
    set({ loading: true, error: null });
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`/story/${storyId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      await Promise.all([
        useStoryStore.getState().fetchFriendStories(),
        useStoryStore.getState().fetchMyStories(),
      ]);
      set({ loading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete story';
      set({ error: message, loading: false });
    }
  },
}));