import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const requestUser = req.headers.get("requestUser");

    if (!requestUser) {
        return NextResponse.json({ error: "Request User is required" }, { status: 400 });
    }

    try {
        const myTeams = await prisma.teamUser.findMany({
            where: {
                userId: requestUser
            },
            include: {
                team: true
            }
        });

        // 팀 정보만 반환
        const teams = myTeams.map(teamUser => teamUser.team);

        return NextResponse.json(teams);

    } catch (error) {
        console.error("Error processing request", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
      }
}