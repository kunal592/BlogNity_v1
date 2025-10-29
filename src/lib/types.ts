import { Post as PrismaPost, User as PrismaUser, Comment as PrismaComment } from '@prisma/client';

export interface Comment extends PrismaComment {
  author: PrismaUser;
}

export interface Post extends PrismaPost {
  author: PrismaUser;
  comments: Comment[];
  tags: { tag: { name: string } }[];
}

export interface User extends PrismaUser {}
