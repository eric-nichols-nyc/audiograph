// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });
  
  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();
  
  // Optional: Check auth status for protected routes
  const { pathname } = request.nextUrl;
  
  // Add protected routes here
  const protectedRoutes = ['/dashboard', '/profile', '/account'];
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    const { data: { session } } = await supabase.auth.getSession();
    
    // If no session and on a protected route, redirect to sign in
    if (!session) {
      const redirectUrl = new URL('/auth/signin', request.url);
      redirectUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  return response;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    // Apply to all routes except those starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};