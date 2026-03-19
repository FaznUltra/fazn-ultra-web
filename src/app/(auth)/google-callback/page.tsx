'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthContext();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google Sign-In Failed', {
        description: error || 'Authentication failed',
      });
      router.replace('/sign-in');
      return;
    }

    if (token && refreshToken) {
      try {
        // Decode token to get user info (simple JWT decode)
        const base64Url = token.split('.')[1];
        if (!base64Url) {
          throw new Error('Invalid token format');
        }
        
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);

        console.log('Decoded payload:', payload);

        // Create a minimal user object from the token
        const user = {
          _id: payload.userId,
          email: payload.email,
          displayName: payload.displayName,
          firstName: '',
          lastName: '',
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setAuth(user, token, refreshToken);
        toast.success('Signed in with Google successfully!');
        
        // Use replace instead of push to prevent back button issues
        setTimeout(() => {
          router.replace('/');
        }, 500);
      } catch (error) {
        console.error('Error parsing token:', error);
        toast.error('Authentication failed');
        router.replace('/sign-in');
      }
    } else {
      toast.error('Authentication failed');
      router.replace('/sign-in');
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#03060b]">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#00FFB2] border-t-transparent mx-auto mb-4"></div>
        <p className="text-white/60 font-medium">Completing sign-in...</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#03060b]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#00FFB2] border-t-transparent mx-auto mb-4"></div>
          <p className="text-white/60 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}
