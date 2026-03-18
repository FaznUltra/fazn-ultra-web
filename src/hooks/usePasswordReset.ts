import { useMutation } from '@tanstack/react-query';
import { passwordResetService } from '@/services/passwordReset.service';
import { toast } from 'sonner';

export const usePasswordReset = () => {
  const forgotPasswordMutation = useMutation({
    mutationFn: passwordResetService.forgotPassword,
    onSuccess: (response) => {
      toast.success('Reset Code Sent', {
        description: response.message || 'Check your email for the reset code',
      });
    },
    onError: (error: any) => {
      toast.error('Failed to Send Reset Code', {
        description: error.response?.data?.message || 'Something went wrong',
      });
    },
  });

  const verifyResetOTPMutation = useMutation({
    mutationFn: passwordResetService.verifyResetOTP,
    onSuccess: (response) => {
      toast.success('Code Verified', {
        description: response.message || 'You can now reset your password',
      });
    },
    onError: (error: any) => {
      toast.error('Verification Failed', {
        description: error.response?.data?.message || 'Invalid code',
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: passwordResetService.resetPassword,
    onSuccess: (response) => {
      toast.success('Password Reset Successful', {
        description: response.message || 'You can now sign in with your new password',
      });
    },
    onError: (error: any) => {
      toast.error('Password Reset Failed', {
        description: error.response?.data?.message || 'Something went wrong',
      });
    },
  });

  return {
    forgotPassword: (email: string) => forgotPasswordMutation.mutate({ email }),
    verifyResetOTP: (email: string, otp: string) => verifyResetOTPMutation.mutate({ email, otp }),
    resetPassword: (email: string, otp: string, newPassword: string) =>
      resetPasswordMutation.mutate({ email, otp, newPassword }),
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isVerifyOTPLoading: verifyResetOTPMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,
  };
};
