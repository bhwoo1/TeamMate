import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (body.action === "create") {
            const post = await prisma.notice.create({
                data: { title: body.title, content: body.content, postedadmin: body.postedadmin },
            });
            return NextResponse.json(post, { status: 200 });
        } else if (body.action === "findMany") {
            const posts = await prisma.notice.findMany({
                orderBy: { createdAt: "desc" },
            });
            return NextResponse.json(posts, { status: 200 });
        } else {
            return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}