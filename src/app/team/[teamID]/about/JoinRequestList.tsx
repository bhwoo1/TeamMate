"use client"

import { TeamJoinRequest } from "@/app/Type";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "react-query";
import { FiXCircle, FiCheckCircle  } from "react-icons/fi";

const fetchJoinLists = async ({ teamID, user }: { teamID: number, user: string }) => {
    const response = await axios.get("/api/team/join", {
        params: {
            teamID: teamID,
            RequestUser : user
        }
    });
    return response.data
}

const updateJoinAction = async ({ teamID, user, action, requestID }: { teamID: number, user: string, action: string, requestID: number }) => {
    await axios.put("/api/team/join", {
        action: action,
        requestId: requestID
    }, {
        headers: {
            ReqeustUser: user,
            teamID: teamID
        }
    })
}

const JoinRequestList = ({ teamID }: { teamID: number }) => {
    const { data: session } = useSession();
    const { data: joinRequestList = [], isLoading, isError, error } = useQuery<TeamJoinRequest[], Error>(
        "joinRequestList",
        () => fetchJoinLists({ teamID, user: String(session?.user?.email) })
    );

    const updateJoinMutation = useMutation(updateJoinAction, {
        onSuccess: () => {
            console.log("success");
            // window.location.reload();
        },
        onError: (error: AxiosError) => {
            console.error("Update request failed:", error.response?.data || error.message);
        }
    });

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error: {error.message}</p>;


    const handleBtnClick = ({requestID, actionMessage}: {requestID: number, actionMessage: string}) => {
        if (session?.user?.email) {
            updateJoinMutation.mutate({requestID: Number(requestID), user: String(session.user.email), action: actionMessage, teamID: teamID});
        }
    }

    return(
        <div>
            {joinRequestList.length === 0 ? (
                <p>대기 중인 요청이 없습니다.</p>
            ) : (
                <>
                    {joinRequestList.map((request) => (
                        <div key={request.id} className="flex flex-row justify-between hover:border-2 hover:shadow">
                            <p className="text-3xl">{request.username}</p>
                            <div className="ml-12">
                                <button className="text-4xl text-green-400 border-4 rounded-full" onClick={() => handleBtnClick({requestID: request.id, actionMessage: "approve"})}><FiCheckCircle /></button>
                                <button className="text-4xl text-red-400 border-4 rounded-full" onClick={() => handleBtnClick({requestID: request.id, actionMessage: "reject"})}><FiXCircle /></button>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default JoinRequestList;