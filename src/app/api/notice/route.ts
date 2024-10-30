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
        return NextResponse.json({ error: "Failed to create notice" }, { status: 500 });
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
                return NextResponse.json({ error: "Notice not found" }, { status: 404 });
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
        return NextResponse.json({ error: "Failed to retrieve notice(s)" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const requestUser = req.headers.get("requestUser");

        if (!requestUser) {
            return NextResponse.json({ error: "User is required" }, { status: 400 });
        }

        if (!(await isAdmin(requestUser))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const updatedNotice = await prisma.notice.update({
            where: { id: body.id },
            data: { title: body.title, content: body.content }
        });
        return NextResponse.json(updatedNotice, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update notice" }, { status: 500 });
    }
}


export async function DELETE(req: Request) {
    try{
        const body = await req.json();
        const requestUser = req.headers.get("requestUser");

        if (!requestUser) {
            return NextResponse.json({ error: "User is required" }, { status: 400 });
        }

        if (!(await isAdmin(requestUser))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // 요청 본문에서 ID 가져오기
        const noticeId = parseInt(body.id);

        // 게시글 존재 여부 확인
        const notice = await prisma.notice.findUnique({
            where: { id: noticeId }
        });

        if (!notice) {
            return NextResponse.json({ error: "Notice not found" }, { status: 404 });
        }


        // 게시글 삭제
        const deletedNotice = await prisma.notice.delete({
            where: { id: noticeId }
        });

        return NextResponse.json(deletedNotice, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Failed to delete notice" }, { status: 500 });
    }
}
