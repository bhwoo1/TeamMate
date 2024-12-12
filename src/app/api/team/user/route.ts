import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const loginedUser = searchParams.get("loginedUser");
        const teamID = searchParams.get("teamID");

        // 유저 이메일과 팀 ID가 없을 경우
        if (!loginedUser || !teamID || loginedUser.trim() === "" || teamID.trim() === "") {
            console.error("User email or Team ID is missing");
            return NextResponse.json({ error: "User email and Team ID are required" }, { status: 400 });
        }

        // 이메일로 유저 ID 찾기
        const user = await prisma.user.findUnique({
            where: { email: loginedUser },
            select: { id: true }, // userId만 가져오기
        });

        if (!user) {
            return NextResponse.json({ error: "User is not found" }, { status: 400 });
        }

        // 유저가 팀에 속해있는지, 그리고 해당 팀에서의 역할을 찾기
        const teamUser = await prisma.teamUser.findFirst({
            where: {
                userId: user.id, // 유저 ID
                teamId: Number(teamID),  // 팀 ID
            },
            select: { role: true }, // 유저의 역할만 선택
        });

        if (!teamUser) {
            return NextResponse.json({ message: "User is not part of the team", status: "not_a_member" }, { status: 200 });
        }

        return NextResponse.json({ role: teamUser.role }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to retrieve user role" }, { status: 500 });
    }
}