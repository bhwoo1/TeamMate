"use client"

import { Post } from "@/app/Type";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react"
import { useMutation } from "react-query";

const initialPost:Post = {
    title: "",
    content: ""
};

const submitPost = async ({title, content, posteduser}: {title: string; content:string, posteduser: string}) => {
    await axios.post('/api/post', {
        action: "create",
        title: title,
        content: content,
        posteduser: posteduser
    })
};

const PostCreateClient = () => {
    const [post, setPost] = useState<Post>(initialPost);
    const {data: session} = useSession();
    const router = useRouter();


    const submitPostMutation = useMutation(submitPost, {
        onSuccess: () => {
            alert('등록되었습니다.');
            router.push('/board');
        },
        onError: (error: AxiosError) => {
            console.error("Delete request failed:", error.response?.data || error.message);
        }
    });

    const handleSubmit = ({e, title, content} : {e: FormEvent; title: string, content: string}) => {
        e.preventDefault();

        if (session?.user?.email) {
            submitPostMutation.mutate({title: title, content: content, posteduser: String(session.user.name)});
        }
    }

    return(
        <main className="flex min-h-screen flex-col items-center justify-center p-20">
                <form onSubmit={(e) => handleSubmit({ e, title: post.title, content: post.content})} className="border border-gray-300 w-[500px]">
                    <div className="border-b border-gray-300 flex flex-row justify-between">
                        <p className="text-l m-2">쓰기</p>
                        <div className="m-2 text-sm text-gray-500 flex flex-row justify-end text-sm text-gray-500">
                            <button type="button" className="mr-4" onClick={() => router.push('/board')}>취소</button>
                            <button type="submit" className="bg-blue-500 w-1/8 m-2 p-2 text-white text-sm font-bold">등록</button>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <input type="text" id="title" name="title" className="border border-gray-300 m-2" value={post.title} onChange={(e) => setPost({...post, title: e.target.value})}/>
                        <textarea id="content" name="content" className="border border-gray-300 m-2 h-[400px]" value={post.content} onChange={(e) => setPost({ ...post, content: e.target.value })}/>
                    </div>
                    <div className="m-2 text-sm text-gray-500 flex flex-row justify-end text-sm text-gray-500">
                            <button type="button" className="mr-4" onClick={() => router.push('/board')}>취소</button>
                            <button type="submit" className="bg-blue-500 w-1/8 m-2 p-2 text-white text-sm font-bold">등록</button>
                    </div>
                </form>
            </main>
    );
}

export default PostCreateClient;