'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { KeyRound } from 'lucide-react';
import { otpSchema, OTPFormData } from '@/validations/auth.schema';
import { useAuth } from '@/hooks/useAuth';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, verifyOTP, resendOTP, isVerifyLoading, isResendOTPLoading } = useAuth();
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
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

  const onSubmit = (data: OTPFormData) => {
    verifyOTP(data);
  };

  const handleResend = () => {
    if (canResend) {
      resendOTP();
      setCanResend(false);
      setCountdown(60);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/fazn-light.png"
              alt="Ultra Logo"
              width={80}
              height={80}
              priority
            />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-black">Verify Your Email</h1>
          <p className="text-gray-500">
            We&apos;ve sent a 6-digit code to
            <br />
            <span className="font-semibold text-blue-600">{user?.email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="otp" className="mb-2 block text-sm font-semibold text-gray-900">
              Verification Code
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
            disabled={isVerifyLoading}
            className="h-14 w-full rounded-2xl bg-blue-600 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isVerifyLoading ? 'Verifying...' : 'Verify Email'}
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

          <button
            type="button"
            onClick={() => router.push('/sign-in')}
            className="mt-4 h-14 w-full rounded-2xl border border-blue-600 bg-blue-50 text-base font-semibold text-blue-600 transition-colors hover:bg-blue-100"
          >
            Go to Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
