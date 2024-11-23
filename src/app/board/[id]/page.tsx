"use client"

import Comment from "@/app/components/comment/Comment";
import { ReceivedPost } from "@/app/Type";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
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
    const { data: post, isLoading, isError, error } = useQuery<ReceivedPost, Error>(
        ["post", props.params.id],
        () => fetchPost(props.params.id),
        {
            onSuccess: (data) => {
                console.log("Post fetched successfully:", data);
            },
            onError: (error) => {
                console.error("Error fetching post:", error);
            }
        }
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
            <div className="flex flex-col border-2 border-gray-300 w-[500px] rounded-md">
                <div className="flex flex-row justify-between">
                    <p className="text-wrap px-3">{post?.title}</p>
                    {post?.posteduser === session?.user?.name &&
                        <div className="flex flex-row justify-between w-[100px] text-sm text-gray-500">
                            <button className="flex-1">수정</button>
                            <button className="flex-1" onClick={handleDelete}>삭제</button>
                        </div>
                    }
                </div>
                <div className="flex flex-row border-t-2 border-gray-300 justify-between">
                    <p className="flex-1 text-left px-3">{post?.posteduser}</p>
                    <p className="flex-1 text-right px-3 text-sm text-gray-500">{post?.createdAt.split('T')[0]}</p>
                </div>
            </div>

            <p className="w-[500px] text-wrap pt-4 pb-20 text-left">{post?.content}</p>

            <Link href="/board" className="border rounded-md border-gray-300">
                <button className="mx-4 my-2">목록</button>
            </Link>
            <div className="pt-4">
                <Comment id={Number(post?.id)} comments={post?.comments || []} />
            </div>
        </main>
    );
}

export default PostPage;