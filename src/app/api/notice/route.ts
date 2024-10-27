import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (body.action === "create") {
            const notice = await prisma.notice.create({
                data: { title: body.title, content: body.content, postedadmin: body.postedadmin },
            });
            return NextResponse.json(notice, { status: 200 });
        }  else {
            return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            // id가 존재하면 해당 id로 특정 게시글 조회
            const notice = await prisma.notice.findUnique({
                where: { id: Number(id) },
            });

            if (!notice) {
                return NextResponse.json({ error: "Post not found" }, { status: 404 });
            }

            return NextResponse.json(notice, { status: 200 });
        } else {
            // id가 없으면 모든 게시글을 조회
            const notices = await prisma.notice.findMany({
                orderBy: { createdAt: "desc" },
            });

            return NextResponse.json(notices, { status: 200 });
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to retrieve post(s)" }, { status: 500 });
    }
}


export async function DELETE(req: Request) {
    try{
        const body = await req.json();
        if (prisma.notice.fields.postedadmin === body.requestuser) {
            const deletedNotice = await prisma.notice.delete({
                where: {id: body.id}
            });
            return NextResponse.json(deletedNotice, { status: 200 });
        }
        else {
            return NextResponse.json({error: "You do not have permission to delete"}, { status: 400 })
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}
