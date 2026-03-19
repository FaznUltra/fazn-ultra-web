'use client';

import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Lock } from 'lucide-react';
import { resetPasswordSchema, ResetPasswordFormData } from '@/validations/passwordReset.schema';
import { usePasswordReset } from '@/hooks/usePasswordReset';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const otp = searchParams.get('otp') || '';
  const { resetPassword, isResetPasswordLoading } = usePasswordReset();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (password: string): string => {
    const strength = getPasswordStrength(password);
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    if (strength === 4) return 'Strong';
    return '';
  };

  const getPasswordStrengthColor = (password: string): string => {
    const strength = getPasswordStrength(password);
    if (strength === 1) return 'bg-[#FF6B6B]';
    if (strength === 2) return 'bg-[#FF9F43]';
    if (strength === 3) return 'bg-[#FBCB4A]';
    if (strength === 4) return 'bg-[#00FFB2]';
    return 'bg-white/10';
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword(email, otp, data.newPassword);
      router.push('/sign-in');
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  if (!email || !otp) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#03060b] px-4">
        <div className="text-center">
          <p className="mb-4 text-lg font-bold text-[#FF6B6B]">Invalid reset link</p>
          <button
            onClick={() => router.push('/forgot-password')}
            className="h-12 rounded-2xl px-6 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: '#00FFB2', color: '#05070b' }}
          >
            Go to Forgot Password
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#03060b] px-4 py-12">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.back()}
          className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 transition-all hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5 text-white/70" />
        </button>

        <div className="mb-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full" style={{ background: 'rgba(0,255,178,0.12)' }}>
              <Lock className="h-12 w-12 text-[#00FFB2]" />
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white">Create New Password</h1>
          <p className="text-white/50 leading-relaxed">Choose a strong password for your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-white/70">
              New Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-white/40" />
              </div>
              <input
                {...register('newPassword')}
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-base font-medium text-white placeholder:text-white/30 focus:border-[#00FFB2] focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50 transition-all"
              />
            </div>
            {newPassword && (
              <div className="mt-3">
                <div className="mb-2 flex gap-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        getPasswordStrength(newPassword) >= level
                          ? getPasswordStrengthColor(newPassword)
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs font-bold text-white/60">
                  {getPasswordStrengthText(newPassword)}
                </p>
              </div>
            )}
            {errors.newPassword && (
              <p className="mt-2 ml-1 text-sm font-medium text-[#FF6B6B]">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-white/70">
              Confirm Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-white/40" />
              </div>
              <input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-base font-medium text-white placeholder:text-white/30 focus:border-[#00FFB2] focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50 transition-all"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 ml-1 text-sm font-medium text-[#FF6B6B]">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="mb-2 text-sm font-bold text-white">Password must contain:</p>
            <ul className="space-y-1 text-sm text-white/60">
              <li>• At least 8 characters</li>
              <li>• One uppercase letter</li>
              <li>• One lowercase letter</li>
              <li>• One number</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isResetPasswordLoading}
            className="h-14 w-full rounded-2xl text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{ background: '#00FFB2', color: '#05070b' }}
          >
            {isResetPasswordLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
