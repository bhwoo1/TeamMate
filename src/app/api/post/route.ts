import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (body.action === "create") {
            const post = await prisma.post.create({
                data: { title: body.title, content: body.content, posteduser: body.posteduser },
            });
            return NextResponse.json(post, { status: 200 });
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
            const post = await prisma.post.findUnique({
                where: { id: Number(id) },
            });

            if (!post) {
                return NextResponse.json({ error: "Post not found" }, { status: 404 });
            }

            return NextResponse.json(post, { status: 200 });
        } else {
            // id가 없으면 모든 게시글을 조회
            const posts = await prisma.post.findMany({
                orderBy: { createdAt: "desc" },
            });

            return NextResponse.json(posts, { status: 200 });
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to retrieve post(s)" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try{
        const body = await req.json();
        if (prisma.post.fields.posteduser === body.requestuser) {
            const deletedPost = await prisma.post.delete({
                where: {id: body.id}
            });
            return NextResponse.json(deletedPost, { status: 200 });
        }
        else {
            return NextResponse.json({error: "You do not have permission to delete"}, { status: 400 })
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}