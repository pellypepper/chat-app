"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChatStore = void 0;
const zustand_1 = require("zustand");
const axios_1 = __importDefault(require("axios"));
axios_1.default.defaults.withCredentials = true;
axios_1.default.defaults.baseURL = "https://chat-app-tk-blg.fly.dev";
exports.useChatStore = (0, zustand_1.create)((set, get) => ({
    chats: [],
    messages: {},
    loading: false,
    error: null,
    fetchChatsSummary: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios_1.default.get('/message/message-list');
            const fetchedChats = res.data.chats;
            set({
                chats: fetchedChats,
                loading: false
            });
        }
        catch (error) {
            console.error('Error fetching chats:', error);
            set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
    },
    fetchMessages: async (chatId) => {
        set({ loading: true, error: null });
        try {
            if (!chatId) {
                set({ loading: false });
                return;
            }
            const res = await axios_1.default.get(`/message?chatId=${chatId}`);
            set(state => ({
                messages: {
                    ...state.messages,
                    [chatId]: res.data.messages,
                },
                loading: false,
            }));
        }
        catch (error) {
            console.error('Error fetching messages:', error);
            set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
    },
    createChat: async (participantIds, name = '', isGroup = false) => {
        set({ loading: true, error: null });
        try {
            const res = await axios_1.default.post('/message/create-chat', { participantIds, name, isGroup });
            // refetch chats from the backend 
            await get().fetchChatsSummary();
            // Find the new chat from the freshly fetched state
            const newChatId = res.data.chat.id;
            const updatedChats = get().chats;
            const newChat = updatedChats.find(chat => chat.id === newChatId) || null;
            set({ loading: false });
            return newChat;
        }
        catch (error) {
            console.error('Error creating chat:', error);
            set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
            return null;
        }
    },
    sendMessage: async (chatId, content, file) => {
        set({ loading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('chatId', chatId.toString());
            if (content)
                formData.append('content', content);
            if (file)
                formData.append('image', file);
            // Send formData directly
            const res = await axios_1.default.post('/message/send-message', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            set(state => ({
                messages: {
                    ...state.messages,
                    [chatId]: [...(state.messages[chatId] || []), res.data.message],
                },
                loading: false,
            }));
        }
        catch (error) {
            console.error('Error sending message:', error);
            set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
    },
    updateGroupChat: async (chatId, name, addUserIds = [], removeUserIds = []) => {
        set({ loading: true, error: null });
        try {
            await axios_1.default.put(`/message/update-group/${chatId}`, {
                name,
                addUserIds,
                removeUserIds
            });
            // Refresh chat summaries after update
            await get().fetchChatsSummary();
            set({ loading: false });
        }
        catch (error) {
            console.error('Error updating group chat:', error);
            set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
    },
    deleteMessageEveryone: async (chatId, messageId) => {
        set({ loading: true, error: null });
        try {
            await axios_1.default.delete(`/message/delete-user/${messageId}`);
            set(state => ({
                messages: {
                    ...state.messages,
                    [chatId]: (state.messages[chatId] || []).filter(m => m.id !== messageId),
                },
                loading: false,
            }));
        }
        catch (error) {
            console.error('Error deleting message for everyone:', error);
            set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
    },
    //Delete chat for everyone 
    deleteChatEveryone: async (chatId) => {
        set({ loading: true, error: null });
        try {
            await axios_1.default.delete(`/message/delete-everyone/${chatId}`);
            set(state => ({
                chats: state.chats.filter(c => c.id !== chatId),
                messages: Object.fromEntries(Object.entries(state.messages).filter(([key]) => Number(key) !== chatId)),
                loading: false,
            }));
        }
        catch (error) {
            console.error('Error deleting chat for everyone:', error);
            set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
    },
    clearError: () => set({ error: null }),
}));
