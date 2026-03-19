import { apiClient } from '@/lib/axios';

export interface SpectatorComment {
  _id: string;
  challenge: string;
  user: string;
  username: string;
  userProfileImage: string | null;
  comment: string;
  reactions: {
    type: 'LIKE' | 'LOVE' | 'FIRE' | 'LAUGH' | 'WOW' | 'CLAP';
    user: string;
    username: string;
    createdAt: string;
  }[];
  reactionCounts: {
    LIKE: number;
    LOVE: number;
    FIRE: number;
    LAUGH: number;
    WOW: number;
    CLAP: number;
  };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicChallenge {
  _id: string;
  creator: {
    _id: string;
    displayName: string;
    profileImage: string | null;
    isVerified: boolean;
  };
  acceptor: {
    _id: string;
    displayName: string;
    profileImage: string | null;
    isVerified: boolean;
  } | null;
  witness: {
    _id: string;
    displayName: string;
    profileImage: string | null;
    isVerified: boolean;
    witnessReputation: number;
  } | null;
  gameType: string;
  gameName: string;
  platform: string;
  challengeType: string;
  stakeAmount: number;
  currency: string;
  totalPot: number;
  platformFee: number;
  witnessFee: number;
  winnerPayout: number;
  status: string;
  acceptanceDueDate: string;
  matchStartTime: string;
  gamePeriod: number;
  includeExtraTime: boolean;
  includePenalty: boolean;
  creatorStreamingLink: {
    platform: 'YOUTUBE' | 'TWITCH' | null;
    url: string | null;
  };
  acceptorStreamingLink: {
    platform: 'YOUTUBE' | 'TWITCH' | null;
    url: string | null;
  };
  hashtag: string | null;
  spectating: {
    isPublic: boolean;
    spectatorCount: number;
    totalComments: number;
    totalReactions: number;
  };
  matchStartedAt: string | null;
  winner: {
    _id: string;
    displayName: string;
    profileImage: string | null;
  } | null;
  loser: {
    _id: string;
    displayName: string;
    profileImage: string | null;
  } | null;
  finalScore: {
    creator: number | null;
    acceptor: number | null;
  };
  completedAt: string | null;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const spectateService = {
  // Get public challenge details (NO AUTH REQUIRED)
  getPublicChallenge: async (challengeId: string): Promise<ApiResponse<{ challenge: PublicChallenge }>> => {
    const response = await apiClient.get(`/spectate/challenge/${challengeId}`);
    return response.data;
  },

  // Get live matches feed (NO AUTH REQUIRED)
  getLiveMatchesFeed: async (limit = 20, skip = 0): Promise<ApiResponse<{ challenges: PublicChallenge[]; count: number }>> => {
    const response = await apiClient.get(`/spectate/live-feed?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  // Search by hashtag (NO AUTH REQUIRED)
  searchByHashtag: async (hashtag: string, limit = 20, skip = 0): Promise<ApiResponse<{ hashtag: string; challenges: PublicChallenge[]; count: number }>> => {
    const response = await apiClient.get(`/spectate/hashtag/${hashtag}?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  // Get comments (NO AUTH REQUIRED)
  getComments: async (challengeId: string, limit = 50, skip = 0): Promise<ApiResponse<{ comments: SpectatorComment[]; count: number }>> => {
    const response = await apiClient.get(`/spectate/challenge/${challengeId}/comments?limit=${limit}&skip=${skip}`);
    return response.data;
  },

  // Join as spectator (OPTIONAL AUTH)
  joinAsSpectator: async (challengeId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.post(`/spectate/challenge/${challengeId}/join`);
    return response.data;
  },

  // Post comment (REQUIRES AUTH)
  postComment: async (challengeId: string, comment: string): Promise<ApiResponse<{ comment: SpectatorComment }>> => {
    const response = await apiClient.post(`/spectate/challenge/${challengeId}/comments`, { comment });
    return response.data;
  },

  // Add reaction (REQUIRES AUTH)
  addReaction: async (commentId: string, reactionType: 'LIKE' | 'LOVE' | 'FIRE' | 'LAUGH' | 'WOW' | 'CLAP'): Promise<ApiResponse<{ comment: SpectatorComment }>> => {
    const response = await apiClient.post(`/spectate/comments/${commentId}/react`, { reactionType });
    return response.data;
  },

  // Remove reaction (REQUIRES AUTH)
  removeReaction: async (commentId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/spectate/comments/${commentId}/react`);
    return response.data;
  },

  // Delete comment (REQUIRES AUTH)
  deleteComment: async (commentId: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/spectate/comments/${commentId}`);
    return response.data;
  }
};
