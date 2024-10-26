// import { PrismaAdapter } from "@auth/prisma-adapter"
// import NextAuth from "next-auth"
// import Naver from "next-auth/providers/naver"
// import { prisma } from "../../prisma"
 
// export const { handlers, signIn, signOut, auth } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     Naver
//   ],
//   pages: {
//     signIn: "/auth/signin",
//   },
  
// })

import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Naver from "next-auth/providers/naver";
import { prisma } from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Naver],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      // 이메일로 기존 사용자 찾기
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email as string },
      });

      if (!existingUser) {
        // 가장 먼저 등록된 유저인지 확인
        const firstUser = await prisma.user.findFirst({
          orderBy: {
            createdAt: 'asc',
          },
        });

        if (!firstUser) {
          // 첫 번째 유저로 새로 생성
          const newUser = await prisma.user.create({
            data: {
              email: user.email as string,
              name: user.name,
              image: user.image,
              role: 'admin', // 처음 등록된 유저는 admin
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
        } else {
          // 다른 유저는 기본값 'user'로 설정
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: 'user', // 기본값 'user'
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
      } else {
        // 사용자가 이미 존재하면 역할 업데이트 (필요한 경우)
        // 예: 필요에 따라 role 업데이트 로직 추가
      }

      return true; // 로그인 허용
    },
  },
});


