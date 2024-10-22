"use client"

import React, { useEffect } from "react";
import SignInBtn from "../components/login/SignInBtn";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const {data: session} = useSession();
    const router = useRouter();

    useEffect(() => {
        if(session) {
            router.push('/');
        }
    }, [session])

    return(
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
            <h1>로그인 페이지</h1>
            <SignInBtn />
        </main>
    );
}

export default LoginPage;