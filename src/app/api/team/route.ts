import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const requestUser = req.headers.get("requestUser");

    

    try {
        if (requestUser) {
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
    
            return NextResponse.json(teams, { status: 200 });
        } else {
            // 요청 유저가 없으면 모든 팀을 조회
            const teams = await prisma.post.findMany({
                orderBy: { createdAt: "desc" }
            });

            return NextResponse.json(teams, { status: 200 });
        }

    } catch (error) {
        console.error("Error processing request", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}