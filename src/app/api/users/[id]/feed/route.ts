import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        sentFollows: { include: { following: true } },
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const followedUserIds = user.sentFollows.map((follow) => follow.followingId);

    const feedPosts = await db.post.findMany({
      where: {
        authorId: { in: followedUserIds },
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(feedPosts);
  } catch (error) {
    console.error("[FEED_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
