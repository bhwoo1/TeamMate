"use client"

import axios from "axios";
import { useQuery } from "react-query";
import { ReceivedTeam } from "../Type";

const fetchMyTeams = async () => {
    const response = await axios.get("/api/team");
    return response.data;
}

const EntireTeamList = () => {
    const {data: entireTeamArr = [], isLoading, isError, error} = useQuery<ReceivedTeam[], Error>(
        "entireTeamList",
        fetchMyTeams
    );

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error: {error.message}</p>;

    return(
        <div>
            {entireTeamArr.length === 0 ? (
                <p>등록된 팀이 없습니다.</p>
            ) : (
                <>
                    {entireTeamArr.map((team) => {
                        <div key={team.id}>
                            <p>{team.teamName}</p>
                        </div>
                    })}
                </>
            )}
        </div>
    );
}

export default EntireTeamList;