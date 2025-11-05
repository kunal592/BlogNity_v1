import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const post = await db.post.findUnique({
      where: {
        id: params.postId,
      },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        bookmarks: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    const likedBy = post.likes.map((like) => like.userId);
    const bookmarkedBy = post.bookmarks?.map((bookmark) => bookmark.userId) || [];
    const { likes, bookmarks, ...restOfPost } = post;
    
    const postWithLikes = {
        ...restOfPost,
        likedBy,
        bookmarkedBy,
    };


    return NextResponse.json(postWithLikes);
  } catch (error) {
    console.error("[POST_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
