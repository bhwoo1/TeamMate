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
                <form onSubmit={handleSubmit}>
                    <h2>공지 등록</h2>
                    <input type="text" id="title" name="title" value={notice.title} onChange={(e) => setNotice({...notice, title: e.target.value})}/>
                    <textarea id="content" name="content" value={notice.content} onChange={(e) => setNotice({ ...notice, content: e.target.value })}/>
                    <button type="button" onClick={() => router.push('/notice')}>취소</button>
                    <button type="submit">등록</button>
                </form>
            </main>
        </AdminPage>
    );
}

export default NoticeCreatePage;