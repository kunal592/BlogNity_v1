import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const posts = await db.post.findMany({
      where: {
        visibility: "PRIVATE",
      },
      include: {
        author: true,
        tags: { 
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("[POSTS_EXCLUSIVE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
