"use client"

import { ReceivedNotice } from "@/app/Type";
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";

const fetchNotice = async (id: number) => {
    const response = await axios.get(`/api/notice?id=${id}`);
    return response.data;
}

const NoticePost = (props: {params: {id: number}}) => {

    

    const { data: notice, isLoading, isError, error } = useQuery<ReceivedNotice, Error>(
        ["notice", props.params.id],
        () => fetchNotice(props.params.id)
    );

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error: {error.message}</p>;

    return(
        <main className="flex min-h-screen flex-col items-center justify-center p-20">
            <p>{notice?.title}</p>
            <p>{notice?.content}</p>
            <p>{notice?.postedadmin}</p>
            <p>{notice?.createdAt}</p>
        </ main>
    );
}

export default NoticePost;