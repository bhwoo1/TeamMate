"use client"

import { useSession } from "next-auth/react";
import React from "react";
import NavBar from "./NavBar";

const ConditionalNavBar = () => {
    const {data: session} = useSession();

    return session ? <NavBar /> : null;
}

export default ConditionalNavBar;