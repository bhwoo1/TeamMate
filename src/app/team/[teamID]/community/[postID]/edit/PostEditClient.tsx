"use client"

import { ReceivedPost } from "@/app/Type";
import { userRoleStore } from "@/app/zustand/store";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

const fetchPost = async ({teamID, postID}: {teamID: number, postID: number}) => {
    const response = await axios.get('/api/post', {
        params: {
            teamID: teamID,
            postID: postID
        }
    });
    return response.data;
}

const updatePost = async ({ postID, teamID, title, content, isNotice, user }: { postID: number; teamID: number; title: string; content: string; isNotice: boolean; user: string }) => {
    await axios.put('/api/post/edit', {
        title: title,
        content: content,
        isNotice: isNotice
    }, {
        headers: {
            requestUser: user,
            postID: postID,
            teamID: teamID
        }
    });
};

const PostEditClient = ({ teamID, postID }: { teamID: number, postID: number}) => {
    const { isAdmin } = userRoleStore();
    const { data: session } = useSession();
    const router = useRouter();
    const { data: post, isLoading, isError, error } = useQuery<ReceivedPost, Error>(
        "post",
        () => fetchPost({ teamID, postID })
    );

    // Notice 데이터를 복사하여 로컬 상태로 관리
    const [editedPost, setEditedPost] = useState<ReceivedPost | null>(null);

    // React Query 데이터가 변경되면 로컬 상태를 업데이트
    useEffect(() => {
        if (post) {
            setEditedPost(post);
        }
    }, [post]);

    const updatePostMutation = useMutation(updatePost, {
        onSuccess: () => {
            // 수정 완료 후 게시글 상세 페이지로 리다이렉트
            router.push(`/team/${teamID}/community/${postID}`);
        },
        onError: (error: AxiosError) => {
            console.error("Update request failed:", error.response?.data || error.message);
        }
    });

    const handleUpdate = (e: FormEvent) => {
        e.preventDefault();

        if (session?.user?.email && editedPost) {
            updatePostMutation.mutate({postID: postID, teamID: teamID, title: editedPost.title, content: editedPost.content, isNotice: editedPost.isNotice, user: String(session.user.name)});
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
                            <button type="button" className="mr-4" onClick={() => router.push(`/team/${teamID}/community/${postID}`)}>취소</button>
                            <button type="submit" className="bg-blue-500 w-1/8 m-2 p-2 text-white text-sm font-bold">등록</button>
                        </div>
                    </div>
                    {isAdmin && (
                        <div className="border-b border-gray-300 flex flex-row">
                            <input
                                type="checkbox"
                                id="isNotice"
                                name="isNotice"
                                className="m-2"
                                checked={editedPost?.isNotice} // 체크 상태 반영
                                onChange={(e) => {
                                    if (editedPost) {
                                        setEditedPost({ ...editedPost, isNotice: e.target.checked });
                                    }
                                }} // 체크박스 변경 시 상태 업데이트
                            />
                            <label htmlFor="isNotice" className="m-2" >
                                공지사항
                            </label>
                        </div>
                    )}
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
                        <button type="button" className="mr-4" onClick={() => router.push(`/team/${teamID}/community/${postID}`)}>취소</button>
                        <button type="submit" className="bg-blue-500 w-1/8 m-2 p-2 text-white text-sm font-bold">등록</button>
                    </div>
                </form>
            </main>
    );
};

export default PostEditClient;