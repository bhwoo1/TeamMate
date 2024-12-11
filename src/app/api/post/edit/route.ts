import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const requestUser = req.headers.get("requestUser");
        const postID = Number(req.headers.get("postID"));
        const teamID = Number(req.headers.get("teamID"));

        // 요청 데이터 검증
        if (!requestUser) {
            return NextResponse.json({ error: "User is required" }, { status: 400 });
        }
        if (!postID || !teamID) {
            return NextResponse.json({ error: "Post ID and Team ID are required" }, { status: 400 });
        }
        if (!body.title || !body.content) {
            return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
        }

        // 해당 게시글 조회
        const post = await prisma.post.findFirst({
            where: {
                id: postID,
                teamId: teamID,
            },
        });

        // 게시글이 존재하지 않는 경우
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // 작성자 또는 관리자 권한 확인
        if (post.posteduser !== requestUser) {
            return NextResponse.json({ error: "You do not have permission to update this post" }, { status: 403 });
        }

        // 게시글 업데이트
        const updatedPost = await prisma.post.update({
            where: { id: postID },
            data: {
                title: body.title,
                content: body.content,
                isNotice: body.isNotice || false, // 공지 여부 업데이트
            },
        });

        return NextResponse.json(updatedPost, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}