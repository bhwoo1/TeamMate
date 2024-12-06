"use client"

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SignInBtn from "./SingInBtn";

const LoginPage = () => {
    const { status } = useSession(); // status: 'loading' | 'authenticated' | 'unauthenticated'
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <main className="flex justify-center items-center h-screen">
                <p>로딩 중...</p>
            </main>
        );
    }

    return(
        <main className="flex flex-col justify-center items-center h-screen">
            <h1>로그인 페이지</h1>
            <SignInBtn />
        </main>
    );
}

export default LoginPage;