"use client"

import React from "react";
import SignInBtn from "../login/SingInBtn";
import { useSession } from "next-auth/react";
import SearchBar from "../search/SearchBar";
import MyTeamList from "../team/MyTeamList";
import EntireTeamList from "../team/EntireTeamList";

const MainComponent = () => {
    const {data: session, status} = useSession();



    return(
        <div className="flex items-center justify-center">
            {status === 'authenticated' ? 
                    <>
                        <SearchBar />
                        <MyTeamList />
                        <EntireTeamList />
                        <p>{session.user?.name} 님 환영합니다.</p>
                    </>
                :
                    <></>
            }
            <SignInBtn />
        </div>
    );
}

export default MainComponent;