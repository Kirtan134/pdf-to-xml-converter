import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/convert',
  '/view',
];

// Define public routes (no authentication needed)
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/api/auth',
  '/_next',
  '/fonts',
  '/images',
  '/favicon.ico',
  '/sitemap.xml',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes and API routes except those we want to protect
  if (publicRoutes.some(route => pathname.startsWith(route)) || 
      (pathname.startsWith('/api') && !pathname.startsWith('/api/profile') && !pathname.startsWith('/api/conversions'))) {
    return NextResponse.next();
  }

  // Check if the path should be protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  );
  
  // If not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get the JWT token from the session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If there's no token but we're on a protected route, redirect to login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 