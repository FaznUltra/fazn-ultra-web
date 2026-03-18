import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  profileImage?: string | null;
  profilePicture?: string;
  stats?: {
    totalChallenges: number;
    wins: number;
    losses: number;
    draws?: number;
    totalEarnings: number;
    totalStaked: number;
  };
  streamingAccounts?: {
    youtube?: {
      channelUrl?: string | null;
      channelId?: string | null;
      channelName?: string | null;
      profileImage?: string | null;
      subscriberCount?: number;
      verified?: boolean;
      accessToken?: string | null;
      refreshToken?: string | null;
    };
    twitch?: {
      channelUrl?: string | null;
      channelId?: string | null;
      channelName?: string | null;
      profileImage?: string | null;
      followerCount?: number;
      verified?: boolean;
      accessToken?: string | null;
      refreshToken?: string | null;
    };
  };
  isVerified: boolean;
  createdAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  streamingAccounts?: {
    youtube?: {
      channelUrl?: string;
      channelId?: string;
    };
    twitch?: {
      channelUrl?: string;
      channelId?: string;
    };
  };
}

export const userService = {
  getProfile: async (userId: string): Promise<ApiResponse<{ user: UserProfile }>> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<{ user: UserProfile }>> => {
    const response = await apiClient.put('/users/profile', data);
    return response.data;
  },

  getUserById: async (userId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },
};
