"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStoryStore = void 0;
const zustand_1 = require("zustand");
const axios_1 = __importDefault(require("axios"));
axios_1.default.defaults.withCredentials = true;
axios_1.default.defaults.baseURL = "https://chat-app-tk-blg.fly.dev";
exports.useStoryStore = (0, zustand_1.create)((set) => ({
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
            const res = await axios_1.default.get('/story/friends');
            set({ stories: res.data.groupedStories, loading: false });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch stories';
            set({ error: message, loading: false });
        }
    },
    fetchMyStories: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios_1.default.get('/story/');
            console.log('My stories response:', res.data);
            set({ myStoryGroup: res.data.userStories, loading: false });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch your stories';
            set({ error: message, loading: false });
        }
    },
    uploadStory: async (data) => {
        set({ loading: true, error: null });
        try {
            await axios_1.default.post('/story/upload', data);
            await Promise.all([
                exports.useStoryStore.getState().fetchFriendStories(),
                exports.useStoryStore.getState().fetchMyStories(),
            ]);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to upload story';
            set({ error: message, loading: false });
        }
    },
    markViewed: async (storyId) => {
        try {
            await axios_1.default.post(`/story/view/${storyId}`);
        }
        catch (error) {
            console.error('Failed to mark as viewed', error);
        }
    },
    getStoryViewers: async (storyId) => {
        set({ loading: true, error: null });
        try {
            const res = await axios_1.default.get(`/story/view/${storyId}`);
            const viewers = Array.isArray(res.data.viewers) ? res.data.viewers : [];
            set({ viewers, loading: false });
            return viewers; // <--- This is important!
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch viewers';
            set({ error: message, loading: false, viewers: [] });
            return []; // <--- Always return an array
        }
    },
    deleteStory: async (storyId) => {
        set({ loading: true, error: null });
        try {
            await axios_1.default.delete(`/story/${storyId}`);
            // Refresh own and friend stories after deletion
            await Promise.all([
                exports.useStoryStore.getState().fetchFriendStories(),
                exports.useStoryStore.getState().fetchMyStories(),
            ]);
            set({ loading: false });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete story';
            set({ error: message, loading: false });
        }
    },
}));
