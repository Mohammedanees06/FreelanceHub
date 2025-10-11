import api from './authApi';

export const getMessages = async (conversationId) => {
  // Adds validation to prevent undefined calls
  if (!conversationId) {
    console.error('getMessages called with undefined conversationId');
    throw new Error('Conversation ID is required');
  }
  const response = await api.get(`/messages/${conversationId}`);
  return response.data;
};

export const sendMessage = async (messageData) => {
  const response = await api.post('/messages', messageData);
  return response.data;
};

export const getConversations = async () => {
  const response = await api.get('/messages/conversations');
  return response.data;
};

export const markAsRead = async (messageId) => {
  if (!messageId) {
    console.error('markAsRead called with undefined messageId');
    throw new Error('Message ID is required');
  }
  const response = await api.put(`/messages/${messageId}/read`);
  return response.data;
};

export const deleteMessage = async (messageId) => {
  if (!messageId) {
    console.error('deleteMessage called with undefined messageId');
    throw new Error('Message ID is required');
  }
  const response = await api.delete(`/messages/${messageId}`);
  return response.data;
};


export const createOrGetConversation = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  const response = await api.post('/messages/conversations', { 
    participantId: userId 
  });
  return response.data;
};