import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export interface Notification {
  _id: string;
  userId: string;
  type: 'CHALLENGE' | 'FRIEND_REQUEST' | 'FRIEND_ACCEPT' | 'CHALLENGE_ACCEPTED' | 'CHALLENGE_COMPLETED' | 'PAYMENT' | 'SYSTEM';
  title: string;
  message: string;
  data: {
    challengeId?: string;
    friendshipId?: string;
    transactionId?: string;
    requesterId?: string;
    requesterName?: string;
    accepterId?: string;
    accepterName?: string;
    [key: string]: any;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const notificationService = {
  getNotifications: async (params?: {
    isRead?: boolean;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<{ notifications: Notification[]; unreadCount: number; pagination: any }>> => {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  },

  getUnreadCount: async (): Promise<ApiResponse<{ unreadCount: number }>> => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<{ notification: Notification }>> => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.patch('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },

  deleteAllRead: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete('/notifications/read/all');
    return response.data;
  },
};
