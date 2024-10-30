"use client"

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { userRoleStore } from "../zustand/store";

const fetchUser = async (user: string) => {
    const response = await axios.get(`/api/user?loginedUser=${user}`);
    return response.data;
}

const UserRoleVerification = () => {
    const {data: session} = useSession();
    const { setIsAdmin } = userRoleStore();
    const {data: userRole} = useQuery(
        ["userRole", session?.user?.email],
        () => fetchUser(String(session?.user?.email)),
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