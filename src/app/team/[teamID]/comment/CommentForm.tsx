"use client"

import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

const submitComment = async ({content, username, user, postID, teamID}: {content: string, username: string, user:string, postID: number, teamID: number}) => {
    await axios.post('/api/comment/write', {
        content: content,
        postedusername: username,
        postID: postID,
        teamID: teamID
    }, {
        headers: {
            RequestUser: user,
        }
    })
}


const CommentForm = ({postID, teamID}: {postID: number, teamID: number}) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [content, setContent] = useState<string>("");
    const {data: session} = useSession();

    const submitCommentMutation = useMutation(submitComment, {
        onSuccess: () => {
            alert('등록되었습니다.');
            queryClient.invalidateQueries(['comments', postID]);
            router.push(`/team/${teamID}/community`);
        },
        onError: (error: AxiosError) => {
            console.error("Submit request failed:", error.response?.data || error.message);
        }
    });

    const handleSubmit = ({e, content}: {e: FormEvent, content: string}) => {
        e.preventDefault();

        console.log(content);
        console.log(session?.user?.name, session?.user?.email, teamID, postID);

        if (content === ""){
            alert('내용을 입력해주세요');
        }
        else {
            if (session?.user?.email) {
                submitCommentMutation.mutate({content: content, username: String(session.user.name), user: String(session.user.email), postID: postID, teamID: teamID})
            }
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