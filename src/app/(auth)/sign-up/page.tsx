'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, type RegisterFormData } from '@/validations/auth.schema';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, AtSign } from 'lucide-react';

export default function SignUpPage() {
  const { register: registerUser, isRegisterLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      displayName: '@',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
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
          <h1 className="mb-2 text-3xl font-bold text-black">Create Account</h1>
          <p className="text-gray-500">Join Ultra today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="mb-2 block text-sm font-semibold text-gray-900">
              First Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('firstName')}
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-base font-medium text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {errors.firstName && (
              <p className="mt-1.5 ml-1 text-sm font-medium text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="mb-2 block text-sm font-semibold text-gray-900">
              Last Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('lastName')}
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-base font-medium text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {errors.lastName && (
              <p className="mt-1.5 ml-1 text-sm font-medium text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="displayName" className="mb-2 block text-sm font-semibold text-gray-900">
              Display Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <AtSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('displayName')}
                id="displayName"
                type="text"
                placeholder="@username"
                className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-base font-medium text-black placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {errors.displayName && (
              <p className="mt-1.5 ml-1 text-sm font-medium text-red-500">{errors.displayName.message}</p>
            )}
          </div>

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
            disabled={isRegisterLoading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold text-base hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isRegisterLoading ? 'Creating account...' : 'Sign Up'}
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <GoogleSignInButton mode="signup" />

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
