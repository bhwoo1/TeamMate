"use client"

import { ReceivedPost } from "@/app/Type";
import axios from "axios"
import { useQuery } from "react-query";
import { FaPencilAlt } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const fetchPosts = async ({teamID}: {teamID: number}) => {
    const response = await axios.get("/api/post", {
        params: {
            teamID: teamID
        }
    });
    return response.data;
}
const CommunityBoard = ({ teamID } : { teamID: number }) => {
    const router = useRouter();
    const { data: postArr = [], isLoading, isError, error } = useQuery<ReceivedPost[], Error>(
        "postList",
        () => fetchPosts({ teamID })
    );

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error: {error.message}</p>;

    const postClick = (id: number) => {
        router.push(`/team/${teamID}/community/${id}`);
    };

    return (
        <div className="p-8 w-full max-w-2xl">
            {postArr.length === 0 ? (
                <p className="text-center">등록된 공지가 없습니다.</p>
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
                                    <td className="border px-4 py-2 text-center">{String(post.createdAt)}</td>
                                </tr>
                        ))}
                    </tbody>
                </table>
            )}
                <div className="flex justify-end items-center mb-4 pt-4">
                    <Link href={`/team/${teamID}/community/write`}>
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

export default CommunityBoard