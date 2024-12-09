import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const requestUser = req.headers.get("requestUser");

        if (!requestUser) {
            return NextResponse.json({ error: "User is required" }, { status: 400 }); 
        }

        const newTeam = await prisma.team.create({
            data: {
                teamName: body.teamName,
                teamLogo: body.teamLogo,
                location: body.location,
                description: body.description
            }
        });

        await prisma.teamUser.create({
            data: {
                userId: requestUser, // userId와 teamId 필드 확인
                teamId: newTeam.id,   // teamId 확인
                role: "admin",         // role 설정
            },
        });

        return NextResponse.json(newTeam, { status: 200 });
    } catch (err) {
        console.error("Error creating team or assigning admin:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}