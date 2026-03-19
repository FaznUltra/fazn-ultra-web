'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/validations/auth.schema';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';

export default function SignInPage() {
  const { login, isLoginLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#03060b] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-8">
            <span className="font-display tracking-[0.4em] text-4xl text-white">
              FAZN
              <span className="text-[#00FFB2]">.</span>
            </span>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/50">Sign in to continue your gaming journey</p>
        </div>

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

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-white/70">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-white/40" />
              </div>
              <input
                {...register('password')}
                id="password"
                type="password"
                placeholder="Enter your password"
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-base font-medium text-white placeholder:text-white/30 focus:border-[#00FFB2] focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50 transition-all"
              />
            </div>
            {errors.password && (
              <p className="mt-2 ml-1 text-sm font-medium text-[#FF6B6B]">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoginLoading}
            className="w-full py-4 rounded-2xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98] mt-6"
            style={{ background: '#00FFB2', color: '#05070b' }}
          >
            {isLoginLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center">
            <Link href="/forgot-password" className="text-sm text-[#00FFB2] hover:text-[#00FFB2]/80 font-semibold transition-colors">
              Forgot Password?
            </Link>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-sm text-white/40 font-semibold">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <GoogleSignInButton mode="signin" />
          <div className="mt-6 text-center">
            <span className="text-sm text-white/50">Don&apos;t have an account? </span>
            <Link href="/sign-up" className="text-sm font-bold text-[#00FFB2] hover:text-[#00FFB2]/80 transition-colors">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
