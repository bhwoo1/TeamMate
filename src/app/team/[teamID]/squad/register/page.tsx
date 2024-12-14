
import AdminPage from "@/app/AdminPage";
import React from "react";
import SquadRegisterClient from "./SquadRegisterClient";


const RegisterPage = () => {

    return(
        <AdminPage>
            <div className="flex flex-col justify-center items-center h-screen">
                <SquadRegisterClient />
            </div>
        </AdminPage>
    );
}

export default RegisterPage;