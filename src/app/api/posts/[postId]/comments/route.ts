import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const comments = await db.comment.findMany({
      where: {
        postId: params.postId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("[COMMENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
    req: Request,
    { params }: { params: { postId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { content } = await req.json();

        const post = await db.post.findUnique({
            where: { id: params.postId },
        });

        if (!post) {
            return new NextResponse("Post not found", { status: 404 });
        }

        const newComment = await db.comment.create({
            data: {
                content,
                postId: params.postId,
                authorId: session.user.id,
            },
        });

        return NextResponse.json(newComment);
    } catch (error) {
        console.error("[COMMENTS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
