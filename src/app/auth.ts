import NextAuth from "next-auth";
import Naver from "next-auth/providers/naver";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Naver],
  pages: {
    signIn: "/auth/signin",
    // signOut 페이지를 추가하여 로그아웃 후 세션 삭제
    signOut: "/auth/signout", 
  },
  callbacks: {
    
  }
});