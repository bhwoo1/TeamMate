import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

async function isAdmin(requestUser: string) {
    const user = await prisma.teamUser.findUnique({
        where: { userId: requestUser },
    });
    return user?.role === "admin";
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const requestUser = req.headers.get("requestUser");
        const teamID = req.headers.get("teamID"); // teamID 가져오기

        if (!requestUser || !teamID) {
            return NextResponse.json({ error: "User and Team ID are required" }, { status: 400 });
        }

        // 이메일로 유저 ID 찾기
        const user = await prisma.user.findUnique({
            where: { email: requestUser },
            select: { id: true }, // userId만 가져오기
        });

        if (!user) {
            return NextResponse.json({ error: "User is not found" }, { status: 400 });
        }

        if (body.isNotice === true) {
            // 관리자가 아니면 권한 거부
            if (!(await isAdmin(user.id))) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }
        }

        // 게시글 생성
        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                isNotice: body.isNotice,
                posteduser: body.posteduser,
                teamId: parseInt(teamID),
            },
        });

        return NextResponse.json(post, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create notice" }, { status: 500 });
    }
}