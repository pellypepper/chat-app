import { create } from 'zustand';
import axios from 'axios';


axios.defaults.withCredentials = true;
axios.defaults.baseURL ="http://localhost:8080";


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
  stories: UserStoryGroup[]; // Friend stories
  myStoryGroup: UserStoryGroup | null; // Own story group
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
      const res = await axios.get('/story/friends');

      set({ stories: res.data.groupedStories, loading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch stories';
      set({ error: message, loading: false });
    }
  },

  fetchMyStories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get('/story/');
      console.log('My stories response:', res.data);
      set({ myStoryGroup: res.data.userStories, loading: false });
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch your stories';
      set({ error: message, loading: false });
    }
  },

  uploadStory: async (data: FormData) => {
    set({ loading: true, error: null });
    try {
      await axios.post('/story/upload', data);
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
      await axios.post(`/story/view/${storyId}`);

    } catch (error) {
      console.error('Failed to mark as viewed', error);
    }
  },
  getStoryViewers: async (storyId: number) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`/story/view/user/${storyId}`);
    const viewers = Array.isArray(res.data.viewers) ? res.data.viewers : [];
    set({ viewers, loading: false });
    return viewers; // <--- This is important!
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch viewers';
    set({ error: message, loading: false, viewers: [] });
    return []; // <--- Always return an array
  }
},
   deleteStory: async (storyId: number) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/story/${storyId}`);

      // Refresh own and friend stories after deletion
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
