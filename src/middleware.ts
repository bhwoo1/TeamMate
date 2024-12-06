// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "./app/auth";
// // import { parse } from "cookie"; // 쿠키 파싱 라이브러리
// // import { prisma } from "./app/prisma";


// export async function middleware(request: NextRequest) {
//   const session = await auth();

  
//   // // 쿠키에서 세션 토큰을 추출합니다.
//   // const cookies = parse(request.headers.get("cookie") || "");
//   // const sessionToken = cookies["next-auth.session-token"]; // 세션 토큰 이름을 확인

//   // console.log("Session Token:", sessionToken); // 디버깅을 위해 세션 토큰 확인

//   // if (!sessionToken) {
//   //   // 세션 토큰이 없으면 로그인 페이지로 리디렉트
//   //   return NextResponse.redirect(new URL("/login", request.url));
//   // }

//   // // Prisma로 세션을 확인합니다.
//   // const session = await prisma.session.findUnique({
//   //   where: {
//   //     sessionToken: sessionToken, // 세션 토큰을 기준으로 세션 조회
//   //   },
//   // });

//   // console.log("Session:", session); // 디버깅을 위해 세션 정보를 확인합니다.

//   // if (!session) {
//   //   // 세션이 없으면 로그인 페이지로 리디렉트
//   //   return NextResponse.redirect(new URL("/login", request.url));
//   // }

//   // 세션이 유효하면 요청을 계속 처리
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/team/:path*", "/search/:path*"], // /team, /search 경로에 대해서만 미들웨어 적용
// };

import { NextRequest, NextResponse } from "next/server";
import { auth } from "./app/auth";


export async function middleware(request: NextRequest) {
  console.log("middleware")
  // Auth.js로 세션 정보 가져오기
  const session = await auth();

  if (!session) {
    // 세션이 없다면 로그인 페이지로 리디렉션
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 세션이 유효하다면 요청을 계속 처리
  return NextResponse.next();
}

export const config = {
  matcher: ["/team/:path*", "/search/:path*"], // /team, /search 경로에 대해서만 미들웨어 적용
};