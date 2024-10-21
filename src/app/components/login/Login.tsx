"use client"

import { useSession } from "next-auth/react";
import React from "react"
import SignInBtn from "./SignInBtn";
import SignOutBtn from "./SignOutBtn";

const Login:React.FC = () => {
    const {data: session} = useSession();

    return(
        <>
            {session ? 
                    <SignOutBtn />
                :
                    <SignInBtn />
            }
        </>
    );
}

export default Login;