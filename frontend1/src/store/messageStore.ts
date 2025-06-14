import {create} from 'zustand';
import axios from 'axios';


axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:4000";

interface Chat {
  id: number;
  name: string;
  participants: { id: number }[];
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
  messages: Record<number, Message[]>; // key = chatId
  loading: boolean;
  error: string | null;

  fetchChatsSummary: () => Promise<void>;
  fetchMessages: (chatId?: number) => Promise<void>;
  createChat: (participantIds: number[], name?: string, isGroup?: boolean) => Promise<Chat | null>;
  sendMessage: (chatId: number, content?: string, file?: File) => Promise<void>;
 deleteChatEveryone: (chatId: number) => Promise<void>;
 deleteMessageEveryone: (chatId: number, messageId: number) => Promise<void>;

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
    const res = await axios.get('/message/message-list');
    const fetchedChats: Chat[] = res.data.chats;

    set({
      // Replace the whole chats array with fetchedChats to avoid duplicates
      // (assuming fetchedChats contains all chats from the server)
      chats: fetchedChats,
      loading: false
    });
  } catch (error: any) {
    console.error('Error fetching chats:', error);
    set({ error: error.message || 'Unknown error', loading: false });
  }
},

  fetchMessages: async (chatId) => {
    set({ loading: true, error: null });
    try {
      // Fix: Add proper endpoint and handle optional chatId
      if (!chatId) {
        set({ loading: false });
        return;
      }
      
      const res = await axios.get(`/message?chatId=${chatId}`);
    
      set(state => ({
        messages: {
          ...state.messages,
          [chatId]: res.data.messages,
        },
        loading: false,
      }));
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      set({ error: error.message || 'Unknown error', loading: false });
    }
  },

  createChat: async (participantIds, name = '', isGroup = false) => {
  set({ loading: true, error: null });
  try {
    const res = await axios.post('/message/create-chat', { participantIds, name, isGroup });
    // Always refetch chats from the backend to ensure up-to-date and normalized data
    await get().fetchChatsSummary();
    // Find the new chat from the freshly fetched state
    const newChatId = res.data.chat.id;
    const updatedChats = get().chats;
    const newChat = updatedChats.find(chat => chat.id === newChatId) || null;
    set({ loading: false });
    return newChat;
  } catch (error: any) {
    console.error('Error creating chat:', error);
    set({ error: error.message || 'Unknown error', loading: false });
    return null;
  }
},

  sendMessage: async (chatId, content, file) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('chatId', chatId.toString());
      if (content) formData.append('content', content);
      if (file) formData.append('image', file);

      // Fix: Send formData directly, not wrapped in an object
      const res = await axios.post('/message/send-message', formData, {
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
    } catch (error: any) {
      console.error('Error sending message:', error);
      set({ error: error.message || 'Unknown error', loading: false });
    }
  },




  //Delete a message for everyone
   deleteMessageEveryone: async (chatId:number, messageId:number) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/message/delete-user/${messageId}`);
      set(state => ({
        messages: {
          ...state.messages,
          [chatId]: (state.messages[chatId] || []).filter(m => m.id !== messageId),
        },
        loading: false,
      }));
    } catch (error: any) {
      console.error('Error deleting message for everyone:', error);
      set({ error: error.message || 'Unknown error', loading: false });
    }
  },

  //Delete chat for everyone 
  deleteChatEveryone: async (chatId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/message/delete-everyone/${chatId}`);
      set(state => ({
        chats: state.chats.filter(c => c.id !== chatId),
        messages: Object.fromEntries(
          Object.entries(state.messages).filter(([key]) => Number(key) !== chatId)
        ),
        loading: false,
      }));
    } catch (error: any) {
      console.error('Error deleting chat for everyone:', error);
      set({ error: error.message || 'Unknown error', loading: false });
    }
  },


  clearError: () => set({ error: null }),
}));


