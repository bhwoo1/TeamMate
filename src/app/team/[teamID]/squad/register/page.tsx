
import AdminPage from "@/app/AdminPage";
import React from "react";
import SquadRegisterClient from "./SquadRegisterClient";


const RegisterPage = async ({params}: {params: Promise<{ teamID: number }>}) => {
    const { teamID } = await params;

    return(
        <AdminPage>
            <div className="flex flex-col justify-center items-center h-screen">
                <SquadRegisterClient teamID={teamID} />
            </div>
        </AdminPage>
    );
}

export default RegisterPage;