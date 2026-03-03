import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'diary-session';

function getSecret(): Uint8Array {
  const secret = process.env.APP_SECRET;
  if (!secret) throw new Error('APP_SECRET not set');
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow setup check API without auth
  if (pathname === '/api/auth/check' || pathname === '/api/auth/login' || pathname === '/api/auth/setup') {
    return NextResponse.next();
  }

  // Allow login and setup pages
  if (pathname === '/login' || pathname === '/setup') {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
