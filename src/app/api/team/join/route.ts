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


export async function PUT(req: Request) {
  const body = await req.json();
  const { requestId, action } = body; // requestId: 팀 가입 요청 ID, action: "approve" 또는 "reject"
  const requestUser = req.headers.get("requestUser"); // 관리자의 ID

  if (!requestUser || !requestId || !action) {
    return NextResponse.json({ error: "Request ID, action and User ID are required" }, { status: 400 });
  }

  if (!(await isAdmin(requestUser))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    // 요청을 찾음
    const request = await prisma.teamJoinRequest.findUnique({
      where: { id: requestId },
      include: { team: true, user: true }, // 요청에 관련된 팀과 유저 정보도 포함
    });

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (request.status !== "pending") {
      return NextResponse.json({ error: "Request is already processed" }, { status: 400 });
    }

    if (action === "approve") {
      // 요청 승인 시, TeamUser에 추가
      await prisma.teamUser.create({
        data: {
          userId: request.userId,
          teamId: request.teamId,
          role: "member", // 기본적인 역할은 member
        },
      });

      // 요청 상태를 승인으로 변경
      await prisma.teamJoinRequest.update({
        where: { id: requestId },
        data: { status: "approved" },
      });
    } else if (action === "reject") {
      // 요청 거부 시, 상태를 거부로 변경
      await prisma.teamJoinRequest.update({
        where: { id: requestId },
        data: { status: "rejected" },
      });
    }

    return NextResponse.json({ message: `Request ${action}d successfully.` });
  } catch (error) {
    console.error("Error processing request", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}