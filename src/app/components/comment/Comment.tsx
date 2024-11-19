import type { Comment } from "@/app/Type";
import React from "react";
import CommentForm from "./CommentForm";
import { useSession } from "next-auth/react";


const Comment = (prop: { id: number, comments: Comment[] }) => {
    const { data:session } = useSession();
    // const [newComment, setNewComment] = useState<string>("");
    // const [editComment, setEditComment] = useState<string>("");
    // const [replyComment, setReplyComment] = useState<string>("");
    // const [replyCommentFor, setReplyCommentFor] = useState<number | null>(null);
    // const [editCommentMode, setEditCommentMode] = useState<number | null>(null);

    
    return(
        <div className="flex flex-col justify-center items-center">
            {prop.comments.length === 0 ? (
                <p className="text-center">등록된 댓글이 없습니다.</p>
            ) : (
                <>{prop.comments.map((comment) => (

                        <li key={comment.id} className="border border-gray-300 p-4 list-none rounded-md w-1/3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="font-semibold">{comment.posteduser}</span>
                                    <span className="text-gray-500 text-sm ml-2">{comment.createdAt.split('T')[0]}</span>
                                </div>
                                {comment.posteduser === session?.user?.name && (
                                    <div className="flex">
                                        {/* 수정 버튼 클릭 시 editCommentMode 상태를 해당 댓글의 ID로 설정 */}
                                        <button className="px-3 py-1 text-sm">수정</button>
                                        <button className="px-3 py-1 text-sm">삭제</button>
                                    </div>
                                )}
                            </div>
                            
                            {/* {(editCommentMode === comment.id) ? (
                                <div>
                                    <textarea
                                        value={editComment}
                                        onChange={handleEditChange}
                                        placeholder="댓글을 입력하세요..."
                                        className="mt-4 p-2 border border-gray-300 rounded-md w-full"
                                    />
                                    <button onClick={() => updateComment(comment)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">수정 완료</button>
                                </div>
                            ) : ( */}
                                <p className="mt-2 pb-4">
                                    {comment.content && comment.content.split('§').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </p>
                            {/* )} */}

                            {/*  <button className="px-3 py-1 text-sm border-2 border-gray-100 m-4" onClick={() => setReplyCommentFor(comment.commentid)}>답글</button>

                            {replyCommentFor === comment.id && (
                                <div className="border border-gray-300 p-4 rounded-md">
                                    <textarea
                                        value={replyComment}
                                        onChange={handleReplyInputChange}
                                        placeholder="답변을 입력하세요..."
                                        className="mt-4 p-2 border border-gray-300 rounded-md w-full"
                                    />
                                    <button onClick={handleSubmit} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">답변 추가</button>
                                </div>
                            )}


                            {comments.filter(isChildComment).map((childComment) => (
                                <div key={childComment.commentid} className="border border-gray-300 p-4 rounded-md ml-8">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="font-semibold">{childComment.username}</span>
                                            <span className="text-gray-500 text-sm ml-2">{childComment.datetime[0] + "." + childComment.datetime[1] + "." + childComment.datetime[2] + ". " + childComment.datetime[3] + ":" + childComment.datetime[4]}</span>
                                        </div>
                                        {childComment.user === session?.user?.name && (
                                            <div className="flex">
                                                <button className="px-3 py-1 text-sm">수정</button>
                                                <button className="px-3 py-1 text-sm" onClick={() => deleteComment(childComment.commentid, childComment.username)}>삭제</button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-2">
                                        {childComment.content && childComment.content.split('§').map((line, index) => (
                                            <React.Fragment key={index}>
                                            {line}
                                            <br />
                                            </React.Fragment>
                                        ))}
                                    </p>
                                </div>
                            ))} */}
                        </li>
                ))}</>
            )}
            <CommentForm id={prop.id} />
        </div>
    );
}

export default Comment;