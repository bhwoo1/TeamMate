import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

// 관리자 확인 함수
async function isAdmin(requestUser: string) {
    const user = await prisma.teamUser.findUnique({
        where: { userId: requestUser },
    });
    return user?.role === "admin";
}

export async function POST(req: Request) {
    const body = await req.json();
    const RequestUser = req.headers.get("ReqeustUser");
    const teamID = req.headers.get("teamID");

    if (!RequestUser || !teamID) {
        return NextResponse.json({error: "User and team are required"}, {status: 400});
    }

    if (!body) {
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
            const newSchedule = await prisma.schedule.create({
                data: {
                    date: body.date,
                    task: body.task,
                    teamId: Number(teamID),
                    location: body.location,
                    completed: body.completed
                }
            });

            return NextResponse.json(newSchedule, {status: 200});

        } else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
        }

    } catch(error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
} 