"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFriendsStore = void 0;
const zustand_1 = require("zustand");
const axios_1 = __importDefault(require("axios"));
axios_1.default.defaults.withCredentials = true;
axios_1.default.defaults.baseURL = "https://chat-app-tk-blg.fly.dev";
exports.useFriendsStore = (0, zustand_1.create)((set, get) => ({
    allUsers: [],
    friends: [],
    onlineFriends: [],
    searchResults: [],
    selectedFriend: null,
    loading: false,
    error: null,
    fetchAllUsers: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios_1.default.get('/friend/all');
            set({ allUsers: res.data.users, loading: false });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            set({ error: message, loading: false });
        }
    },
    fetchFriends: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios_1.default.get('/friend/list');
            set({ friends: res.data.friends, loading: false });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            set({ error: message, loading: false });
        }
    },
    fetchOnlineFriends: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios_1.default.get('/friend/online');
            // Online friends are just IDs
            set({ onlineFriends: res.data.online, loading: false });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            set({ error: message, loading: false });
        }
    },
    fetchFriendDetails: async (friendId) => {
        set({ loading: true, error: null });
        try {
            const res = await axios_1.default.get(`/friend/details/${friendId}`);
            const friend = res.data.friend;
            set({ selectedFriend: friend, loading: false });
            return friend;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            set({ error: message, loading: false });
        }
    },
    clearSelectedFriend: () => set({ selectedFriend: null }),
    searchFriends: async (query) => {
        if (!query.trim()) {
            set({ searchResults: [] });
            return;
        }
        set({ loading: true, error: null });
        try {
            const res = await axios_1.default.get(`/friend/search?query=${encodeURIComponent(query)}`);
            set({ searchResults: res.data.results, loading: false });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            set({ error: message, loading: false });
        }
    },
    getUserSeen: async (userId) => {
        try {
            const { onlineFriends } = get();
            const isOnline = onlineFriends.includes(userId);
            if (isOnline) {
                return { status: 'online', lastSeen: null };
            }
            const res = await axios_1.default.get(`/friend/status/${userId}`);
            return {
                lastSeen: res.data.lastSeen,
                status: res.data.status,
            };
        }
        catch {
            return { lastSeen: null, status: 'offline' };
        }
    },
    getUserStatus: async (userId) => {
        const { onlineFriends } = get();
        return onlineFriends.includes(userId) ? 'online' : 'offline';
    },
    addFriend: async (friendId) => {
        set({ loading: true, error: null });
        try {
            await axios_1.default.post('/friend/add', { friendId }, {
                headers: { 'Content-Type': 'application/json' }
            });
            await get().fetchFriends();
            await get().fetchOnlineFriends();
            set({ loading: false });
        }
        catch (error) {
            let message = 'Unknown error';
            if (error && typeof error === 'object') {
                const err = error;
                if ('response' in err && typeof err.response?.data?.error === 'string') {
                    message = err.response.data.error;
                }
                else if ('message' in err && typeof err.message === 'string') {
                    message = err.message;
                }
            }
            set({ error: message, loading: false });
        }
    },
    removeFriend: async (friendId) => {
        set({ loading: true, error: null });
        try {
            await axios_1.default.post('/friend/remove', { friendId });
            await get().fetchFriends();
            await get().fetchOnlineFriends();
            set({ loading: false });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            set({ error: message, loading: false });
        }
    },
    clearSearch: () => set({ searchResults: [] }),
}));
