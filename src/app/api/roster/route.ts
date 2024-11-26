import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

async function isAdmin(requestUser: string) {
    const user = await prisma.user.findUnique({
        where: { email: requestUser },
    });
    return user?.role === "admin";
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const requestUser = req.headers.get("requestUser");

        if (!requestUser) {
            return NextResponse.json({ error: "User is required" }, { status: 400 });
        }

        if (!(await isAdmin(requestUser))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if(body.action === "create") {
            const player = await prisma.roster.create({
                data: {
                    backnumber: body.backnumber,
                    profileimage: body.profileimage,
                    name: body.name,
                    position: body.position,
                    birthdate: body.birthdate,
                    injury: body.injury,
                    injuredpart: body.injuredpart,
                    recoveryperiod: body.recoveryperiod
                }
            });
            return NextResponse.json(player, { status: 200 });
        }  else {
            return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
        }

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create player"}, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const backnumber = searchParams.get("backnumber");

        if (backnumber) {
            const player = await prisma.roster.findUnique({
                where: { backnumber: Number(backnumber)}
            });

            if (!player) {
                return NextResponse.json({ error: "Player not found" }, { status: 404 });
            }

            return NextResponse.json(player, { status: 200 });
        } else {
            const players = await prisma.roster.findMany({
                orderBy: { backnumber: "desc" }
            })

            return NextResponse.json(players, { status: 200 });
        }

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to retrieve player(s)"}, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update player"}, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to delete player"}, { status: 500 });
    }
}