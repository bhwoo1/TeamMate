import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  console.log('Middleware executed'); // 미들웨어가 실행되는지 확인
  const token = await getToken({ req: request, secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  console.log('Token:', token); // 토큰을 확인합니다.

  // 로그인 페이지로 접근하면 토큰이 있으면 홈으로 리다이렉트
  if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // 로그인되지 않은 상태로 /team이나 /search에 접근하면 로그인 페이지로 리다이렉트
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/team/:path*', '/search/:path*'],  // 미들웨어를 /team, /search 경로에만 적용
};
// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL("/login", request.url));
// }

// export const config = {
//   matcher: ["/team"],
// };

// import { NextRequest, NextResponse } from 'next/server';

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   if (!req.cookies.get('auth') && pathname.startsWith('/team')) {
//     return NextResponse.redirect(new URL('/home', req.url));
//   }

//   return NextResponse.next();
// }