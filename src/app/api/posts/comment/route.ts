import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { postId, content } = await req.json();
        const authorId = session.user.id;

        if (!postId || !content) {
            return new NextResponse("Post ID and content are required", { status: 400 });
        }

        const comment = await db.comment.create({
            data: {
                content,
                postId,
                authorId,
            },
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error("[COMMENT_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
