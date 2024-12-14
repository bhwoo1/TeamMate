import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

// 관리자 확인 함수
async function isAdmin(requestUser: string) {
    const user = await prisma.teamUser.findUnique({
        where: { userId: requestUser },
    });
    return user?.role === "admin";
}

export async function PUT(req: Request) {
    try{
        const body = await req.json();
        const RequestUser = req.headers.get("RequestUser");
        const teamID = req.headers.get("teamID");

        if (!RequestUser || !teamID) {
            return NextResponse.json({ error: "User and team id are required"}, { status: 400 });
        }
        if (!body) {
            return NextResponse.json({ error: "Data is required" }, { status: 400 });
        }

        // 이메일로 유저 ID 찾기
        const user = await prisma.user.findUnique({
            where: { email: RequestUser },
            select: { id: true }, // userId 가져오기
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }

        if (!(await isAdmin(user.id))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const newSchedule = await prisma.schedule.update({
            where: { id: body.scheduleID, teamId: Number(teamID)},
            data: {
                date: body.date,
                task: body.task,
                location: body.location,
                completed: body.completed
            }
        });

        return NextResponse.json(newSchedule, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update schedule"}, { status: 500 })
    }
}