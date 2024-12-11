import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const RequestUser = req.headers.get("RequestUser");


    if (!RequestUser || !body.postID || !body.teamID) {
        return NextResponse.json({ error: "User, Post ID, and Team ID are required" }, { status: 400 });
    }

    if (!body || !body.content) {
        return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    try {
        // 이메일로 유저 찾기
        const user = await prisma.user.findUnique({
            where: { email: RequestUser },
            select: { name: true }, // username만 가져오기
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }

        // 댓글 생성
        const comment = await prisma.comment.create({
            data: {
                postid: parseInt(body.postID),
                teamId: parseInt(body.teamID),
                content: body.content,
                posteduser: body.postedusername, // 작성자의 이름 저장
            },
        });

        return NextResponse.json(comment, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}