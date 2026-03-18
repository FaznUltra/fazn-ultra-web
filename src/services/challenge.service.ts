import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import {
  Challenge,
  AvailableGame,
  CreateChallengeRequest,
  AcceptChallengeRequest,
  RejectChallengeRequest,
  CancelChallengeRequest,
  UpdateStreamingLinkRequest,
  SubmitResultRequest,
  FlagMatchRequest,
  CompleteMatchRequest,
  DisputeMatchRequest,
  ChallengeStats,
  PaginatedChallenges
} from '@/types/challenge';

export const challengeService = {
  getAvailableGames: async (): Promise<ApiResponse<{ games: AvailableGame[] }>> => {
    const response = await apiClient.get('/challenges/games');
    return response.data;
  },

  getChallengeHistory: async (params?: {
    status?: string;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<PaginatedChallenges>> => {
    const response = await apiClient.get('/challenges/history', { params });
    return response.data;
  },

  getPublicChallenges: async (params?: {
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<PaginatedChallenges>> => {
    const response = await apiClient.get('/challenges/public', { params });
    return response.data;
  },

  getFriendsChallenges: async (params?: {
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<PaginatedChallenges>> => {
    const response = await apiClient.get('/challenges/friends', { params });
    return response.data;
  },

  getWitnessingChallenges: async (params?: {
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<PaginatedChallenges>> => {
    const response = await apiClient.get('/challenges/witnessing', { params });
    return response.data;
  },

  getMyWitnessingChallenges: async (params?: {
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<PaginatedChallenges>> => {
    const response = await apiClient.get('/challenges/my-witnessing', { params });
    return response.data;
  },

  getChallengeStats: async (): Promise<ApiResponse<ChallengeStats>> => {
    const response = await apiClient.get('/challenges/stats');
    return response.data;
  },

  getChallengeById: async (id: string): Promise<ApiResponse<{ challenge: Challenge }>> => {
    const response = await apiClient.get(`/challenges/${id}`);
    return response.data;
  },

  createChallenge: async (data: CreateChallengeRequest): Promise<ApiResponse<{ challenge: Challenge }>> => {
    const response = await apiClient.post('/challenges', data);
    return response.data;
  },

  acceptChallenge: async (
    id: string,
    data?: AcceptChallengeRequest
  ): Promise<ApiResponse<{ challenge: Challenge }>> => {
    const response = await apiClient.post(`/challenges/${id}/accept`, data);
    return response.data;
  },

  rejectChallenge: async (
    id: string,
    data?: RejectChallengeRequest
  ): Promise<ApiResponse<{ challenge: Challenge }>> => {
    const response = await apiClient.post(`/challenges/${id}/reject`, data);
    return response.data;
  },

  cancelChallenge: async (
    id: string,
    data?: CancelChallengeRequest
  ): Promise<ApiResponse<{ challenge: Challenge }>> => {
    const response = await apiClient.post(`/challenges/${id}/cancel`, data);
    return response.data;
  },

  updateStreamingLink: async (
    id: string,
    data: UpdateStreamingLinkRequest
  ): Promise<ApiResponse<{ challenge: Challenge }>> => {
    const response = await apiClient.patch(`/challenges/${id}/streaming-link`, data);
    return response.data;
  },

  volunteerAsWitness: async (id: string): Promise<ApiResponse<{ challenge: Challenge }>> => {
    const response = await apiClient.post(`/challenges/${id}/volunteer-witness`);
    return response.data;
  },

  shareRoomCode: async (id: string, roomCode: string): Promise<ApiResponse<{ challenge: Challenge }>> => {
    const response = await apiClient.post(`/challenges/${id}/share-room-code`, { roomCode });
    return response.data;
  },

  confirmJoinedRoom: async (id: string): Promise<ApiResponse<{ challenge: Challenge }>> => {
    const response = await apiClient.post(`/challenges/${id}/confirm-joined`);
    return response.data;
  },

  startMatch: async (id: string): Promise<ApiResponse<{ challenge: Challenge }>> => {
    const response = await apiClient.post(`/challenges/${id}/start-match`);
    return response.data;
  },

  flagMatch: async (
    id: string,
    data: FlagMatchRequest
  ): Promise<ApiResponse<{ challenge: Challenge }>> => {
    const response = await apiClient.post(`/challenges/${id}/flag`, data);
    return response.data;
  },

  completeMatch: async (
    id: string,
    data: CompleteMatchRequest
  ): Promise<ApiResponse<{ challenge: Challenge }>> => {
    const response = await apiClient.post(`/challenges/${id}/complete`, data);
    return response.data;
  },

  disputeMatch: async (
    id: string,
    data: DisputeMatchRequest
  ): Promise<ApiResponse<{ challenge: Challenge }>> => {
    const response = await apiClient.post(`/challenges/${id}/dispute`, data);
    return response.data;
  },

  submitResult: async (
    id: string,
    data: SubmitResultRequest
  ): Promise<ApiResponse<{ challenge: Challenge }>> => {
    const response = await apiClient.post(`/challenges/${id}/result`, data);
    return response.data;
  },

  settleChallenge: async (id: string): Promise<ApiResponse<{ challenge: Challenge }>> => {
    const response = await apiClient.post(`/challenges/${id}/settle`);
    return response.data;
  },
};
