'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/validations/auth.schema';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className=" flex justify-center">
            <Image
              src="/images/fazn-light.png"
              alt="Ultra Logo"
              width={300}
              height={300}
              priority
            />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-black">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-900">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('password')}
                id="password"
                type="password"
                placeholder="Enter your password"
                className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-base font-medium text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 ml-1 text-sm font-medium text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoginLoading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold text-base hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoginLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Forgot Password?
            </Link>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <GoogleSignInButton mode="signin" />
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">Don&apos;t have an account? </span>
            <Link href="/sign-up" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
