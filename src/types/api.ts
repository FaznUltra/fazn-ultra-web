export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  isVerified: boolean;
  profileImage?: string | null;
  profilePicture?: string;
  bio?: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  password: string;
}

export interface OTPVerifyRequest {
  otp: string;
}

export interface OTPResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetOTPRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}
