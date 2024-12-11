import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { keyword } = body

    if (!keyword) {
        return NextResponse.json({ error: "Search keyword is required" }, { status: 400 });
      }

    try {
        const teams = await prisma.team.findMany({
            where: {
                teamName: {
                    contains: keyword,
                },
            }
        });
        console.log(teams);

        return NextResponse.json(teams);

        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to search" }, { status: 500 });
    }
}