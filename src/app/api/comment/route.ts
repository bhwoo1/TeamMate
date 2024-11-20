import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST (req: Request) {
    try {
        const body = await req.json();

        if (body.action === "create") {
            const comment = await prisma.comment.create({
                data: { 
                    content: body.content, 
                    posteduser: body.posteduser,
                    postid: body.postid
                 },
            });
            return NextResponse.json(comment, { status: 200 });
        }  else {
            return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}

export async function GET () {
    try {
        const comments = await prisma.comment.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(comments, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to retrieve comment(s)" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const requestUser = req.headers.get("requestUser");

        if (!requestUser) {
            return NextResponse.json({ error: "User is required" }, { status: 400 });
        }

         // 해당 포스트를 조회하여 posteduser 가져오기
        const post = await prisma.post.findUnique({
            where: { id: body.id },
        });

        // 포스트가 존재하지 않는 경우
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const comment = await prisma.comment.findUnique({
            where: { id: body.commentId },  // 댓글 ID로 댓글 조회
        });

        // 댓글이 존재하지 않는 경우
        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }



        if (post.posteduser === requestUser) {
            const updatedComment = await prisma.comment.update({
                where: { id: body.commentId },
                data: { content: body.content }
            });
            return NextResponse.json(updatedComment, { status: 200 });
        }
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

        // 해당 포스트를 조회하여 posteduser 가져오기
        const post = await prisma.post.findUnique({
            where: { id: body.id },
        });

        // 포스트가 존재하지 않는 경우
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const comment = await prisma.comment.findUnique({
            where: { id: body.commentId },  // 댓글 ID로 댓글 조회
        });

        // 댓글이 존재하지 않는 경우
        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }


        if (post.posteduser === requestUser) {
            const deletedComment = await prisma.comment.delete({
                where: {id: body.commentId}
            });
            return NextResponse.json(deletedComment, { status: 200 });
        }
        else {
            return NextResponse.json({error: "You do not have permission to delete"}, { status: 400 })
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}

