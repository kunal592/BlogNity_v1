import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { postId, content } = await req.json();
    if (!postId || !content) {
      return new NextResponse("Missing postId or content", { status: 400 });
    }

    const comment = await db.comment.create({
      data: {
        content,
        postId,
        authorId: session.user.id,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("[COMMENT_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
