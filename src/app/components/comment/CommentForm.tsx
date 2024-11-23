import axios from "axios";
import { useSession } from "next-auth/react";
import React, { FormEvent, useState } from "react";


const CommentForm = (prop: {id: number}) => {
    const [content, setContent] = useState<string>("");
    const {data: session} = useSession();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('/api/comment', {
                action: 'create', // action 필드를 추가합니다.
                content: content,
                posteduser: String(session?.user?.name),
                postid: prop.id
            });
    
            console.log(response);
            alert('등록되었습니다.');
            window.location.reload();
        } catch (err) {
            console.log(err);
            alert('등록에 실패하였습니다.');
        }
    }

    return(
        <div className="">
            <div className="border border-gray-300">
                <p>댓글 쓰기</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <textarea id="content" name="content" className="p-2 w-[500px] border border-gray-300" placeholder="댓글 내용을 입력해주세요." value={content} onChange={(e) => setContent(e.target.value)}/>
                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 w-1/5 m-2 mr-0 p-2 text-white text-sm font-bold">댓글 등록</button>
                </div>
            </form>
        </div>
    );
}

export default CommentForm;