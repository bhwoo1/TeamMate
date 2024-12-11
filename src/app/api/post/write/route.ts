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
        const { title, content, isNotice, postedUser } = await req.json();
        const requestUser = req.headers.get("requestUser");
        const teamID = req.headers.get("teamID");

        if (!title || !content || !postedUser || !requestUser || !teamID) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!requestUser || !teamID) {
            return NextResponse.json({ error: "User and Team ID are required" }, { status: 400 });
        }

        console.log(title, content, isNotice, postedUser)
        console.log(requestUser)
        console.log(teamID)

        // 이메일로 유저 ID 찾기
        const user = await prisma.user.findUnique({
            where: { email: requestUser },
            select: { id: true }, // userId만 가져오기
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }

        // 관리자인지 체크
        if (isNotice && !(await isAdmin(user.id))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // 게시글 생성
        const post = await prisma.post.create({
            data: {
                title: title,
                content: content,
                isNotice: isNotice,
                posteduser: postedUser,
                teamId: Number(teamID),
            },
        });

        return NextResponse.json(post, { status: 200 });

    } catch (err) {
        console.error("Error occurred:", err);

        // err가 객체가 아닐 경우, 기본 값을 처리하도록 함
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}