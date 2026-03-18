import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/verify-reset-otp', '/reset-password', '/verify-email'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Allow all requests to pass through
  // Authentication will be handled client-side since we're using localStorage
  // This middleware just ensures proper routing
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)',
  ],
};
