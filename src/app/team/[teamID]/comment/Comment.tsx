import type { Comment } from "@/app/Type";
import React, { ChangeEvent, useState } from "react";
import CommentForm from "./CommentForm";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";

const deleteComment = async ({postID, teamID, user, username, commentId}: {postID: number; teamID: number; user:string, username: string, commentId: number}) => {
    await axios.delete('/api/comment/delete', {
        headers: {
            requestUser: user,
            requestUsername: username
        },
        data: {
            postID: postID,
            teamID: teamID,
            commentId: commentId
        }
    });
}

const updateComment = async ({postID, teamID, user, username, commentId, comment}: {postID: number; teamID: number; user:string, username: string, commentId: number, comment:string}) => {
    await axios.put('/api/comment/update', {
        postID: postID,
        teamID: teamID,
        content: comment,
        commentId: commentId
    }, {
        headers: {
            requestUser: user,
            requestUsername: username
        }
    })
}


const CommentList = ({postID, teamID, comments}: { postID: number, teamID: number, comments: Comment[] }) => {
    const { data:session } = useSession();
    const router = useRouter();
    const [editComment, setEditComment] = useState<string>("");
    const [editCommentMode, setEditCommentMode] = useState<number | null>(null);

    const handleEditChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setEditComment(event.target.value);
    };

    const deleteCommentMutation = useMutation(deleteComment, {
        onSuccess: () => {
            // window.location.reload();
            router.push(`/team/${teamID}/community`);
        },
        onError: (error: AxiosError) => {
            console.error("Delete request failed:", error.response?.data || error.message);
        }
    })

    const updateCommentMutation = useMutation(updateComment, {
        onSuccess: () => {
            // window.location.reload();
            router.push(`/team/${teamID}/community`);
        },
        onError: (error: AxiosError) => {
            console.error("Update request failed:", error.response?.data || error.message);
        }
    })

    

    const handleDelete = (commentId: number) => {
        if (session?.user?.email) {
            deleteCommentMutation.mutate({ postID: postID, teamID: teamID, user: String(session.user.email), username: String(session.user.name), commentId: commentId });
        }
    };

    const handleUpdate = ({comment, commentId} : {comment: string, commentId: number}) => {
        if (session?.user?.email) {
            updateCommentMutation.mutate({postID: postID, teamID: teamID, user: String(session.user.email), username: String(session.user.name), commentId: commentId, comment: comment});
        }
    }

    
    return(
        <div className="flex flex-col justify-center items-center">
            {comments.length === 0 ? (
                <p className="text-center">등록된 댓글이 없습니다.</p>
            ) : (
                <>{comments.map((comment) => (
                        <li key={comment.id} className="border border-gray-300 p-4 list-none w-[500px]">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="font-semibold">{comment.posteduser}</span>
                                    <span className="text-gray-500 text-sm ml-2">{String(comment.createdAt).split('T')[0]}</span>
                                </div>
                                {comment.posteduser === session?.user?.name && (
                                    <div className="flex">
                                        {/* 수정 버튼 클릭 시 editCommentMode 상태를 해당 댓글의 ID로 설정 */}
                                        <button className="px-3 py-1 text-sm" onClick={() => 
                                            {
                                                setEditCommentMode(comment.id);
                                                setEditComment(comment.content);
                                            }}>수정</button>
                                        <button className="px-3 py-1 text-sm" onClick={() => handleDelete(comment.id)}>삭제</button>
                                    </div>
                                )}
                            </div>
                            
                            {(editCommentMode === comment.id) ? (
                                <div>
                                    <textarea
                                        value={editComment}
                                        onChange={handleEditChange}
                                        placeholder="댓글을 입력하세요..."
                                        className="mt-4 p-2 border border-gray-300 w-full"
                                    />
                                    <button 
                                        onClick={() => handleUpdate({ comment: editComment, commentId: comment.id })} 
                                        className="px-3 py-1 text-sm"
                                    >
                                        완료
                                    </button>
                                    <button onClick={() => {
                                        setEditCommentMode(null); // 수정 모드 취소
                                        setEditComment(""); // 상태 초기화 (선택 사항)
                                    }} className="px-3 py-1 text-sm">취소</button>
                                </div>
                            ) : (
                                <p className="mt-2 pb-4">
                                    {comment.content && comment.content.split('§').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </p>
                            )}

                            
                        </li>
                ))}</>
            )}
            <div className="pt-8">
                <CommentForm postID={postID} teamID={teamID} />
            </div>
        </div>
    );
}

export default CommentList;