"use client"

import AdminPage from "@/app/components/AdminPage";
import { ReceivedPost } from "@/app/Type";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

const fetchPost = async (id: number) => {
    const response = await axios.get(`/api/post?id=${id}`);
    return response.data;
};

const updatePost = async ({ id, title, content, user }: { id: number; title: string; content: string; user: string }) => {
    await axios.put('/api/post', {
        id: id,
        title: title,
        content: content
    }, {
        headers: {
            requestUser: user
        }
    });
};

const PostEditPage = (props: {params: {id: number}}) => {
    const { data: session } = useSession();
    const router = useRouter();
    const { data: post, isLoading, isError, error } = useQuery<ReceivedPost, Error>(
        ["post", props.params.id],
        () => fetchPost(props.params.id)
    );

    // Post 데이터를 복사하여 로컬 상태로 관리
    const [editedPost, setEditedPost] = useState<ReceivedPost | null>(null);

    // React Query 데이터가 변경되면 로컬 상태를 업데이트
    useEffect(() => {
        if (post) {
            setEditedPost(post);
        }
    }, [post]);

    const updatePostMutation = useMutation(updatePost, {
        onSuccess: () => {
            router.push(`/board/${props.params.id}`);
        },
        onError: (error: AxiosError) => {
            console.error("Update request failed:", error.response?.data || error.message);
        }
    });

    const handleUpdate = (e: FormEvent) => {
        e.preventDefault();

        if (session?.user?.email && editedPost) {
            updatePostMutation.mutate({id: Number(props.params.id), title: editedPost.title, content: editedPost.content, user: String(session.user.name)});
        }
    };

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error: {error.message}</p>;

    return(
        <AdminPage>
            <main className="flex min-h-screen flex-col items-center justify-center p-20">
                <form onSubmit={handleUpdate} className="border border-gray-300 w-[500px]">
                    <div className="border-b border-gray-300 flex flex-row justify-between">
                        <p className="text-l m-2">쓰기</p>
                        <div className="m-2 text-sm text-gray-500 flex flex-row justify-end">
                            <button type="button" className="mr-4" onClick={() => router.push(`/board/${props.params.id}`)}>취소</button>
                            <button type="submit" className="bg-blue-500 w-1/8 m-2 p-2 text-white text-sm font-bold">등록</button>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <input 
                            type="text" 
                            id="title" 
                            name="title" 
                            className="border border-gray-300 m-2" 
                            value={editedPost?.title || ""} 
                            onChange={(e) => {
                                if (editedPost) {
                                    setEditedPost({ ...editedPost, title: e.target.value });
                                }
                            }} 
                        />
                        <textarea 
                            id="content" 
                            name="content" 
                            className="border border-gray-300 m-2 h-[400px]" 
                            value={editedPost?.content || ""} 
                            onChange={(e) => {
                                if (editedPost) {
                                    setEditedPost({ ...editedPost, content: e.target.value });
                                }
                            }} 
                        />
                    </div>
                    <div className="m-2 text-sm text-gray-500 flex flex-row justify-end">
                        <button type="button" className="mr-4" onClick={() => router.push(`/board/${props.params.id}`)}>취소</button>
                        <button type="submit" className="bg-blue-500 w-1/8 m-2 p-2 text-white text-sm font-bold">등록</button>
                    </div>
                </form>
            </main>
        </AdminPage>
    );
};

export default PostEditPage;