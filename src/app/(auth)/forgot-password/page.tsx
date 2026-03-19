'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/validations/passwordReset.schema';
import { usePasswordReset } from '@/hooks/usePasswordReset';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, isForgotPasswordLoading } = usePasswordReset();
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data.email);
    setSubmittedEmail(data.email);
    setEmailSent(true);
  };

  const handleContinue = () => {
    router.push(`/verify-reset-otp?email=${encodeURIComponent(submittedEmail)}`);
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
            <div className="flex h-24 w-24 items-center justify-center rounded-full" style={{ background: 'rgba(0,255,178,0.12)' }}>
              <Lock className="h-12 w-12 text-[#00FFB2]" />
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white">Forgot Password?</h1>
          <p className="text-white/50 leading-relaxed px-5">
            {emailSent
              ? 'Check your email for the reset code'
              : "Enter your email address and we'll send you a code to reset your password"}
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-white/70">
                Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-white/40" />
                </div>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-base font-medium text-white placeholder:text-white/30 focus:border-[#00FFB2] focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50 transition-all"
                />
              </div>
              {errors.email && (
                <p className="mt-2 ml-1 text-sm font-medium text-[#FF6B6B]">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isForgotPasswordLoading}
              className="h-14 w-full rounded-2xl text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              style={{ background: '#00FFB2', color: '#05070b' }}
            >
              {isForgotPasswordLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-[#00FFB2]" />
              <h2 className="mb-2 text-2xl font-bold text-white">Code Sent!</h2>
              <p className="mb-2 text-white/50">We&apos;ve sent a 6-digit code to</p>
              <p className="font-bold text-[#00FFB2]">{submittedEmail}</p>
            </div>

            <button
              onClick={handleContinue}
              className="h-14 w-full rounded-2xl text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: '#00FFB2', color: '#05070b' }}
            >
              Continue to Reset Password
            </button>

            <button
              onClick={() => setEmailSent(false)}
              className="w-full text-center text-sm text-white/50 hover:text-white/70 transition-colors"
            >
              Didn&apos;t receive the code?{' '}
              <span className="font-bold text-[#00FFB2]">Try again</span>
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#00FFB2] hover:text-[#00FFB2]/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
