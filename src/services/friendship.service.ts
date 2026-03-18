import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export interface FriendUser {
  _id: string;
  displayName: string;
  profileImage: string | null;
  email: string;
  isVerified: boolean;
}

export interface Friendship {
  _id: string;
  requester: FriendUser;
  recipient: FriendUser;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';
  createdAt: string;
  updatedAt: string;
}

export const friendshipService = {
  sendFriendRequest: async (recipientId: string): Promise<ApiResponse<{ friendship: Friendship }>> => {
    const response = await apiClient.post('/friendships/request', { recipientId });
    return response.data;
  },

  acceptFriendRequest: async (friendshipId: string): Promise<ApiResponse<{ friendship: Friendship }>> => {
    const response = await apiClient.put(`/friendships/accept/${friendshipId}`);
    return response.data;
  },

  rejectFriendRequest: async (friendshipId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete(`/friendships/reject/${friendshipId}`);
    return response.data;
  },

  unfriend: async (userId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete(`/friendships/unfriend/${userId}`);
    return response.data;
  },

  blockUser: async (userId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post('/friendships/block', { userId });
    return response.data;
  },

  unblockUser: async (userId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete(`/friendships/unblock/${userId}`);
    return response.data;
  },

  getFriends: async (): Promise<ApiResponse<{ friends: Friendship[] }>> => {
    const response = await apiClient.get('/friendships/friends');
    return response.data;
  },

  getPendingRequests: async (): Promise<ApiResponse<{ requests: Friendship[] }>> => {
    const response = await apiClient.get('/friendships/requests/pending');
    return response.data;
  },

  getSentRequests: async (): Promise<ApiResponse<{ requests: Friendship[] }>> => {
    const response = await apiClient.get('/friendships/requests/sent');
    return response.data;
  },

  getBlockedUsers: async (): Promise<ApiResponse<{ users: FriendUser[] }>> => {
    const response = await apiClient.get('/friendships/blocked');
    return response.data;
  },

  searchUsers: async (query: string): Promise<ApiResponse<{ users: FriendUser[] }>> => {
    const response = await apiClient.get('/users/search', {
      params: { query, limit: 20 },
    });
    return response.data;
  },
};
