"use client"

import axios from "axios";
import { useQuery } from "react-query";
import { ReceivedTeam } from "../Type";
import { useSession } from "next-auth/react";

const fetchMyTeams = async (userId: string) => {
    if (!userId) {
        throw new Error("User is not authenticated");
    }
    const response = await axios.get("/api/team", {
        headers: {
            requestUser: userId
        }
    });
    return response.data;
}

const MyTeamList = () => {
    const {data: session} = useSession();
    const userId = String(session?.user?.id);
    const {data: myTeamArr = [], isLoading, isError, error} = useQuery<ReceivedTeam[], Error>(
        "myteamList",
        () => fetchMyTeams(userId),
        {
            enabled: !!userId // userId가 있을 때만 요청 실행
        }
    );

    

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error: {error.message}</p>;

    return(
        <div>
            {myTeamArr.length === 0 ? (
                <p>가입한 팀이 없습니다.</p>
            ) : (
                <>
                    {myTeamArr.map((team) => {
                        <div key={team.id}>
                            <p>{team.teamName}</p>
                        </div>
                    })}
                </>
            )}
        </div>
    );
}

export default MyTeamList;