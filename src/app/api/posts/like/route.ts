import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, NotificationType } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { postId, userId } = await req.json();

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
    });
      return NextResponse.json({ liked: false, likesCount: updatedPost.likesCount });
    } else {
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
    });

    // Create notification only when a new like is created
    if (userId !== post.authorId) { // Prevent users from getting notifications for their own actions
        await prisma.notification.create({
          data: {
            type: NotificationType.LIKE,
            actorId: userId,
            recipientId: post.authorId,
            entityId: postId,
            entityType: 'POST',
          },
        });
      }

      return NextResponse.json({ liked: true, likesCount: updatedPost.likesCount });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
