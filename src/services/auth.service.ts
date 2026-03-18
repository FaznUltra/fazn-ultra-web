import { apiClient } from '@/lib/axios';
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  OTPVerifyRequest,
  OTPResponse,
  User,
} from '@/types/api';

export const authService = {
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  sendOTP: async (): Promise<ApiResponse<OTPResponse>> => {
    const response = await apiClient.post('/otp/send');
    return response.data;
  },

  verifyOTP: async (data: OTPVerifyRequest): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.post('/otp/verify', data);
    return response.data;
  },

  resendOTP: async (): Promise<ApiResponse<OTPResponse>> => {
    const response = await apiClient.post('/otp/resend');
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> => {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  googleSignIn: async (idToken: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/google/mobile', { idToken });
    return response.data;
  },
};
