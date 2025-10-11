import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/chat/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/chat/conversations/${conversationId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { conversationId, messages: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, message, recipientId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/chat/messages`,
        {
          conversationId,
          message,
          recipientId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (recipientId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/chat/conversations`,
        { recipientId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create conversation');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'chat/markAsRead',
  async (conversationId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/chat/conversations/${conversationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return conversationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

// Initial state
const initialState = {
  conversations: [],
  activeConversation: null,
  messages: {},
  onlineUsers: [],
  typing: {},
  unreadCount: 0,
  loading: false,
  messagesLoading: false,
  error: null,
  connectionStatus: 'disconnected', // connected, disconnected, connecting
};

// Slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
      
      // Update last message in conversation
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.lastMessage = message;
        conversation.updatedAt = message.timestamp;
      }
    },
    setTyping: (state, action) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (!state.typing[conversationId]) {
        state.typing[conversationId] = {};
      }
      if (isTyping) {
        state.typing[conversationId][userId] = true;
      } else {
        delete state.typing[conversationId][userId];
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    updateConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    incrementUnreadCount: (state, action) => {
      const conversation = state.conversations.find(c => c.id === action.payload);
      if (conversation) {
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
        state.unreadCount = state.conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
      }
    },
    resetUnreadCount: (state, action) => {
      const conversation = state.conversations.find(c => c.id === action.payload);
      if (conversation) {
        state.unreadCount -= conversation.unreadCount || 0;
        conversation.unreadCount = 0;
      }
    },
    clearChat: (state) => {
      state.conversations = [];
      state.activeConversation = null;
      state.messages = {};
      state.typing = {};
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch Conversations
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
        state.unreadCount = action.payload.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Fetch Messages
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.messagesLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        state.messages[action.payload.conversationId] = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.error = action.payload;
      });
    
    // Send Message
    builder
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { conversationId } = action.payload;
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        state.messages[conversationId].push(action.payload);
        
        // Update conversation
        const conversation = state.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.lastMessage = action.payload;
          conversation.updatedAt = action.payload.timestamp;
        }
      });
    
    // Create Conversation
    builder
      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload);
        state.activeConversation = action.payload.id;
      });
    
    // Mark as Read
    builder
      .addCase(markAsRead.fulfilled, (state, action) => {
        const conversation = state.conversations.find(c => c.id === action.payload);
        if (conversation) {
          state.unreadCount -= conversation.unreadCount || 0;
          conversation.unreadCount = 0;
        }
      });
  },
});

export const {
  setActiveConversation,
  addMessage,
  setTyping,
  setOnlineUsers,
  updateConnectionStatus,
  incrementUnreadCount,
  resetUnreadCount,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;