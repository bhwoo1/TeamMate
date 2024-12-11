import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

// 관리자 확인 함수
async function isAdmin(requestUser: string) {
    const user = await prisma.teamUser.findUnique({
        where: { userId: requestUser },
    });
    return user?.role === "admin";
}

export async function DELETE(req: Request) {
    try{
        const body = await req.json();
        const requestUser = req.headers.get("requestUser");
        const requestUsername = req.headers.get("requestUsername");

        // 필수 정보가 없으면 오류 반환
        if (!requestUser || !body.teamID || !body.postID || !body.commentId) {
            return NextResponse.json({ error: "User, team ID, post ID, and comment ID are required" }, { status: 400 });
        }

        // 해당 포스트를 조회하여 posteduser 가져오기
        const post = await prisma.post.findUnique({
            where: { id: body.postID },
        });

        // 포스트가 존재하지 않는 경우
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const comment = await prisma.comment.findUnique({
            where: { id: body.commentId },  // 댓글 ID로 댓글 조회
        });

        // 댓글이 존재하지 않는 경우
        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        // 이메일로 유저 ID 찾기
        const user = await prisma.user.findUnique({
            where: { email: requestUser },
            select: { id: true }, // userId만 가져오기
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }

        // 요청한 사용자가 관리자라면 모든 댓글 삭제 가능
        if (await isAdmin(user.id)) {
            // 댓글 삭제
            await prisma.comment.delete({
                where: {
                    id: body.commentId,
                },
            });


            return NextResponse.json({ status: 200 });
        }



        if (comment.posteduser === requestUsername) {
            const deletedComment = await prisma.comment.delete({
                where: {id: body.commentId}
            });
            return NextResponse.json(deletedComment, { status: 200 });
        }
        else {
            return NextResponse.json({error: "You do not have permission to delete"}, { status: 400 })
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}