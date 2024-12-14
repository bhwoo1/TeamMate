import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const teamID = url.searchParams.get("teamID"); // 쿼리 파라미터에서 teamID 가져오기

  if (!teamID) {
    return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const backnumber = searchParams.get("backnumber");

    if (backnumber) {
      const player = await prisma.squad.findUnique({
        where: { backnumber: Number(backnumber), teamId: Number(teamID) },
      });

      if (!player) {
        return NextResponse.json(
          { error: "Player not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(player, { status: 200 });
    } else {
      const players = await prisma.squad.findMany({
        where: {
          teamId: Number(teamID), // teamID 필터링 추가
        },
        orderBy: { backnumber: "desc" },
      });

      return NextResponse.json(players, { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to retrieve player(s)" },
      { status: 500 }
    );
  }
}