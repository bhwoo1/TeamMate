"use client"


import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { ReceivedNotice } from "../Type";

const NoticeBoard = () => {
    const [noticeArr, setNoticeArr] = useState<ReceivedNotice[]>([]);

    useEffect(() => {
        axios.get("/api/notice?action=findMany")
        .then((res) => {
            console.log(res.data);
            setNoticeArr(res.data);
        })
        .catch((err) => {
            console.log("Error response:", err.response?.data);
        });
    }, []);

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
                            <th className="border px-4 py-2">작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {noticeArr.map((notice, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border px-4 py-2 text-center">{index + 1}</td>
                                <td className="border px-4 py-2">{notice.title}</td>
                                <td className="border px-4 py-2 text-center">{notice.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <Link href={'/notice/create'}>
                <div className="flex justify-end items-center mb-4">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
                    >
                        <FaPencilAlt className="text-lg" />
                        <span className="pl-2">작성</span>
                    </button>
                </div>
            </Link>
        </div>
    );
};

export default NoticeBoard;