"use client"

import { ReceivedPost } from "@/app/Type";
import axios from "axios";
import { useQuery } from "react-query";
import BoardTemplate from "./BoardTemplate";

const fetchPosts = async ({ teamID }: { teamID: number }) => {
    const response = await axios.get("/api/post", {
        params: {
            teamID: teamID,
        },
    });
    return response.data;
};

const CommunityBoard = ({ teamID }: { teamID: number }) => {
    const { data: postArr = [], isLoading, isError, error } = useQuery<ReceivedPost[], Error>(
        "postList",
        () => fetchPosts({ teamID })
    );

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error: {error.message}</p>;


    return (
        <BoardTemplate posts={postArr} teamID={teamID} />
    );
};

export default CommunityBoard;