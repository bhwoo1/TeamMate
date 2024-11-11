"use client"


import axios from "axios";
import Link from "next/link";
import React from "react";
import { FaPencilAlt } from "react-icons/fa";
import { ReceivedNotice } from "../Type";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import { userRoleStore } from "../zustand/store";

const fetchNotices = async () => {
    const response = await axios.get("/api/notice?action=findMany");
    return response.data;
}

const NoticeBoard = () => {
    const router = useRouter();
    const {isAdmin} = userRoleStore();

    const { data: noticeArr = [], isLoading, isError, error } = useQuery<ReceivedNotice[], Error>(
        "noticeList",
        fetchNotices
    );

    const noticeClick = (id: number) => {
        router.push(`/notice/${id}`)
    };

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center">Error: {error.message}</p>;

    return (
        <div className="p-8 w-full max-w-2xl">
            {noticeArr.length === 0 ? (
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
                        
                        {noticeArr.map((notice, index) => (
                                <tr key={notice.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => noticeClick(notice.id)}>
                                    <td className="border px-4 py-2 text-center">{index + 1}</td>
                                    <td className="border px-4 py-2">{notice.title}</td>
                                    <td className="border px-4 py-2">{notice.postedadmin}</td>
                                    <td className="border px-4 py-2 text-center">{notice.createdAt}</td>
                                </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {isAdmin &&
                <div className="flex justify-end items-center mb-4 pt-4">
                    <Link href={'/notice/create'}>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
                        >
                            <FaPencilAlt className="text-lg" />
                            <span className="pl-2">작성</span>
                        </button>
                    </Link>
                </div>
            }
        </div>
    );
};

export default NoticeBoard;