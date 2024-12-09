import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

async function isAdmin(requestUser: string) {
    const user = await prisma.teamUser.findUnique({
        where: { userId: requestUser },
    });
    return user?.role === "admin";
}

export async function POST(req: Request) {
    const body = await req.json();
    const userId = req.headers.get("userId"); // 요청 헤더에서 유저 ID를 가져옴
    const { teamId } = body;
  
    if (!userId || !teamId) {
      return NextResponse.json({ error: "User ID and Team ID are required" }, { status: 400 });
    }
  
    try {
      // 팀 가입 요청 기록
      await prisma.teamJoinRequest.create({
        data: {
          userId,
          teamId,
          status: "pending", // 기본 상태는 pending
        },
      });
  
      return NextResponse.json({ message: "Join request submitted successfully." });
    } catch (error) {
      console.error("Error submitting join request", error);
      return NextResponse.json({ error: "Failed to submit join request" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const body = await req.json();
    const requestUser = req.headers.get("requestUser");
  
    if (!requestUser) {
      return NextResponse.json({ error: "Request User is required" }, { status: 400 });
    }

    if (!(await isAdmin(requestUser))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  
    try {
      // 유저의 팀 가입 요청 상태 조회
      const joinRequests = await prisma.teamJoinRequest.findMany({
        where: {
          teamId: body.teamId
        },
        include: { team: true }, // 팀 정보 포함
      });
  
      return NextResponse.json(joinRequests);
    } catch (error) {
      console.error("Error fetching join requests", error);
      return NextResponse.json({ error: "Failed to fetch join requests" }, { status: 500 });
    }
}