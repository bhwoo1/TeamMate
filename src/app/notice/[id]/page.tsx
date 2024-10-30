"use client"

import { ReceivedNotice } from "@/app/Type";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useMutation, useQuery } from "react-query";

const fetchNotice = async (id: number) => {
    const response = await axios.get(`/api/notice?id=${id}`);
    return response.data;
}

const deleteNotice = async ({ id, user }: { id: number; user: string }) => {
    await axios.delete(`/api/notice`, {
        headers: {
            requestUser: user
        },
        data: {
            id: id
        }
    });
}

const NoticePost = (props: {params: {id: number}}) => {
    const { data: notice, isLoading, isError, error } = useQuery<ReceivedNotice, Error>(
        ["notice", props.params.id],
        () => fetchNotice(props.params.id)
    );
    const router = useRouter();
    const {data: session} = useSession();
    
    const deleteNoticeMutation = useMutation(deleteNotice, {
        onSuccess: () => {
          router.push('/notice');
        }, 
        onError: (error: AxiosError) => {
            console.error("Delete request failed:", error.response?.data || error.message);
        }
      });

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error: {error.message}</p>;

    

      const handleDelete = () => {
        if (session?.user?.email) {
            deleteNoticeMutation.mutate({ id: props.params.id, user: String(session.user.email) });
        }
    };

    return(
        <main className="flex min-h-screen flex-col items-center justify-center p-20">
            <p>{notice?.title}</p>
            <p>{notice?.content}</p>
            <p>{notice?.postedadmin}</p>
            <p>{notice?.createdAt}</p>
            <button onClick={handleDelete}>삭제</button>
        </ main>
    );
}

export default NoticePost;