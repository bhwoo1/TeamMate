"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const MainComponent = () => {
    const {data: session} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push("/login");
        }
    }, [session]);

    return(
        <main className="flex flex-col gap-8 p-16 items-center sm:items-start">
            
        </main>
    );
}

export default MainComponent;