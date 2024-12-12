"use client"

import { TeamJoinRequest } from "@/app/Type";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";

const fetchJoinLists = async ({ teamID, user }: { teamID: number, user: string }) => {
    const response = await axios.get("/api/team/join", {
        params: {
            teamID: teamID,
            RequestUser : user
        }
    });
    return response.data
}

const JoinRequestList = ({ teamID }: { teamID: number }) => {
    const { data: session } = useSession();
    const { data: joinRequestList = [], isLoading, isError, error } = useQuery<TeamJoinRequest[], Error>(
        "joinRequestList",
        () => fetchJoinLists({ teamID, user: String(session?.user?.email) })
    );

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error: {error.message}</p>;

    return(
        <div>
            {joinRequestList.length === 0 ? (
                <p>대기 중인 요청이 없습니다.</p>
            ) : (
                <>
                    {joinRequestList.map((request) => (
                        <div key={request.id}>
                            <p>{request.username}</p>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default JoinRequestList;