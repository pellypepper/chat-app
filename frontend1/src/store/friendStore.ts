
import { create } from 'zustand';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:4000";

interface Friend {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

interface UserStatus {
  userId: number;
  status: 'online' | 'offline';
  lastSeen: string | null;
}

interface FriendsState {
  allUsers: Friend[];
  friends: Friend[];
  onlineFriends: number[]; // just IDs of online friends
  searchResults: Friend[];
  // userStatus and status removed, not needed for per-user status anymore
  loading: boolean;
  error: string | null;

  fetchFriends: () => Promise<void>;
  fetchOnlineFriends: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  searchFriends: (query: string) => Promise<void>;
  getUserStatus: (userId: number) => Promise<'online' | 'offline'>; // return status directly
  addFriend: (friendId: number) => Promise<void>;
  removeFriend: (friendId: number) => Promise<void>;
  clearSearch: () => void;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  allUsers: [],
  friends: [],
  onlineFriends: [],
  searchResults: [],
  loading: false,
  error: null,

  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get('/friend/all');
      set({ allUsers: res.data.users, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchFriends: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get('/friend/list');
      set({ friends: res.data.friends, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchOnlineFriends: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get('/friend/online');
      // Online friends are just IDs
      set({ onlineFriends: res.data.online, loading: false });
  
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  searchFriends: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/friend/search?query=${encodeURIComponent(query)}`);
      set({ searchResults: res.data.results, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
    getUserSeen: async (userId: number) => {

    try {
       const { onlineFriends } = get();
const isOnline = onlineFriends.includes(userId)
if (isOnline) {
          return { status: 'online', lastSeen: null };
        }
      const res = await axios.get(`/friend/status/${userId}`);
      
    return {
      lastSeen: res.data.lastSeen,
      status: res.data.status,
    };
  } catch (error: any) {
    return { lastSeen: null, status: 'offline' };
  }
},

  // FIX: getUserStatus now returns status based on onlineFriends state, not from API
  getUserStatus: async (userId: number) => {
    const { onlineFriends } = get();
    return onlineFriends.includes(userId) ? 'online' : 'offline';
  },

  addFriend: async (friendId: number) => {
    set({ loading: true, error: null });
    try {
      await axios.post('/friend/add', { friendId }, {
        headers: { 'Content-Type': 'application/json' }
      });
      await get().fetchFriends();
      await get().fetchOnlineFriends();
      set({ loading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Unknown error';
      set({ error: message, loading: false });
    }
  },

  removeFriend: async (friendId: number) => {
    set({ loading: true, error: null });
    try {
      await axios.post('/friend/remove', { friendId });
      await get().fetchFriends();
      await get().fetchOnlineFriends();
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  clearSearch: () => set({ searchResults: [] }),
}));