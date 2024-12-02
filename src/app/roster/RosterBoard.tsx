"use client"

import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { Player } from "../Type";

const fetchRoster = async () => {
    const response = await axios.get("/api/roster");
    return response.data
}

const RosterBoard = () => {
    const {data: rosterArr = [], isLoading, isError } = useQuery<Player[]>(
        "rosterList",
        fetchRoster
    );

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error</p>;

    return(
        <div className="p-8 w-full max-w-2xl">
            {rosterArr.length === 0 ? (
                <p className="text-center">등록된 선수가 없습니다.</p>
            ) : (
                rosterArr.map((player) => (
                    <div key={player.backnumber}>
                        <p>{player.name}</p>
                    </div>
                ))
            )}
        </div>
    );
    
}

export default RosterBoard;