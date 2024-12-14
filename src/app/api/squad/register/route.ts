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
    const body = await req.json();
    const RequestUser = req.headers.get("RequestUser");
    const teamID = req.headers.get("teamID");

    if (!body) {
      console.error("Request body is empty:", body);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    if (!RequestUser || !teamID) {
      return NextResponse.json(
        { error: "Request User and Team ID are required" },
        { status: 400 }
      );
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


    const newPlayer = await prisma.squad.create({
        data: {
            backnumber: body.backnumber,
            profileimage: body.profileimage,
            name: body.name,
            position: body.position,
            birthdate: body.birthdate,
            injury: body.injury,
            injuredpart: body.injuredpart,
            recoveryperiod: body.recoveryperiod,
            teamId: Number(teamID)
        }
    });
    return NextResponse.json(newPlayer, { status: 200 });
  } catch (error) {
    console.error("Error fetching join requests", error);
    return NextResponse.json(
      { error: "Failed to fetch join requests" },
      { status: 500 }
    );
  }
}
