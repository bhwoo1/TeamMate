import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";



const CommentForm = (prop: {id: number}) => {
    const [content, setContent] = useState<string>("");
    const {data: session} = useSession();
    const router = useRouter();

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
            router.push('/board');
        } catch (err) {
            console.log(err);
            alert('등록에 실패하였습니다.');
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <textarea id="content" name="content" value={content} onChange={(e) => setContent(e.target.value)}/>
            <button type="submit">등록</button>
        </form>
    );
}

export default CommentForm;