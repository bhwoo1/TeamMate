"use client";

import { ReceivedPost } from "@/app/Type";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { FaPencilAlt } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PostSearchBar from "@/app/search/PostSearchBar";

const fetchPosts = async ({ teamID }: { teamID: number }) => {
    const response = await axios.get("/api/post", {
        params: {
            teamID: teamID,
        },
    });
    return response.data;
};

const CommunityBoard = ({ teamID }: { teamID: number }) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const postsPerPage = 20; // 페이지당 최대 게시글 수
    const { data: postArr = [], isLoading, isError, error } = useQuery<ReceivedPost[], Error>(
        "postList",
        () => fetchPosts({ teamID })
    );

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error: {error.message}</p>;

    // 게시글 정렬: isNotice가 true인 게시글을 상단에 배치
    const notices = postArr.filter((post) => post.isNotice); // 공지사항만 추출
    const regularPosts = postArr.filter((post) => !post.isNotice); // 일반 게시글만 추출

    // 일반 게시글을 페이지네이션
    const totalPages = Math.ceil(regularPosts.length / postsPerPage); // 총 페이지 수 계산
    const paginatedPosts = regularPosts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    const postClick = (id: number) => {
        router.push(`/team/${teamID}/community/${id}`);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-8 w-full w-3/4">
            {postArr.length === 0 ? (
                <p className="text-center">등록된 게시글이 없습니다.</p>
            ) : (
                <>
                    <table className="table table-hover">
                        <thead>
                            <tr className="table-light">
                                <th style={{ width: "10%" }} className="text-center">
                                    구분
                                </th>
                                <th style={{ width: "50%" }} className="text-center">
                                    제목
                                </th>
                                <th style={{ width: "20%" }} className="text-center">
                                    작성자
                                </th>
                                <th style={{ width: "20%" }} className="text-center">
                                    작성일
                                </th>
                            </tr>
                        </thead>
                        {/* 공지사항만 있는 tbody */}
                        <tbody className="border-b-4 border-gray-300">
                            {notices.map((post) => (
                                <tr
                                    key={post.id}
                                    onClick={() => postClick(post.id)}
                                    className="cursor-pointer"
                                >
                                    <td className="text-center">공지</td>
                                    <td>{post.title}</td>
                                    <td className="text-center">{post.posteduser}</td>
                                    <td className="text-center text-sm">
                                        {String(post.createdAt).split("T")[0]}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        {/* 일반 게시글만 있는 tbody (페이지네이션 적용) */}
                        <tbody className="">
                            {paginatedPosts.map((post) => (
                                <tr
                                    key={post.id}
                                    onClick={() => postClick(post.id)}
                                    className="cursor-pointer"
                                >
                                    <td className="text-center">자유</td>
                                    <td>{post.title}</td>
                                    <td className="text-center">{post.posteduser}</td>
                                    <td className="text-center text-sm">
                                        {String(post.createdAt).split("T")[0]}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* 페이지네이션 컨트롤 */}
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`mx-2 px-4 py-2 ${
                                    currentPage === index + 1
                                        ? "text-black font-bold"
                                        : "bg-gray-200"
                                } rounded`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
            <div className="flex justify-end items-center mb-4 pt-4">
                <Link href={`/team/${teamID}/community/write`}>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded flex items-center">
                        <FaPencilAlt className="text-lg" />
                        <span className="pl-2">작성</span>
                    </button>
                </Link>
            </div>
            <div className="flex items-center justiy-center">
                <PostSearchBar />
            </div>
        </div>
    );
};

export default CommunityBoard;