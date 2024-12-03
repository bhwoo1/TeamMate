"use client"

import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { Player } from "../Type";
import Link from "next/link";
import Image from "next/image"

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
                    <>
                        <Link href={`/roster/${player.backnumber}`}>
                            <div key={player.id} className="flex flex-col text-center itesms-center">
                                <p>{player.name}</p>
                                <Image src={String(player.profileimage)} width={500} height={500} alt="profile" />
                            </div>
                        </Link>
                    </>
                ))
            )}
        </div>
    );
    
}

export default RosterBoard;