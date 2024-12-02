"use client"

import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import React, { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

const submitComment = async ({content, user, id}: {content: string, user: string, id: number}) => {
    await axios.post('/api/comment', {
        action: "create",
        content: content,
        posteduser: user,
        postid: id
    })
}


const CommentForm = (prop: {id: number}) => {
    const queryClient = useQueryClient();
    const [content, setContent] = useState<string>("");
    const {data: session} = useSession();

    const submitCommentMutation = useMutation(submitComment, {
        onSuccess: () => {
            alert('등록되었습니다.');
            queryClient.invalidateQueries(['comments', prop.id]);
        },
        onError: (error: AxiosError) => {
            console.error("Delete request failed:", error.response?.data || error.message);
        }
    });

    const handleSubmit = ({e, content}: {e: FormEvent, content: string}) => {
        e.preventDefault();

        if (session?.user?.email) {
            submitCommentMutation.mutate({content: content, user: String(session.user.name), id: prop.id})
        }
    }

    return(
        <div className="">
            <div className="border border-gray-300">
                <p>댓글 쓰기</p>
            </div>
            <form onSubmit={(e) => handleSubmit({e, content})} className="flex flex-col">
                <textarea id="content" name="content" className="p-2 w-[500px] border border-gray-300" placeholder="댓글 내용을 입력해주세요." value={content} onChange={(e) => setContent(e.target.value)}/>
                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 w-1/5 m-2 mr-0 p-2 text-white text-sm font-bold">댓글 등록</button>
                </div>
            </form>
        </div>
    );
}

export default CommentForm;