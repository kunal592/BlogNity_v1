import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
      return NextResponse.json({ liked: true, likesCount: updatedPost.likesCount });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
