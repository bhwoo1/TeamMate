"use client"

import React, { useEffect } from "react";
import AuthPage from "../AuthPage";
import { useSession } from "next-auth/react";

const MainComponent = () => {

    const {data: session} = useSession();

    useEffect(() => {
        console.log(session?.user?.email);
    }, []);


    return(
        <AuthPage>
            <main className="flex flex-col gap-8 p-16 items-center sm:items-start">
                
            </main>
        </AuthPage>
    );
}

export default MainComponent;