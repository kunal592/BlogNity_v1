import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await db.post.findUnique({
      where: { id: params.id },
      include: { author: true },
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("[POST_ID_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, content, status, visibility } = await req.json();

    const post = await db.post.findUnique({
        where: { id: params.id },
    });

    if (!post) {
        return new NextResponse("Post not found", { status: 404 });
    }

    if (post.authorId !== session.user.id) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedPost = await db.post.update({
      where: { id: params.id },
      data: {
        title,
        content,
        status,
        visibility,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("[POST_ID_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const post = await db.post.findUnique({
        where: { id: params.id },
    });

    if (!post) {
        return new NextResponse("Post not found", { status: 404 });
    }

    if (post.authorId !== session.user.id) {
        return new NextResponse("Forbidden", { status: 403 });
    }


    await db.post.delete({ where: { id: params.id } });

    return new NextResponse("Post deleted", { status: 200 });
  } catch (error) {
    console.error("[POST_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
