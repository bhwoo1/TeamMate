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
  try {
    // 요청 본문 파싱
    const body = await req.json();
    const RequestUser = req.headers.get("RequestUser"); // 요청 헤더에서 유저 이메일 가져오기
    const RequestUsername = req.headers.get("RequestUsername");
    const { teamID } = body;

    // 값 확인용 로그
    console.log("RequestUser:", RequestUser);
    console.log("RequestUsername:", RequestUsername);
    console.log("Request body:", body);

    // 필수 값 검증
    if (!RequestUser || !teamID || !RequestUsername) {
      return NextResponse.json(
        { error: "User email, Team ID, and Username are required" },
        { status: 400 }
      );
    }

    // 이메일로 유저 검색
    const user = await prisma.user.findUnique({
      where: { email: RequestUser },
      select: { id: true }, // 유저 ID만 가져옴
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const userId = user.id; // 검색된 유저의 ID
    console.log("Found userId:", userId);

    // 팀 ID 확인 (팀이 실제로 존재하는지 확인)
    const team = await prisma.team.findUnique({
      where: { id: Number(teamID) },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 400 });
    }

    // 중복 요청 확인: 동일한 유저와 팀에 대해 'pending' 상태의 요청이 이미 있는지 확인
    const existingRequest = await prisma.teamJoinRequest.findFirst({
      where: {
        userId: userId,
        teamId: Number(teamID),
        status: "pending", // 대기 중인 요청만 확인
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { message: "You have already submitted a join request for this team." },
        { status: 200 }
      );
    }

    // 팀 가입 요청 기록 생성
    const joinRequest = await prisma.teamJoinRequest.create({
      data: {
        userId: userId,
        username: RequestUsername,
        teamId: Number(teamID),
        status: "pending", // 기본 상태
      },
    });

    console.log("Join request created:", joinRequest);

    return NextResponse.json({
      joinRequest,
    });
  } catch (error) {
    console.error("Error submitting join request:", error);
    return NextResponse.json(
      { error: "Failed to submit join request" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const teamID = url.searchParams.get("teamID");
    const RequestUser = url.searchParams.get("RequestUser");
  
    if (!RequestUser || !teamID) {
      return NextResponse.json({ error: "Request User and Team ID are required" }, { status: 400 });
    }

    // 이메일로 유저 ID 찾기
    const user = await prisma.user.findUnique({
      where: { email: RequestUser },
      select: { id: true }, // userId만 가져오기
  });

  if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

    if (!(await isAdmin(user.id))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  
    try {
      // 팀 가입 요청 상태 조회
      const joinRequests = await prisma.teamJoinRequest.findMany({
        where: {
          teamId: Number(teamID)
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