"use client"

import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { ReceivedPost } from "../Type";
import Link from "next/link";
import { FaPencilAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const fetchPost = async () => {
    const response = await axios.get("/api/post");
    return response.data;
}

const PostBoard = () => {
    const router = useRouter();
    const { data: postArr = [], isLoading, isError, error } = useQuery<ReceivedPost[], Error>(
        "postList",
        fetchPost
    );

    const postClick = (id: number) => {
        router.push(`/board/${id}`)
    };

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error: {error.message}</p>;


    

    return(
        <div className="p-8 w-full max-w-2xl">
            {postArr.length === 0 ? (
                <p className="text-center">등록된 게시글이 없습니다.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">번호</th>
                        <th className="border px-4 py-2">제목</th>
                        <th className="border px-4 py-2">작성자</th>
                        <th className="border px-4 py-2">작성일</th>
                    </tr>
                </thead>
                <tbody>

                    {postArr.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => postClick(post.id)}>
                            <td className="border px-4 py-2 text-center">{post.id}</td>
                            <td className="border px-4 py-2">{post.title}</td>
                            <td className="border px-4 py-2">{post.posteduser}</td>
                            <td className="border px-4 py-2 text-center">{post.createdAt.split('T')[0]}</td>
                        </tr>
                    ))}

                </tbody>
                </table> 
            )}
            <div className="flex justify-end items-center mb-4 pt-4">
                    <Link href={'/board/create'}>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
                        >
                            <FaPencilAlt className="text-lg" />
                            <span className="pl-2">작성</span>
                        </button>
                    </Link>
            </div>
        </div>
    );
}

export default PostBoard;