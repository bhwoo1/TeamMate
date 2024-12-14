import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const requestUser = req.headers.get("requestUser");

        if (!body || Object.keys(body).length === 0) {
            console.error("Request body is empty:", body);
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        if (!requestUser || requestUser.trim() === "") {
            console.error("User email is missing");
            return NextResponse.json({ error: "User email is required" }, { status: 400 });
        }

        if (!body.teamName || !body.description || !body.location || !body.teamLogo) {
            console.error("Missing required fields in body:", body);
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: requestUser },
        });

        if (!user) {
            return NextResponse.json({ error: "User is not found" }, { status: 400 });
        }

        const newTeam = await prisma.team.create({
            data: {
                teamName: body.teamName,
                teamLogo: body.teamLogo,
                location: body.location,
                description: body.description,
            },
        });

        console.log("New team created:", newTeam);

        // 데이터 유효성 검사
        if (!user.id || !newTeam.id) {
            console.error("Invalid data for teamUser creation:", {
                userId: user?.id,
                teamId: newTeam?.id,
            });
            return NextResponse.json({ error: "Invalid teamUser data" }, { status: 400 });
        }

        try {
            const teamUserData = {
                userId: String(user.id),
                teamId: Number(newTeam.id),
                role: "admin",
            };
            
            console.log("TeamUser Data:", teamUserData);
            
            // teamUser 생성
            await prisma.teamUser.create({
                data: teamUserData,
            });
        } catch (teamUserError) {
            console.error("Error creating teamUser:", teamUserError);
            return NextResponse.json({ error: "Failed to create teamUser" }, { status: 500 });
        }

        return NextResponse.json(newTeam, { status: 200 });
    } catch (err) {
        console.error("Error creating team or assigning admin:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}