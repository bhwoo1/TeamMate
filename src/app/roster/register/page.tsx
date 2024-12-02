import AdminPage from "@/app/components/AdminPage";
import React from "react";
import RosterRegisterClient from "./RosterRegisterClient";

const RegisterPage = () => {

    return(
        <AdminPage>
            <div className="flex flex-col justify-center items-center h-screen">
                <RosterRegisterClient />
            </div>
        </AdminPage>
    );
}

export default RegisterPage;