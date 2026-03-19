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
            <div className="flex h-24 w-24 items-center justify-center rounded-full" style={{ background: 'rgba(124,140,255,0.12)' }}>
              <Key className="h-12 w-12 text-[#7C8CFF]" />
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white">Enter Reset Code</h1>
          <p className="text-white/50 leading-relaxed">
            Enter the 6-digit code sent to
            <br />
            <span className="font-bold text-[#7C8CFF]">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="otp" className="mb-2 block text-sm font-semibold text-white/70">
              Reset Code
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
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-base font-medium text-white placeholder:text-white/30 focus:border-[#7C8CFF] focus:outline-none focus:ring-2 focus:ring-[#7C8CFF]/50 transition-all text-center tracking-widest"
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
            style={{ background: '#7C8CFF', color: '#05070b' }}
          >
            {isVerifyOTPLoading ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="text-center">
            <span className="text-sm text-white/50">Didn&apos;t receive the code? </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className={`text-sm font-bold transition-colors ${
                canResend ? 'text-[#7C8CFF] hover:text-[#7C8CFF]/80' : 'text-white/30'
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
