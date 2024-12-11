import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
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



        if (post.posteduser === requestUsername) {
            const updatedComment = await prisma.comment.update({
                where: { id: body.commentId },
                data: { content: body.content }
            });
            return NextResponse.json(updatedComment, { status: 200 });
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update notice" }, { status: 500 });
    }
}
