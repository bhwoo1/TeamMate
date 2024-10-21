"use client"; // 클라이언트 컴포넌트로 설정

import { signOut } from "next-auth/react";

export default function SignOutBtn() {
  return (
    <button
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => signOut()}
    >
      <p>로그아웃</p>
    </button>
  );
}