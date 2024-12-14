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
        const backnumber = parseInt(searchParams.get("backnumber") || "");

        const requestUser = req.headers.get("requestUser");
        const teamID = req.headers.get("teamID");

        console.log(backnumber);

        // 필수 정보가 없으면 오류 반환
        if (!requestUser || !teamID) {
            return NextResponse.json({ error: "User and team are required" }, { status: 400 });
        }

        if (!backnumber) {
            return NextResponse.json({ error: "Backnumber is required" }, { status: 400 });
        }

        // 해당 포스트를 조회하여 posteduser 및 teamId 가져오기
        const player = await prisma.squad.findUnique({
            where: { backnumber: backnumber },
        });

        // 포스트가 존재하지 않는 경우
        if (!player) {
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

        if (await isAdmin(user.id)) {

            // 게시글 삭제
            const deletedPost = await prisma.squad.delete({
                where: { backnumber: backnumber, teamId: Number(teamID) },
            });

            return NextResponse.json(deletedPost, { status: 200 });
        } else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
        }

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}