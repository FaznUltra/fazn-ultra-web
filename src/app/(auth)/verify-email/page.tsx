'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { KeyRound } from 'lucide-react';
import { otpSchema, OTPFormData } from '@/validations/auth.schema';
import { useAuth } from '@/hooks/useAuth';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, verifyOTP, resendOTP, isVerifyOTPLoading, isResendOTPLoading } = useAuth();
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
    <div className="flex min-h-screen items-center justify-center bg-[#03060b] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mb-8 flex justify-center">
            <span className="font-display tracking-[0.4em] text-4xl text-white">
              FAZN
              <span className="text-[#00FFB2]">.</span>
            </span>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white">Verify Your Email</h1>
          <p className="text-white/50">
            We&apos;ve sent a 6-digit code to
            <br />
            <span className="font-bold text-[#00FFB2]">{user?.email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="otp" className="mb-2 block text-sm font-semibold text-white/70">
              Verification Code
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <KeyRound className="h-5 w-5 text-white/40" />
              </div>
              <input
                {...register('otp')}
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit code"
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-base font-medium text-white placeholder:text-white/30 focus:border-[#00FFB2] focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50 transition-all text-center tracking-widest"
              />
            </div>
            {errors.otp && (
              <p className="mt-2 ml-1 text-sm font-medium text-[#FF6B6B]">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifyOTPLoading}
            className="h-14 w-full rounded-2xl text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{ background: '#00FFB2', color: '#05070b' }}
          >
            {isVerifyOTPLoading ? 'Verifying...' : 'Verify Email'}
          </button>

          <div className="text-center">
            <span className="text-sm text-white/50">Didn&apos;t receive the code? </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isResendOTPLoading}
              className={`text-sm font-bold transition-colors ${
                canResend ? 'text-[#00FFB2] hover:text-[#00FFB2]/80' : 'text-white/30'
              }`}
            >
              {isResendOTPLoading ? 'Sending...' : canResend ? 'Resend' : `Resend in ${countdown}s`}
            </button>
          </div>

          <button
            type="button"
            onClick={() => router.push('/sign-in')}
            className="mt-4 h-14 w-full rounded-2xl border border-white/10 bg-white/5 text-base font-bold text-white transition-all hover:bg-white/10"
          >
            Go to Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
