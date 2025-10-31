'''import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query) {
            return new NextResponse("Query parameter is required", { status: 400 });
        }

        const posts = await db.post.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        content: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
                isPublished: true,
            },
            include: {
                author: true,
            },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("[SEARCH_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
'''