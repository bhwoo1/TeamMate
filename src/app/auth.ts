import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Naver from "next-auth/providers/naver";
import { prisma } from "./prisma";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Naver,
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  callbacks: {
    async signIn({ user, account }) {
      // 이메일로 기존 사용자 찾기
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email as string },
      });

      if (!existingUser) {
        // 새로운 사용자 생성
        const newUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
          },
        });

        // Account 정보도 생성
        await prisma.account.create({
          data: {
            userId: newUser.id,
            type: account!.type,
            provider: account!.provider,
            providerAccountId: account!.providerAccountId,
            refresh_token: account!.refresh_token,
            access_token: account!.access_token,
            expires_at: account!.expires_at,
            token_type: account!.token_type,
            scope: account!.scope,
            id_token: account!.id_token,
            session_state: account!.session_state as string,
          },
        });
      }

      return true; // 로그인 허용
    },
  },
});