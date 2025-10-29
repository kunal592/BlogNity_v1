import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const posts = await db.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("[POSTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, content, status, visibility, tags } = await req.json();

        const generateSlug = (title: string) => {
            return title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '');
        };
        const slug = generateSlug(title);

        const newPost = await db.post.create({
            data: {
                title,
                content,
                slug,
                status,
                visibility,
                authorId: session.user.id,
            },
        });

        return NextResponse.json(newPost);
    } catch (error) {
        console.error("[POSTS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
