"use client"

import { ReceivedNotice } from "@/app/Type";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

const fetchNotice = async (id: number) => {
    const response = await axios.get(`/api/notice?id=${id}`);
    return response.data;
};

const updateNotice = async ({ id, title, content, user }: { id: number; title: string; content: string; user: string }) => {
    await axios.put('/api/notice', {
        id: id,
        title: title,
        content: content
    }, {
        headers: {
            requestUser: user
        }
    });
};

const NoticeEditClient = (props: {id: number}) => {
    const { data: session } = useSession();
    const router = useRouter();
    const { data: notice, isLoading, isError, error } = useQuery<ReceivedNotice, Error>(
        ["notice", props.id],
        () => fetchNotice(props.id)
    );

    // Notice 데이터를 복사하여 로컬 상태로 관리
    const [editedNotice, setEditedNotice] = useState<ReceivedNotice | null>(null);

    // React Query 데이터가 변경되면 로컬 상태를 업데이트
    useEffect(() => {
        if (notice) {
            setEditedNotice(notice);
        }
    }, [notice]);

    const updateNoticeMutation = useMutation(updateNotice, {
        onSuccess: () => {
            router.push(`/notice/${props.id}`);
        },
        onError: (error: AxiosError) => {
            console.error("Update request failed:", error.response?.data || error.message);
        }
    });

    const handleUpdate = (e: FormEvent) => {
        e.preventDefault();

        if (session?.user?.email && editedNotice) {
            updateNoticeMutation.mutate({id: Number(props.id), title: editedNotice.title, content: editedNotice.content, user: String(session.user.email)});
        }
    };

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error: {error.message}</p>;

    return(
            <main className="flex min-h-screen flex-col items-center justify-center p-20">
                <form onSubmit={handleUpdate} className="border border-gray-300 w-[500px]">
                    <div className="border-b border-gray-300 flex flex-row justify-between">
                        <p className="text-l m-2">쓰기</p>
                        <div className="m-2 text-sm text-gray-500 flex flex-row justify-end">
                            <button type="button" className="mr-4" onClick={() => router.push(`/notice/${props.id}`)}>취소</button>
                            <button type="submit" className="bg-blue-500 w-1/8 m-2 p-2 text-white text-sm font-bold">등록</button>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <input 
                            type="text" 
                            id="title" 
                            name="title" 
                            className="border border-gray-300 m-2" 
                            value={editedNotice?.title || ""} 
                            onChange={(e) => {
                                if (editedNotice) {
                                    setEditedNotice({ ...editedNotice, title: e.target.value });
                                }
                            }} 
                        />
                        <textarea 
                            id="content" 
                            name="content" 
                            className="border border-gray-300 m-2 h-[400px]" 
                            value={editedNotice?.content || ""} 
                            onChange={(e) => {
                                if (editedNotice) {
                                    setEditedNotice({ ...editedNotice, content: e.target.value });
                                }
                            }} 
                        />
                    </div>
                    <div className="m-2 text-sm text-gray-500 flex flex-row justify-end">
                        <button type="button" className="mr-4" onClick={() => router.push(`/notice/${props.id}`)}>취소</button>
                        <button type="submit" className="bg-blue-500 w-1/8 m-2 p-2 text-white text-sm font-bold">등록</button>
                    </div>
                </form>
            </main>
    );
};

export default NoticeEditClient;