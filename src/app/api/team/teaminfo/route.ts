import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const teamID = url.searchParams.get("teamID"); // 쿼리 파라미터에서 teamID 가져오기

    try {
        if (!teamID) {
            return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
        }

        const myTeam = await prisma.team.findUnique({
            where: {
                id: Number(teamID), // teamID를 숫자로 변환하여 사용
            },
        });

        if (!myTeam) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        return NextResponse.json(myTeam, { status: 200 });

    } catch (error) {
        console.error("Error processing request", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}