'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, type RegisterFormData } from '@/validations/auth.schema';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import Link from 'next/link';
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
    <div className="flex min-h-screen items-center justify-center bg-[#03060b] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
         <div className="flex justify-center mb-6">
                     <span className="font-display tracking-[0.4em] text-4xl text-white">
                       FAZN
                       <span className="text-[#00FFB2]">.</span>
                     </span>
                   </div>
          <h1 className="mb-3 text-3xl font-bold text-white">Create Account</h1>
          <p className="text-white/50">Join the ultimate gaming arena</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="mb-2 block text-sm font-semibold text-white/70">
              First Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <User className="h-5 w-5 text-white/40" />
              </div>
              <input
                {...register('firstName')}
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-base font-medium text-white placeholder:text-white/30 focus:border-[#00FFB2] focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50 transition-all"
              />
            </div>
            {errors.firstName && (
              <p className="mt-2 ml-1 text-sm font-medium text-[#FF6B6B]">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="mb-2 block text-sm font-semibold text-white/70">
              Last Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <User className="h-5 w-5 text-white/40" />
              </div>
              <input
                {...register('lastName')}
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-base font-medium text-white placeholder:text-white/30 focus:border-[#00FFB2] focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50 transition-all"
              />
            </div>
            {errors.lastName && (
              <p className="mt-2 ml-1 text-sm font-medium text-[#FF6B6B]">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="displayName" className="mb-2 block text-sm font-semibold text-white/70">
              Display Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <AtSign className="h-5 w-5 text-white/40" />
              </div>
              <input
                {...register('displayName')}
                id="displayName"
                type="text"
                placeholder="@username"
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-base font-medium text-white placeholder:text-white/30 focus:border-[#00FFB2] focus:outline-none focus:ring-2 focus:ring-[#00FFB2]/50 transition-all"
              />
            </div>
            {errors.displayName && (
              <p className="mt-2 ml-1 text-sm font-medium text-[#FF6B6B]">{errors.displayName.message}</p>
            )}
          </div>

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
            disabled={isRegisterLoading}
            className="w-full py-4 rounded-2xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98] mt-6"
            style={{ background: '#00FFB2', color: '#05070b' }}
          >
            {isRegisterLoading ? 'Creating account...' : 'Sign Up'}
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-sm text-white/40 font-semibold">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <GoogleSignInButton mode="signup" />

          <div className="text-center text-sm">
            <span className="text-white/50">Already have an account? </span>
            <Link href="/sign-in" className="text-[#00FFB2] hover:text-[#00FFB2]/80 font-bold transition-colors">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
