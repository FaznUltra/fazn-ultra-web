'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, KeyRound, Key } from 'lucide-react';
import { verifyResetOTPSchema, VerifyResetOTPFormData } from '@/validations/passwordReset.schema';
import { usePasswordReset } from '@/hooks/usePasswordReset';

function VerifyResetOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { verifyResetOTP, isVerifyOTPLoading } = usePasswordReset();
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyResetOTPFormData>({
    resolver: zodResolver(verifyResetOTPSchema),
    defaultValues: {
      otp: '',
    },
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const onSubmit = async (data: VerifyResetOTPFormData) => {
    try {
      await verifyResetOTP(email, data.otp);
      router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${data.otp}`);
    } catch (error) {
      console.error('Verify reset OTP error:', error);
    }
  };

  const handleResend = () => {
    if (canResend) {
      router.push(`/forgot-password?email=${encodeURIComponent(email)}`);
    }
  };

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
              <Key className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-black">Enter Reset Code</h1>
          <p className="text-gray-600 leading-relaxed">
            Enter the 6-digit code sent to
            <br />
            <span className="font-semibold text-blue-600">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="otp" className="mb-2 block text-sm font-semibold text-gray-900">
              Reset Code
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('otp')}
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit code"
                className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-base font-medium text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {errors.otp && (
              <p className="mt-1.5 ml-1 text-sm font-medium text-red-500">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifyOTPLoading}
            className="h-14 w-full rounded-2xl bg-blue-600 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isVerifyOTPLoading ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-500">Didn&apos;t receive the code? </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className={`text-sm font-semibold ${
                canResend ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400'
              }`}
            >
              {canResend ? 'Resend' : `Resend in ${countdown}s`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VerifyResetOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyResetOTPContent />
    </Suspense>
  );
}
