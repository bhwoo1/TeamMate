"use client"

import { userRoleStore } from "@/app/zustand/store";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useMutation } from "react-query";
import JoinRequestList from "./JoinRequestList";

const submitJoinReqeust = async ({teamID, user, username}: {teamID: number, user: string, username: string}) => {
    console.log(teamID, user, username);
    
    const response = await axios.post('/api/team/join', {
        teamID: teamID
    }, {
        headers: {
            RequestUser: user,
            RequestUsername: username
        }
    });
    return response.data;
}

const JoinBtn = ({teamID}: {teamID: number}) => {
    const { isAdmin } = userRoleStore();
    const { data: session } = useSession();

    const submitJoinRequestMutation = useMutation(submitJoinReqeust, {
        onSuccess: () => {
            alert('신청되었습니다.');
        },
        onError: (error: AxiosError) => {
            console.error("Submit request failed:", error.response?.data || error.message);
        }
    });

    const handleSubmit = () => {
        console.log(teamID);
        console.log(session?.user?.email);
        console.log(session?.user?.name);
        if (session?.user?.email) {
            submitJoinRequestMutation.mutate({ teamID: teamID, user: String(session.user.email), username: String(session.user.name) });
        }
    }
    
    if (isAdmin === 'admin') {
        return(
            <JoinRequestList teamID={teamID} />
        );
    }
    else if (isAdmin === 'noMember') {
        return(
            <div>
                <button onClick={handleSubmit}>가입</button>
            </div>
        );
    }
    else {
        return null;
    }
}

export default JoinBtn;