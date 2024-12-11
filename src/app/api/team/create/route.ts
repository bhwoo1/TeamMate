import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const requestUser = req.headers.get("requestUser");

        // 요청 본문이 비어있는지 확인
        if (!body || Object.keys(body).length === 0) {
            console.error("Request body is empty:", body);
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        // 유저 이메일이 없을 경우
        if (!requestUser || requestUser.trim() === "") {
            console.error("User email is missing");
            return NextResponse.json({ error: "User email is required" }, { status: 400 });
        }

        // 요청 본문에 필수 값들이 있는지 확인
        if (!body.teamName || !body.description || !body.location || !body.teamLogo) {
            console.error("Missing required fields in body:", body);
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 이메일로 실제 유저를 찾기
        const user = await prisma.user.findUnique({
            where: { email: requestUser },
        });

        if (!user) {
            return NextResponse.json({ error: "User is not found" }, { status: 400 });
        }

        // 새로운 팀 생성
        const newTeam = await prisma.team.create({
            data: {
                teamName: body.teamName,
                teamLogo: body.teamLogo,
                location: body.location,
                description: body.description,
            },
        });

        console.log("New team created:", newTeam);

        // 유저의 id를 기준으로 teamUser 등록
        await prisma.teamUser.create({
            data: {
                userId: user.id,  // 이메일 대신 유저 id 사용
                teamId: newTeam.id,
                role: "admin",  // 관리자 역할
            },
        });

        return NextResponse.json(newTeam, { status: 200 });
    } catch (err) {
        console.error("Error creating team or assigning admin:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}