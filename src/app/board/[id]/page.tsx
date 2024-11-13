"use client"

import { ReceivedNotice } from "@/app/Type";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useMutation, useQuery } from "react-query";

const fetchPost = async (id: number) => {
    const response = await axios.get(`/api/post?id=${id}`);
    return response.data;
}

const deletePost = async ({ id, user }: { id: number; user: string }) => {
    await axios.delete(`/api/post`, {
        headers: {
            requestUser: user
        },
        data: {
            id: id
        }
    });
}

const PostPage = (props: {params: {id: number}}) => {
    const { data: post, isLoading, isError, error } = useQuery<ReceivedNotice, Error>(
        ["post", props.params.id],
        () => fetchPost(props.params.id)
    );
    const router = useRouter();
    const {data: session} = useSession();
    
    const deleteNoticeMutation = useMutation(deletePost, {
        onSuccess: () => {
          router.push('/board');
        }, 
        onError: (error: AxiosError) => {
            console.error("Delete request failed:", error.response?.data || error.message);
        }
      });

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error: {error.message}</p>;

    

      const handleDelete = () => {
        if (session?.user?.email) {
            deleteNoticeMutation.mutate({ id: props.params.id, user: String(session.user.name) });
        }
    };

    return(
        <main className="flex min-h-screen flex-col items-center justify-center p-20">
            <p>{post?.title}</p>
            <p>{post?.content}</p>
            <p>{post?.postedadmin}</p>
            <p>{post?.createdAt}</p>
            <button onClick={handleDelete}>삭제</button>
        </ main>
    );
}

export default PostPage;