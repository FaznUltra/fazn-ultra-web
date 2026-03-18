import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import { LoginFormData, RegisterFormData, OTPFormData } from '@/validations/auth.schema';
import { toast } from 'sonner';

export const useAuth = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setAuth, updateUser, clearAuth } = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (response) => {
      if (response.success && response.data) {
        const user = response.data.user;
        
        setAuth(user, response.data.token, response.data.refreshToken);
        
        toast.success('Welcome back!', {
          description: response.message || 'Login successful',
        });
        
        if (!user.isVerified) {
          try {
            await authService.sendOTP();
          } catch {
            console.warn('Failed to send OTP after login');
          }
          router.push('/verify-email');
        } else {
          router.push('/');
        }
      }
    },
    onError: (error: any) => {
      toast.error('Login Failed', {
        description: error.response?.data?.message || 'Invalid credentials',
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: async (response) => {
      if (response.success && response.data) {
        const user = response.data.user;
        
        setAuth(user, response.data.token, response.data.refreshToken);
        
        toast.success('Account Created!', {
          description: 'Check your email for verification code',
        });
        
        try {
          await authService.sendOTP();
        } catch {
          console.warn('Failed to send OTP after registration');
        }
        
        router.push('/verify-email');
      }
    },
    onError: (error: any) => {
      toast.error('Registration Failed', {
        description: error.response?.data?.message || 'Something went wrong',
      });
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: authService.verifyOTP,
    onSuccess: async (response) => {
      if (response.success && response.data) {
        const user = response.data.user;
        
        try {
          const freshUserResponse = await authService.getCurrentUser();
          
          if (freshUserResponse.success && freshUserResponse.data?.user) {
            updateUser(freshUserResponse.data.user);
          } else {
            updateUser(user);
          }
        } catch (error) {
          updateUser(user);
        }
        
        toast.success('Email Verified!', {
          description: 'Your account is now active',
        });
        
        setTimeout(() => {
          router.push('/');
        }, 500);
      }
    },
    onError: (error: any) => {
      toast.error('Verification Failed', {
        description: error.response?.data?.message || 'Invalid OTP',
      });
    },
  });

  const sendOTPMutation = useMutation({
    mutationFn: authService.sendOTP,
    onSuccess: (response) => {
      toast.success('OTP Sent', {
        description: response.message || 'Check your email',
      });
    },
    onError: (error: any) => {
      toast.error('Failed to Send OTP', {
        description: error.response?.data?.message || 'Something went wrong',
      });
    },
  });

  const resendOTPMutation = useMutation({
    mutationFn: authService.resendOTP,
    onSuccess: (response) => {
      toast.success('OTP Resent', {
        description: response.message || 'Check your email',
      });
    },
    onError: (error: any) => {
      toast.error('Failed to Resend OTP', {
        description: error.response?.data?.message || 'Please wait before requesting again',
      });
    },
  });

  const logout = () => {
    clearAuth();
    router.push('/sign-in');
    toast.success('Logged Out', {
      description: 'See you soon!',
    });
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    verifyOTP: verifyOTPMutation.mutate,
    sendOTP: sendOTPMutation.mutate,
    resendOTP: resendOTPMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isVerifyOTPLoading: verifyOTPMutation.isPending,
    isSendOTPLoading: sendOTPMutation.isPending,
    isResendOTPLoading: resendOTPMutation.isPending,
  };
};
