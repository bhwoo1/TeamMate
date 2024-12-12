"use client"

import { ReceivedTeam } from "@/app/Type";
import axios from "axios";
import Image from "next/image";
import { useQuery } from "react-query";
import JoinBtn from "./JoinBtn";

const fetchTeamInfo = async ({ teamID }: { teamID: number }) => {
    const response = await axios.get("/api/team/teaminfo", {
        params: { teamID } // GET 요청에서 파라미터를 전달할 때는 `params` 사용
    });
    return response.data;
}

const TeamInfo = (props: { teamID: number }) => {
    const { data: teaminfo, isLoading, isError, error } = useQuery<ReceivedTeam, Error>(
        ["teaminfo", props.teamID],
        () => fetchTeamInfo({ teamID: props.teamID })
    );
    
    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error: {error.message}</p>;

    return(
        <>
            <p>{teaminfo?.teamName}</p>
            <p>{teaminfo?.description}</p>
            <Image src={String(teaminfo?.teamLogo)} width={200} height={200} alt="teamlogo"/>
            <JoinBtn teamID={props.teamID} />
        </>
    );
}

export default TeamInfo;