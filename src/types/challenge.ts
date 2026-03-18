export type GameType = 'FOOTBALL' | 'SOCCER' | 'RACING' | 'BASKETBALL' | 'TENNIS';
export type GameName = 'DREAM_LEAGUE_SOCCER' | 'EFOOTBALL_MOBILE';
export type Platform = 'CONSOLE' | 'MOBILE';
export type ChallengeType = 'DIRECT' | 'FRIENDS' | 'PUBLIC';
export type ChallengeStatus = 
  | 'OPEN' 
  | 'PENDING_ACCEPTANCE' 
  | 'ACCEPTED' 
  | 'LIVE'
  | 'REJECTED' 
  | 'CANCELLED' 
  | 'REFUNDED' 
  | 'COMPLETED' 
  | 'DISPUTED'
  | 'FLAGGED'
  | 'SETTLED';

export type StreamingPlatform = 'YOUTUBE' | 'TWITCH';

export interface StreamingLink {
  platform: StreamingPlatform;
  url: string;
}

export interface FinalScore {
  creator: number;
  acceptor: number;
}

export interface Challenge {
  _id: string;
  creator: {
    _id: string;
    displayName: string;
    profileImage?: string;
    isVerified?: boolean;
  };
  creatorUsername: string;
  acceptor?: {
    _id: string;
    displayName: string;
    profileImage?: string;
    isVerified?: boolean;
  };
  acceptorUsername?: string;
  gameType: GameType;
  gameName: GameName;
  platform: Platform;
  challengeType: ChallengeType;
  stakeAmount: number;
  currency: string;
  totalPot: number;
  platformFee: number;
  witnessFee: number;
  winnerPayout: number;
  status: ChallengeStatus;
  acceptanceDueDate: string;
  matchStartTime: string;
  gamePeriod: number;
  includeExtraTime: boolean;
  includePenalty: boolean;
  creatorStreamingLink?: StreamingLink;
  acceptorStreamingLink?: StreamingLink;
  witness?: {
    _id: string;
    displayName: string;
    profileImage?: string;
    isVerified?: boolean;
    witnessReputation?: number;
  };
  witnessUsername?: string;
  witnessVerifiedAt?: string;
  roomCode?: string;
  roomCodeSharedAt?: string;
  creatorJoinedRoom?: boolean;
  acceptorJoinedRoom?: boolean;
  matchStartedAt?: string;
  isFlagged?: boolean;
  flaggedBy?: string;
  flaggedByRole?: 'CREATOR' | 'ACCEPTOR' | 'WITNESS';
  flagReason?: string;
  flaggedAt?: string;
  winner?: {
    _id: string;
    displayName: string;
    profileImage?: string;
  };
  winnerUsername?: string;
  loser?: {
    _id: string;
    displayName: string;
    profileImage?: string;
  };
  loserUsername?: string;
  finalScore?: FinalScore;
  disputeDeadline?: string;
  isDisputed?: boolean;
  disputedBy?: string;
  disputeReason?: string;
  disputedAt?: string;
  reviewStatus?: 'NONE' | 'PENDING_REVIEW' | 'UNDER_REVIEW' | 'RESOLVED';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewDecision?: 'UPHOLD' | 'OVERTURN' | 'REFUND' | 'PUNISH_WITNESS' | 'PUNISH_DISPUTER';
  reviewNotes?: string;
  originalWinner?: string;
  completedAt?: string;
  settledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvailableGame {
  gameType: GameType;
  gameName: GameName;
  displayName: string;
  platforms: Platform[];
  defaultGamePeriod: number;
}

export interface CreateChallengeRequest {
  gameType: GameType;
  gameName: GameName;
  platform: Platform;
  challengeType: ChallengeType;
  stakeAmount: number;
  currency?: string;
  acceptanceDueDate: string;
  matchStartTime: string;
  includeExtraTime?: boolean;
  includePenalty?: boolean;
  directOpponentId?: string;
  creatorStreamingLink?: StreamingLink;
}

export interface AcceptChallengeRequest {
  acceptorStreamingLink?: StreamingLink;
}

export interface RejectChallengeRequest {
  reason?: string;
}

export interface CancelChallengeRequest {
  reason?: string;
}

export interface UpdateStreamingLinkRequest {
  platform: StreamingPlatform;
  url: string;
}

export interface SubmitResultRequest {
  winnerId: string;
  creatorScore: number;
  acceptorScore: number;
}

export interface FlagMatchRequest {
  reason: string;
}

export interface CompleteMatchRequest {
  creatorScore: number;
  acceptorScore: number;
}

export interface DisputeMatchRequest {
  reason: string;
}

export interface ChallengeStats {
  totalChallenges: number;
  wins: number;
  losses: number;
  winRate: number;
  totalEarnings: number;
  totalStaked: number;
  activeChallenges: number;
  totalWinnings: number;
}

export interface PaginatedChallenges {
  challenges: Challenge[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
