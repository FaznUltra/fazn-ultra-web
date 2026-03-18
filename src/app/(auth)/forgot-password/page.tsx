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
          <h1 className="mb-3 text-3xl font-bold text-black">Forgot Password?</h1>
          <p className="text-gray-600 leading-relaxed px-5">
            {emailSent
              ? 'Check your email for the reset code'
              : "Enter your email address and we'll send you a code to reset your password"}
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-900">
                Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-base font-medium text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 ml-1 text-sm font-medium text-red-500">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isForgotPasswordLoading}
              className="h-14 w-full rounded-2xl bg-blue-600 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isForgotPasswordLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl bg-blue-50 p-8 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
              <h2 className="mb-2 text-2xl font-bold text-black">Code Sent!</h2>
              <p className="mb-2 text-gray-600">We&apos;ve sent a 6-digit code to</p>
              <p className="font-semibold text-blue-600">{submittedEmail}</p>
            </div>

            <button
              onClick={handleContinue}
              className="h-14 w-full rounded-2xl bg-blue-600 text-base font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Continue to Reset Password
            </button>

            <button
              onClick={() => setEmailSent(false)}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
            >
              Didn&apos;t receive the code?{' '}
              <span className="font-semibold text-blue-600">Try again</span>
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
