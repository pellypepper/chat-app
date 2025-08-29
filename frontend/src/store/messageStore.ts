import {create} from 'zustand';
import axios from 'axios';

axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-railway.app'
  : "http://localhost:8080";

interface Chat {
  id: number;
  name: string;
  participants: { id: number, profilePicture: string }[];
  isGroup: boolean;
  lastMessage: string | null;
  lastMessageAt: string | null;
  createdAt: string;
}

interface Message {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  createdAt: string;
  type?: 'text' | 'image';
}

interface ChatStore {
  chats: Chat[];
  messages: Record<number, Message[]>; 
  loading: boolean;
  error: string | null;

  fetchChatsSummary: () => Promise<void>;
  fetchMessages: (chatId?: number) => Promise<void>;
  createChat: (participantIds: number[], name?: string, isGroup?: boolean) => Promise<Chat | null>;
  sendMessage: (chatId: number, content?: string, file?: File) => Promise<void>;
  deleteChatEveryone: (chatId: number) => Promise<void>;
  deleteMessageEveryone: (chatId: number, messageId: number) => Promise<void>;
  updateGroupChat: (
    chatId: number,
    name?: string,
    addUserIds?: number[],
    removeUserIds?: number[]
  ) => Promise<void>;
  clearError: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  messages: {},
  loading: false,
  error: null,

  fetchChatsSummary: async () => {
    set({ loading: true, error: null });
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get('/message/message-list', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const fetchedChats: Chat[] = res.data.chats;
      set({
        chats: fetchedChats,
        loading: false
      });
    } catch (error: unknown) {
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
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(`/message?chatId=${chatId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      set(state => ({
        messages: {
          ...state.messages,
          [chatId]: res.data.messages,
        },
        loading: false,
      }));
    } catch (error: unknown) {
      console.error('Error fetching messages:', error);
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },

  createChat: async (participantIds, name = '', isGroup = false) => {
    set({ loading: true, error: null });
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.post('/message/create-chat', { participantIds, name, isGroup }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      await get().fetchChatsSummary();
      const newChatId = res.data.chat.id;
      const updatedChats = get().chats;
      const newChat = updatedChats.find(chat => chat.id === newChatId) || null;
      set({ loading: false });
      return newChat;
    } catch (error: unknown) {
      console.error('Error creating chat:', error);
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
      return null;
    }
  },

  sendMessage: async (chatId, content, file) => {
    set({ loading: true, error: null });
    try {
      const accessToken = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append('chatId', chatId.toString());
      if (content) formData.append('content', content);
      if (file) formData.append('image', file);

      const res = await axios.post('/message/send-message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`
        },
      });
      set(state => ({
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), res.data.message],
        },
        loading: false,
      }));
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },

  updateGroupChat: async (chatId, name, addUserIds = [], removeUserIds = []) => {
    set({ loading: true, error: null });
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.put(`/message/update-group/${chatId}`, {
        name,
        addUserIds,
        removeUserIds
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      await get().fetchChatsSummary();
      set({ loading: false });
    } catch (error: unknown) {
      console.error('Error updating group chat:', error);
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },

  deleteMessageEveryone: async (chatId:number, messageId:number) => {
    set({ loading: true, error: null });
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`/message/delete-user/${messageId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      set(state => ({
        messages: {
          ...state.messages,
          [chatId]: (state.messages[chatId] || []).filter(m => m.id !== messageId),
        },
        loading: false,
      }));
    } catch (error: unknown) {
      console.error('Error deleting message for everyone:', error);
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },

  deleteChatEveryone: async (chatId) => {
    set({ loading: true, error: null });
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(`/message/delete-everyone/${chatId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      set(state => ({
        chats: state.chats.filter(c => c.id !== chatId),
        messages: Object.fromEntries(
          Object.entries(state.messages).filter(([key]) => Number(key) !== chatId)
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      console.error('Error deleting chat for everyone:', error);
      set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));