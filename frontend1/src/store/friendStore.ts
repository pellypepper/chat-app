import {create} from 'zustand';
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
  userStatus: UserStatus | null;
  loading: boolean;
  error: string | null;

  fetchFriends: () => Promise<void>;
  fetchOnlineFriends: () => Promise<void>;
    fetchAllUsers: () => Promise<void>;
  searchFriends: (query: string) => Promise<void>;
  getUserStatus: (userId: number) => Promise<void>;
  addFriend: (friendId: number) => Promise<void>;
  removeFriend: (friendId: number) => Promise<void>;
  clearSearch: () => void;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  allUsers: [],
  friends: [],
  onlineFriends: [],
  searchResults: [],
  userStatus: null,
  loading: false,
  error: null,

  fetchAllUsers: async()=>{
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

  getUserStatus: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/friend/status/${userId}`);
   
      set({ userStatus: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addFriend: async (friendId: number) => {
    set({ loading: true, error: null });
    try {
        console.log('Adding friend with ID:', friendId);
   await axios.post('/friend/add', { friendId }, {
  headers: { 'Content-Type': 'application/json' }
});
       console.log('Friend added successfully');
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
      await axios.post('/friend/remove', {friendId });
      await get().fetchFriends();
      await get().fetchOnlineFriends();
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  clearSearch: () => set({ searchResults: [] }),
}));
