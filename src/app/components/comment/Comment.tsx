import type { Comment } from "@/app/Type";
import React from "react";
import CommentForm from "./CommentForm";


const Comment = (prop: { id: number, comments: Comment[] }) => {

    
    return(
        <>
            {prop.comments.length === 0 ? (
                <p className="text-center">등록된 댓글이 없습니다.</p>
            ) : (
                <>{prop.comments.map((comment, index) => (
                    <p key={index}>{comment.content}</p>
                ))}</>
            )}
            <CommentForm id={prop.id} />
        </>
    );
}

export default Comment;