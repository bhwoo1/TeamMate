import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const loginedUser = searchParams.get("loginedUser");


        if (loginedUser) {
            const user = await prisma.user.findUnique({
                where: { email: loginedUser},
                select: {role: true}
            });

            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            return NextResponse.json(user, { status: 200 });
        } else {
            return NextResponse.json({error: "Failed to find User"}, { status: 500 });
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to retrieve post(s)" }, { status: 500 });
    }
}