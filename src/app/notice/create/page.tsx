"use client"

import AdminPage from "@/app/components/AdminPage";
import { Notice } from "@/app/Type";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react"

const initialNotice:Notice = {
    title: "",
    content: "",
}

const NoticeCreatePage = () => {
    const [notice, setNotice] = useState<Notice>(initialNotice);
    const {data: session} = useSession();
    const router = useRouter();



    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('/api/notice', {
                action: 'create', // action 필드를 추가합니다.
                title: notice.title,
                content: notice.content,
                postedadmin: String(session?.user?.name)
            }, {
                headers: {
                    "requestUser": String(session?.user?.email)
                }
            });
    
            console.log(response);
            alert('등록되었습니다.');
            router.push('/notice');
        } catch (err) {
            console.log(err);
            alert('등록에 실패하였습니다.');
        }
    }



    return(
        <AdminPage>
            <main className="flex min-h-screen flex-col items-center justify-center p-20">
                <form onSubmit={handleSubmit} className="border border-gray-300 w-[500px]">
                    <div className="border-b border-gray-300 flex flex-row justify-between">
                        <p className="text-l m-2">쓰기</p>
                        <div className="m-2 text-sm text-gray-500 flex flex-row justify-end text-sm text-gray-500">
                            <button type="button" className="mr-4" onClick={() => router.push('/notice')}>취소</button>
                            <button type="submit" className="bg-blue-500 w-1/8 m-2 p-2 text-white text-sm font-bold">등록</button>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <input type="text" id="title" name="title" className="border border-gray-300 m-2" value={notice.title} onChange={(e) => setNotice({...notice, title: e.target.value})}/>
                        <textarea id="content" name="content" className="border border-gray-300 m-2 h-[400px]" value={notice.content} onChange={(e) => setNotice({ ...notice, content: e.target.value })}/>
                    </div>
                    <div className="m-2 text-sm text-gray-500 flex flex-row justify-end text-sm text-gray-500">
                            <button type="button" className="mr-4" onClick={() => router.push('/notice')}>취소</button>
                            <button type="submit" className="bg-blue-500 w-1/8 m-2 p-2 text-white text-sm font-bold">등록</button>
                    </div>
                </form>
            </main>
        </AdminPage>
    );
}

export default NoticeCreatePage;