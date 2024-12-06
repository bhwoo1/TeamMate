"use client"

import { signOut, useSession } from "next-auth/react";
import Link from "next/link"

export default function Home() {
  const {status} = useSession();

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <p>메인</p>
      {status == 'authenticated' ? 
          <button onClick={() => signOut()}>로그아웃</button>
        :
          
          <Link href={"/login"}><button>로그인</button></Link>
      }
      
      
      <Link href={"/team"}><button>팀</button></Link>
    </main>
  );
}
