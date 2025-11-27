import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

//* List of routes that do NOT require authentication
const PUBLIC_PATHS = [
  '/',
  '/authentication',
  '/authentication/login',
  '/authentication/create-with-mail',
  '/authentication/forgot-password-modal',
  '/_next', // Next.js internals
  '/favicon.ico',
  '/assets', // static assetsx
  '/public',
  '/auth/callback',
];

//* Protected routes: must be accessed only if authenticated
const PROTECTED_PATHS = ['/booking', '/google-verify-phone', '/my-account', '/plans', '/packages', '/compare'];

function isPublicPath(pathname: string) {
  //* Allow all public paths and static files
  return (
    PUBLIC_PATHS.some((publicPath) => pathname === publicPath || pathname.startsWith(publicPath + '/')) ||
    pathname.startsWith('/api/auth') || // allow NextAuth or custom auth API
    pathname.match(/\.(js|css|png|jpg|jpeg|webp|svg|woff|woff2|ttf|eot)$/)
  );
}

//* Utility: check if the pathname is protected
function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some(
    (protectedPath) => pathname === protectedPath || pathname.startsWith(protectedPath + '/')
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  //* Check for auth_token in cookies
  const token = request.cookies.get('access_token');
  // const token = getAccessToken();

  //* If user is logged in and visits root, redirect to /booking
  if (pathname === '/' && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/booking';

    //* Keep query params if any
    if (request.nextUrl.search) {
      url.search = request.nextUrl.search;
    }

    return NextResponse.redirect(url);
  }

  //* If the path is public, allow access
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Block access to protected paths if no token
  if (isProtectedPath(pathname) && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/';

    return NextResponse.redirect(url);
  }

  //* If user is not authenticated and tries to access a protected route
  if (!token) {
    //* Not authenticated, redirect to home page
    const url = request.nextUrl.clone();
    url.pathname = '/';

    return NextResponse.redirect(url);
  }

  //* Authenticated, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|public).*)'],
};
