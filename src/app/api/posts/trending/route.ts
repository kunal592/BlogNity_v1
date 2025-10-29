import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const posts = await db.post.findMany({
      include: {
        author: true,
        _count: {
            select: { likes: true, comments: true },
        }
      },
      orderBy: {
        likes: {
            _count: 'desc'
        }
      },
      take: 10, // Limit to top 10 trending posts
    });

    const trendingPosts = posts.map(post => ({
        ...post,
        likesCount: post._count.likes,
        commentsCount: post._count.comments,
    }))

    return NextResponse.json(trendingPosts);
  } catch (error) {
    console.error("[POSTS_TRENDING_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
