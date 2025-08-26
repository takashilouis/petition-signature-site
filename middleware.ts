import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './lib/session';

export async function middleware(request: NextRequest) {
  // Only apply to admin pages (not API routes, as they handle auth themselves)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip if it's the login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    try {
      const session = await getSession();
      
      if (!session) {
        // Redirect to login page
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('from', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // Session exists, continue
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware session check failed:', error);
      
      // Redirect to login on any error
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
