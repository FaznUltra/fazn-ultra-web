import { apiClient } from '@/lib/axios';
import {
  ApiResponse,
  ForgotPasswordRequest,
  VerifyResetOTPRequest,
  ResetPasswordRequest,
} from '@/types/api';

export const passwordResetService = {
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  verifyResetOTP: async (data: VerifyResetOTPRequest): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/verify-reset-otp', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },
};
