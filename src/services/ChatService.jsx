// src/services/ChatService.js
import axiosInstance from '../utils/apiAxios';

export const ChatService = {
  // Search users
  async searchUsers(searchTerm) {
    const response = await axiosInstance.get(`api/User/UserSearch/${searchTerm}`);
    return response.data;
  },

  // Get chat history with another user
  async getChatHistory(otherUserID, skip = 0, take = 50) {
    const response = await axiosInstance.get(
      `api/Chat/history/${otherUserID}?skip=${skip}&take=${take}`
    );
    return response.data;
  },

  // Get all conversations for current user
  async getConversations() {
    const response = await axiosInstance.get('api/Chat/conversations');
    return response.data;
  },

  // Get unread message count
  async getUnreadCount() {
    const response = await axiosInstance.get('api/Chat/unread-count');
    return response.data;
  },

  // Mark messages as read
  async markMessagesAsRead(senderID) {
    const response = await axiosInstance.post(`api/Chat/mark-read/${senderID}`);
    return response.data;
  },

  // Get online users
  async getOnlineUsers() {
    const response = await axiosInstance.get('api/Chat/online-users');
    return response.data;
  },

  // Check if user is online
  async isUserOnline(userID) {
    const response = await axiosInstance.get(`api/Chat/user-online/${userID}`);
    return response.data;
  }
};