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
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-green-500';
    if (strength === 4) return 'bg-green-500';
    return 'bg-gray-200';
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
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="mb-4 text-lg font-medium text-red-500">Invalid reset link</p>
          <button
            onClick={() => router.push('/forgot-password')}
            className="h-12 rounded-2xl bg-blue-600 px-6 text-base font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Go to Forgot Password
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.back()}
          className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>

        <div className="mb-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
              <Lock className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-black">Create New Password</h1>
          <p className="text-gray-600 leading-relaxed">Choose a strong password for your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-gray-900">
              New Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('newPassword')}
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-base font-medium text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {newPassword && (
              <div className="mt-3">
                <div className="mb-1.5 flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        getPasswordStrength(newPassword) >= level
                          ? getPasswordStrengthColor(newPassword)
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs font-medium text-gray-600">
                  {getPasswordStrengthText(newPassword)}
                </p>
              </div>
            )}
            {errors.newPassword && (
              <p className="mt-1.5 ml-1 text-sm font-medium text-red-500">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-gray-900">
              Confirm Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-base font-medium text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 ml-1 text-sm font-medium text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-blue-50 p-4">
            <p className="mb-2 text-sm font-semibold text-black">Password must contain:</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• At least 8 characters</li>
              <li>• One uppercase letter</li>
              <li>• One lowercase letter</li>
              <li>• One number</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isResetPasswordLoading}
            className="h-14 w-full rounded-2xl bg-blue-600 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
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
