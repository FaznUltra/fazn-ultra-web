import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export interface StreamingAuthResponse {
  authUrl: string;
}

export interface LiveStreamStatus {
  isLive: boolean;
  streamUrl: string | null;
  title?: string;
  thumbnail?: string;
  viewerCount?: number;
  startedAt?: string;
  gameName?: string;
}

export const streamingService = {
  // YouTube
  getYoutubeAuthUrl: async (): Promise<ApiResponse<StreamingAuthResponse>> => {
    const response = await apiClient.get('/streaming/youtube/auth');
    return response.data;
  },

  disconnectYoutube: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete('/streaming/youtube/disconnect');
    return response.data;
  },

  getYoutubeLiveStatus: async (): Promise<ApiResponse<LiveStreamStatus>> => {
    const response = await apiClient.get('/streaming/youtube/live-status');
    return response.data;
  },

  // Twitch
  getTwitchAuthUrl: async (): Promise<ApiResponse<StreamingAuthResponse>> => {
    const response = await apiClient.get('/streaming/twitch/auth');
    return response.data;
  },

  disconnectTwitch: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete('/streaming/twitch/disconnect');
    return response.data;
  },

  getTwitchLiveStatus: async (): Promise<ApiResponse<LiveStreamStatus>> => {
    const response = await apiClient.get('/streaming/twitch/live-status');
    return response.data;
  },
};
