import { prisma } from "@/app/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const teamID = url.searchParams.get("teamID");
    const postID = url.searchParams.get("postID");

    if (!teamID) {
        return NextResponse.json({ error: "Team ID is required" }, { status: 400 });
    }

    try {
        if (postID) {
            // postID가 존재하면 해당 postID와 teamID에 해당하는 특정 게시글 조회
            const post = await prisma.post.findFirst({
                where: {
                    id: Number(postID),
                    teamId: Number(teamID), // 팀 ID로 필터링
                },
                include: {
                    comments: true, // comments 관계를 포함하여 조회
                },
            });

            if (!post) {
                return NextResponse.json({ error: "Post not found or does not belong to the specified team" }, { status: 404 });
            }

            return NextResponse.json(post, { status: 200 });
        } else {
            // postID가 없으면 해당 teamID에 속한 모든 게시글 조회
            const posts = await prisma.post.findMany({
                where: {
                    teamId: Number(teamID), // teamID로 필터링
                },
            });

            return NextResponse.json(posts, { status: 200 });
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to retrieve post(s)" }, { status: 500 });
    }
}