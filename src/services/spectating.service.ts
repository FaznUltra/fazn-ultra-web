import { apiClient } from '@/lib/axios';

export interface SpectatingMessage {
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  isDeleted: boolean;
  deletedBy?: string;
}

export const spectatingService = {
  // Get all public live matches
  getPublicLiveMatches: async (params?: { limit?: number; page?: number }) => {
    const response = await apiClient.get('/spectating/live', { params });
    return response.data;
  },

  // Join as spectator
  joinAsSpectator: async (challengeId: string) => {
    const response = await apiClient.post(`/spectating/${challengeId}/join`);
    return response.data;
  },

  // Leave as spectator
  leaveAsSpectator: async (challengeId: string) => {
    const response = await apiClient.post(`/spectating/${challengeId}/leave`);
    return response.data;
  },

  // Get community chat messages
  getCommunityChatMessages: async (challengeId: string, limit: number = 50) => {
    const response = await apiClient.get(`/spectating/${challengeId}/chat`, {
      params: { limit }
    });
    return response.data;
  },

  // Send community chat message
  sendCommunityChatMessage: async (challengeId: string, message: string) => {
    const response = await apiClient.post(`/spectating/${challengeId}/chat`, { message });
    return response.data;
  },

  // Delete community chat message
  deleteCommunityChatMessage: async (challengeId: string, messageIndex: number) => {
    const response = await apiClient.delete(`/spectating/${challengeId}/chat/${messageIndex}`);
    return response.data;
  }
};
