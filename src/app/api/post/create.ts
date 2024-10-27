import prisma from "@/app/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { title, content, posteduser } = req.body;

        try {
            const post = await prisma.post.create({
                data: { title, content, posteduser },
            });
            res.status(200).json(post);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({err: "Failed to create post"});
        }
    }
    else {
        res.status(405).end();
    }
}