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
        onSuccess: (data) => {
            // 서버에서 200 OK와 함께 메시지가 반환되면, 이미 가입 요청을 한 경우를 처리
            if (data.message === "You have already submitted a join request for this team.") {
              alert('이미 가입 신청 하셨습니다.');
            } else {
              alert("신청되었습니다.");
            }
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