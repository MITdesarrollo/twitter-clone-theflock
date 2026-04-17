import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth/jwt-edge';

const publicPaths = ['/login', '/register'];
const authApiPaths = ['/api/auth/login', '/api/auth/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  const isPublicPath = publicPaths.some((p) => pathname === p);
  const isAuthApi = authApiPaths.some((p) => pathname.startsWith(p));

  if (isAuthApi) return NextResponse.next();

  if (token) {
    const payload = await verifyTokenEdge(token);

    if (payload && isPublicPath) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (!payload && !isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else if (!isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth/).*)'],
};
