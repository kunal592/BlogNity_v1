import { Comment, Post, User } from '@prisma/client';

export type PostWithExtras = Post & {
    author: User;
    comments: Comment[];
    likedBy: string[];
    bookmarkedBy: string[];
};

export type Author = User & {
    followersCount: number;
};

export type { Comment };