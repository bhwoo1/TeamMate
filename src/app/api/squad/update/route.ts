import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

// 관리자 확인 함수
async function isAdmin(requestUser: string) {
  const user = await prisma.teamUser.findUnique({
    where: { userId: requestUser },
  });
  return user?.role === "admin";
}

export async function PUT(req: Request) {
    try{
        const body = await req.json();
        const requestUser = req.headers.get("requestUser");
        const teamID = req.headers.get("teamID");
        const backnumber = req.headers.get("backnumber");

        // 요청 데이터 검증
        if (!requestUser) {
            return NextResponse.json({ error: "User is required" }, { status: 400 });
        }
        if (!teamID || !backnumber) {
            return NextResponse.json({ error: "Backnumber and Team ID are required" }, { status: 400 });
        }
        if(!body) {
            return NextResponse.json({ error: "Player data is required" }, { status: 400 });
        }

        // 이메일로 유저 ID 찾기
            const user = await prisma.user.findUnique({
              where: { email: requestUser },
              select: { id: true }, // userId만 가져오기
            });
        
            if (!user) {
              return NextResponse.json({ error: "User not found" }, { status: 400 });
            }
        
            if (!(await isAdmin(user.id))) {
              return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }

            const player = await prisma.squad.findUnique({
                where: { backnumber: Number(backnumber), teamId: Number(teamID) },
              });
        
              if (!player) {
                return NextResponse.json(
                  { error: "Player not found" },
                  { status: 404 }
                );
              }
              else {
                const updatedPlayer = await prisma.squad.update({
                    where: {backnumber: player.backnumber, teamId: Number(teamID)},
                    data: {
                        name: body.name,
                        backnumber: body.backnumber,
                        birthdate: body.birthdate,
                        position: body.position,
                        injury: body.injury,
                        injuredpart: body.injuredpart,
                        recoveryperiod: body.recoveryperiod
                    }
                })

                return NextResponse.json(updatedPlayer, { status: 200 });
              }


    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}