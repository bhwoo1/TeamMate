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
    try {
        const { searchParams } = new URL(req.url); // URL에서 searchParams 가져오기
        const postId = parseInt(searchParams.get("postID") || "");

        const requestUser = req.headers.get("requestUser");
        const requestUsername = req.headers.get("requestUsername");
        const teamID = req.headers.get("teamID");

        // 필수 정보가 없으면 오류 반환
        if (!requestUser || !teamID) {
            return NextResponse.json({ error: "User and team are required" }, { status: 400 });
        }

        if (!postId) {
            return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
        }

        // 해당 포스트를 조회하여 posteduser 및 teamId 가져오기
        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: {
                posteduser: true,
                teamId: true, // 팀 ID 확인
            }
        });

        // 포스트가 존재하지 않는 경우
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // 이메일로 유저 ID 찾기
        const user = await prisma.user.findUnique({
            where: { email: requestUser },
            select: { id: true }, // userId만 가져오기
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }

        // 요청한 사용자가 관리자라면 모든 게시글 삭제 가능
        if (await isAdmin(user.id)) {
            // 댓글 삭제
            await prisma.comment.deleteMany({
                where: {
                    postid: postId,
                },
            });

            // 게시글 삭제
            const deletedPost = await prisma.post.delete({
                where: { id: postId },
            });

            return NextResponse.json(deletedPost, { status: 200 });
        }

        // 게시글 작성자가 요청한 사용자와 동일한지 확인
        if (post.posteduser === requestUsername) {
            // 댓글 삭제
            await prisma.comment.deleteMany({
                where: {
                    postid: postId,
                },
            });

            // 게시글 삭제
            const deletedPost = await prisma.post.delete({
                where: { id: postId },
            });

            return NextResponse.json(deletedPost, { status: 200 });
        } else {
            return NextResponse.json({ error: "You do not have permission to delete this post" }, { status: 403 });
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}