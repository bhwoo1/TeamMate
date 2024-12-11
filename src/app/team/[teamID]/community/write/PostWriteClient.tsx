"use client"

import { Post } from "@/app/Type";
import { userRoleStore } from "@/app/zustand/store";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useMutation } from "react-query";

const initialPost:Post = {
    title: "",
    content: "",
    isNotice: false
}

const submitPost = async ({title, content, isNotice, user, teamID}: {title: string, content: string, isNotice: boolean, user: string, teamID: number}) => {
    await axios.post('/api/post/write', {
        title: title,
        content: content,
        isNotice: isNotice
    }, {
        headers: {
            requestUser: user,
            teamID: teamID
        }
    });
}

const PostWriteClient = ({teamID}: {teamID: number}) => {
    const { isAdmin } = userRoleStore();
    const [post, setPost] = useState<Post>(initialPost);
    const { data: session } = useSession();
    const router = useRouter();


    const submitPostMutation = useMutation(submitPost, {
        onSuccess: () => {
            alert('등록되었습니다.');
            router.push(`/team/${teamID}/community`);
        },
        onError: (error: AxiosError) => {
            console.error("Delete request failed:", error.response?.data || error.message);
        }
    });

    const handleSubmit = ({e, title, content, isNotice} : {e: FormEvent, title: string, content: string, isNotice: boolean}) => {
        e.preventDefault();

        if (session?.user?.email) {
            submitPostMutation.mutate({title: title, content: content, isNotice: isNotice, user: String(session.user.email), teamID: teamID});
        }
    }
    
    return(
        <main className="flex min-h-screen flex-col items-center justify-center p-20">
                <form onSubmit={(e) => handleSubmit({ e, title: post.title, content: post.content, isNotice: post.isNotice})} className="border border-gray-300 w-[500px]">
                    <div className="border-b border-gray-300 flex flex-row justify-between">
                        <p className="text-l m-2">쓰기</p>
                        <div className="m-2 text-sm text-gray-500 flex flex-row justify-end text-sm text-gray-500">
                            <button type="button" className="mr-4" onClick={() => router.push(`/team/${teamID}/community`)}>취소</button>
                            <button type="submit" className="bg-blue-500 w-1/8 m-2 p-2 text-white text-sm font-bold">등록</button>
                        </div>
                    </div>
                    {isAdmin && (
                        <div className="border-b border-gray-300 flex flex-row">
                            <input
                                type="checkbox"
                                id="isNotice"
                                name="isNotice"
                                className="m-2"
                                checked={post.isNotice} // 체크 상태 반영
                                onChange={(e) => setPost({...post, isNotice: e.target.checked})} // 체크박스 변경 시 상태 업데이트
                            />
                            <label htmlFor="isNotice" className="m-2" >
                                공지사항
                            </label>
                        </div>
                    )}
                    <div className="flex flex-col">
                        <input type="text" id="title" name="title" className="border border-gray-300 m-2" value={post.title} onChange={(e) => setPost({...post, title: e.target.value})}/>
                        <textarea id="content" name="content" className="border border-gray-300 m-2 h-[400px]" value={post.content} onChange={(e) => setPost({ ...post, content: e.target.value })}/>
                    </div>
                    <div className="m-2 text-sm text-gray-500 flex flex-row justify-end text-sm text-gray-500">
                            <button type="button" className="mr-4" onClick={() => router.push(`/team/${teamID}/community`)}>취소</button>
                            <button type="submit" className="bg-blue-500 w-1/8 m-2 p-2 text-white text-sm font-bold">등록</button>
                    </div>
                </form>
        </main>
    );
}

export default PostWriteClient;