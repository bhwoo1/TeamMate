import { NextRequest, NextResponse } from "next/server";
import { auth } from "./src/app/auth";


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