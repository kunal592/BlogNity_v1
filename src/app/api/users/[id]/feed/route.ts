import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await db.user.findUnique({
      where: { id: params.id },
      include: {
        followingUsers: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const followedUserIds = user.followingUsers.map((user) => user.id);

    const feedPosts = await db.post.findMany({
      where: {
        authorId: {
          in: followedUserIds,
        },
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
    console.error("[USERS_ID_FEED_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}