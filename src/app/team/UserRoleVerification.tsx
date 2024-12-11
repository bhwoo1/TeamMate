"use client"

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { userRoleStore } from "../zustand/store";

const fetchUser = async ({user, teamID} : {user: string, teamID: number}) => {
    const response = await axios.get(`/api/team/user`, {
        params: {
            loginedUser: user,
            teamID: teamID
        }
    });
    return response.data;
}

const UserRoleVerification = ({ teamID }: { teamID: number }) => {
    const { data: session } = useSession();
    const { setIsAdmin } = userRoleStore();
    const {data: userRole} = useQuery(
        ["userRole", session?.user?.email],
        () => fetchUser({ user: String(session?.user?.email), teamID: teamID }),
        { enabled: !!session?.user?.email }
    );

    useEffect(() => {
        if (userRole && userRole.role === 'admin') {
            setIsAdmin(true);
        }
        
    }, [userRole])


    return null;

}

export default UserRoleVerification;