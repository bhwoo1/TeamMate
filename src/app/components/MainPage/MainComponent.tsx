import React from "react";
import AuthPage from "../AuthPage";
import UserRoleVerification from "../UserRoleVerification";

const MainComponent = () => {


    return(
        <AuthPage>
            <UserRoleVerification />
            <main className="flex flex-col gap-8 p-16 items-center sm:items-start">
            
            </main>
        </AuthPage>
    );
}

export default MainComponent;