"use client"

import React from "react";
import SignInBtn from "../login/SingInBtn";
import { useSession } from "next-auth/react";
import SearchBar from "../search/SearchBar";

const MainComponent = () => {
    const {status} = useSession();


    return(
        <div className="flex items-center justify-center">
            {status === 'authenticated' ? 
                    <SearchBar />
                :
                    <></>
            }
            <SignInBtn />
        </div>
    );
}

export default MainComponent;