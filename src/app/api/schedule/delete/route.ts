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
    const { searchParams } = new URL(req.url);
    const scheduleID = parseInt(searchParams.get("scheduleID") || "");
    const RequestUser = req.headers.get("ReqeustUser");
    const teamID = req.headers.get("teamID");

    if (!RequestUser || !teamID) {
        return NextResponse.json({error: "User and team are required"}, {status: 400});
    }

    if (!scheduleID) {
        return NextResponse.json({error: "Content is required"}, {status: 400});
    }

    try {

        const user = await prisma.user.findUnique({
            where: { email: RequestUser},
            select: {id: true},
        });

        if (!user) {
            return NextResponse.json({error: "User not found."}, { status: 400});
        }

        if (await isAdmin(user.id)) {
            const deletedSchedule = await prisma.schedule.delete({
               where: {id: scheduleID, teamId: Number(teamID)}
            });

            return NextResponse.json(deletedSchedule, {status: 200});

        } else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
        }

    } catch(error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete schedule" }, { status: 500 });
    }
} 