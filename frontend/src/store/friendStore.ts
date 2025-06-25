
import { create } from 'zustand';
import axios from 'axios';
import {User} from '../types/user';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:4000";

interface FriendsState {
  allUsers: User[];
  friends:  User[];
  onlineFriends: number[]; 
  searchResults: User[];

  loading: boolean;
  error: string | null;

  fetchFriends: () => Promise<void>;
  fetchOnlineFriends: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
  searchFriends: (query: string) => Promise<void>;
  getUserStatus: (userId: number) => Promise<'online' | 'offline'>; 
  getUserSeen: (userId: number) => Promise<{ lastSeen: string | null; status: 'online' | 'offline' }>;
  addFriend: (friendId: number) => Promise<void>;
  removeFriend: (friendId: number) => Promise<void>;
  clearSearch: () => void;

  fetchFriendDetails: (friendId: number) => Promise<void>;
  clearSelectedFriend: () => void;
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      set({ error: message, loading: false });
    }
  },

  fetchFriends: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get('/friend/list');
      set({ friends: res.data.friends, loading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      set({ error: message, loading: false });
    }
  },

  fetchOnlineFriends: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get('/friend/online');
      // Online friends are just IDs
      set({ onlineFriends: res.data.online, loading: false });
  
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      set({ error: message, loading: false });
    }
  },

  
fetchFriendDetails: async (friendId: number) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.get(`/friend/details/${friendId}`);
    return res.data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    set({ error: message, loading: false });
  }
},

clearSelectedFriend: () => set({ selectedFriend: null }),



  searchFriends: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/friend/search?query=${encodeURIComponent(query)}`);
      set({ searchResults: res.data.results, loading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      set({ error: message, loading: false });
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
  } catch {
    return { lastSeen: null, status: 'offline' };
  }
},


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
    } catch (error: unknown) {
      let message = 'Unknown error';
      if (error && typeof error === 'object') {
        type AxiosError = { response?: { data?: { error?: string } }, message?: string };
        const err = error as AxiosError;
        if ('response' in err && typeof err.response?.data?.error === 'string') {
          message = err.response.data.error as string;
        } else if ('message' in err && typeof err.message === 'string') {
          message = err.message as string;
        }
      }
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      set({ error: message, loading: false });
    }
  },

  clearSearch: () => set({ searchResults: [] }),
}));