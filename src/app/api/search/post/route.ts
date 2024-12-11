import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const category = req.headers.get("category");
    const { keyword } = body

    if (!keyword) {
        return NextResponse.json({ error: "Search keyword is required" }, { status: 400 });
    }

    if(!category) {
        return NextResponse.json({ error: "Search category is required" }, { status: 400 });
    }

    try {

        if (category === 'tico') {
            const posts = await prisma.post.findMany({
                where: {
                    title: {
                        contains: keyword
                    },
                    content: {
                        contains: keyword
                    }
                }
            });

            return NextResponse.json(posts);
        }
        else if (category === 'title') {
            const posts = await prisma.post.findMany({
                where: {
                    content: {
                        contains: keyword
                    }
                }
            });

            return NextResponse.json(posts);
        }
        else {
            const posts = await prisma.post.findMany({
                where: {
                    posteduser: {
                        contains: keyword
                    }
                }
            });

            return NextResponse.json(posts);
        }

        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to search" }, { status: 500 });
    }
}