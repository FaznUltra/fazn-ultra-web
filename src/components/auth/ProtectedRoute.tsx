'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/sign-in?redirect=${pathname}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#03060b]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#00FFB2] border-t-transparent mx-auto mb-4"></div>
          <p className="text-white/60 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Check if user needs to verify email
  if (user && !user.isVerified && pathname !== '/verify-email') {
    router.push('/verify-email');
    return null;
  }

  return <>{children}</>;
}
