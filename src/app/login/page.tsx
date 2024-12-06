"use client"

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SignInBtn from "./SingInBtn";

const LoginPage = () => {
    const {data: session} = useSession();
    const router = useRouter();

    useEffect(() => {
        if(session) {
            router.push('/');
        }
    }, [session])

    return(
        <main className="flex flex-col justify-center items-center h-screen">
            <h1>로그인 페이지</h1>
            <SignInBtn />
        </main>
    );
}

export default LoginPage;