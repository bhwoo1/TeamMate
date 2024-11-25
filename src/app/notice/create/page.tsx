"use client"

import AdminPage from "@/app/components/AdminPage";
import { Notice } from "@/app/Type";

import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react"
import { useMutation } from "react-query";

const initialNotice:Notice = {
    title: "",
    content: "",
}

const submitNotice = async ({title, content, postedadmin, requestUser}: {title: string; content:string, postedadmin: string, requestUser:string}) => {
    await axios.post('/api/notice', {
        action: "create",
        title: title,
        content: content,
        postedadmin: postedadmin
    }, {
        headers: {
            requestUser: requestUser
        }
    })
}


const NoticeCreatePage = () => {
    const [notice, setNotice] = useState<Notice>(initialNotice);
    const {data: session} = useSession();
    const router = useRouter();

    const submitNoticeMutation = useMutation(submitNotice, {
        onSuccess: () => {
            alert('등록되었습니다.');
            router.push('/notice');
        },
        onError: (error: AxiosError) => {
            console.error("Delete request failed:", error.response?.data || error.message);
        }
    });

    const handleSubmit = ({e, title, content} : {e: FormEvent; title: string, content: string}) => {
        e.preventDefault();

        if (session?.user?.email) {
            submitNoticeMutation.mutate({title: title, content: content, postedadmin: String(session.user.name), requestUser: String(session.user.email)});
        }
    }



    return(
        <AdminPage>
            <main className="flex min-h-screen flex-col items-center justify-center p-20">
                <form onSubmit={(e) => handleSubmit({ e, title: notice.title, content: notice.content})} className="border border-gray-300 w-[500px]">
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