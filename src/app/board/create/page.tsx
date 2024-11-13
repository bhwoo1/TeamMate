"use client"

import AdminPage from "@/app/components/AdminPage";
import { Post } from "@/app/Type";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react"

const initialPost:Post = {
    title: "",
    content: ""
};

const PostCreatePage = () => {
    const [post, setPost] = useState<Post>(initialPost);
    const {data: session} = useSession();
    const router = useRouter();



    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('/api/post', {
                action: 'create', // action 필드를 추가합니다.
                title: post.title,
                content: post.content,
                posteduser: String(session?.user?.name)
            });
    
            console.log(response);
            alert('등록되었습니다.');
            router.push('/board');
        } catch (err) {
            console.log(err);
            alert('등록에 실패하였습니다.');
        }
    }



    return(
        <AdminPage>
            <main className="flex min-h-screen flex-col items-center justify-center p-20">
                <form onSubmit={handleSubmit}>
                    <h2>게시글 등록</h2>
                    <input type="text" id="title" name="title" value={post.title} onChange={(e) => setPost({...post, title: e.target.value})}/>
                    <textarea id="content" name="content" value={post.content} onChange={(e) => setPost({ ...post, content: e.target.value })}/>
                    <button type="button" onClick={() => router.push('/board')}>취소</button>
                    <button type="submit">등록</button>
                </form>
            </main>
        </AdminPage>
    );
}

export default PostCreatePage;