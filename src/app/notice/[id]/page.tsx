"use client"

import { ReceivedNotice } from "@/app/Type";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
            <div className="flex flex-col border-2 border-gray-300 w-[500px] rounded-md">
                <div className="flex flex-row justify-between">
                    <p className="text-wrap px-3">{notice?.title}</p>
                    {notice?.postedadmin === session?.user?.name &&
                        <div className="flex flex-row justify-between w-[100px] text-sm text-gray-500">
                            <button className="flex-1" onClick={() => router.push(`/notice/edit/${props.params.id}`)}>수정</button>
                            <button className="flex-1" onClick={handleDelete}>삭제</button>
                        </div>
                    }
                </div>
                <div className="flex flex-row border-t-2 border-gray-300 justify-between">
                    <p className="flex-1 text-left px-3">{notice?.postedadmin}</p>
                    <p className="flex-1 text-right px-3 text-sm text-gray-500">{notice?.createdAt.split('T')[0]}</p>
                </div>
            </div>

            <p className="w-[500px] text-wrap pt-4 pb-20 text-left">{notice?.content}</p>

            <Link href="/notice" className="border rounded-md border-gray-300">
                <button className="mx-4 my-2">목록</button>
            </Link>
        </ main>
    );
}

export default NoticePost;