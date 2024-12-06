"use client"; // 클라이언트 컴포넌트로 설정

import { SessionProvider } from "next-auth/react";
import React from "react";


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
};

export default AuthProvider;