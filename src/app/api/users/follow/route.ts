import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NotificationType } from '@prisma/client';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { followingId } = await req.json();
        const followerId = session.user.id;

        if (!followingId) {
            return new NextResponse("Following ID is required", { status: 400 });
        }

        const existingFollow = await db.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });

        if (existingFollow) {
            await db.follow.delete({
                where: {
                    id: existingFollow.id,
                },
            });
            return NextResponse.json({ message: "Unfollowed" });
        } else {
            await db.follow.create({
                data: {
                    followerId,
                    followingId,
                },
            });

            await db.notification.create({
                data: {
                    type: NotificationType.FOLLOW,
                    actorId: followerId,
                    recipientId: followingId,
                },
            });

            return NextResponse.json({ message: "Followed" });
        }
    } catch (error) {
        console.error("[FOLLOW_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
