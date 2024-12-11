"use client"

import { ReceivedPost } from "@/app/Type";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";

const fetchPost = async ({teamID, postID}: {teamID: number, postID: number}) => {
    const response = await axios.get('/api/post', {
        params: {
            teamID: teamID,
            postID: postID
        }
    });
    return response.data;
}

const PostClient = ({ teamID, postID }: { teamID: number, postID: number}) => {
    const { data: post, isLoading, isError, error } = useQuery<ReceivedPost, Error>(
        "post",
        () => fetchPost({ teamID, postID })
    );
    const router = useRouter();
    const {data: session} = useSession();

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error: {error.message}</p>;
    
    return(
        <main className="flex min-h-screen flex-col items-center justify-center p-20">
            <div className="flex flex-col border-2 border-gray-300 w-[500px] rounded-md">
                <div className="flex flex-row justify-between">
                    <p className="text-wrap px-3">{post?.title}</p>
                    {post?.posteduser === session?.user?.name &&
                        <div className="flex flex-row justify-between w-[100px] text-sm text-gray-500">
                            <button className="flex-1" onClick={() => router.push(`/team/${teamID}/community/${postID}/edit`)}>수정</button>
                            <button className="flex-1">삭제</button>
                        </div>
                    }
                </div>
                <div className="flex flex-row border-t-2 border-gray-300 justify-between">
                    <p className="flex-1 text-left px-3">{post?.posteduser}</p>
                    <p className="flex-1 text-right px-3 text-sm text-gray-500">{String(post?.createdAt).split('T')[0]}</p>
                </div>
            </div>

            <p className="w-[500px] text-wrap pt-4 pb-20 text-left">{post?.content}</p>

            <Link href={`/team/${teamID}/community`} className="border rounded-md border-gray-300">
                <button className="mx-4 my-2">목록</button>
            </Link>
        </ main>
    );
}

export default PostClient;