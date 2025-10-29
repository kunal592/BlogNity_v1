import { Prisma } from '@prisma/client';

// Manually define the Post type with all the expected relations
export type Post = Prisma.PostGetPayload<{
  include: {
    author: true,
    comments: {
      include: {
        author: true
      }
    },
    likedBy: true,
  }
}> & { tags: string[] }; // Ensure tags is always an array of strings

// Manually define the User type with all the expected relations
export type User = Prisma.UserGetPayload<{
  include: {
    posts: true,
    comments: true,
    likedPosts: true,
    followers: true,
    following: true,
    notifications: true,
    sentNotifications: true,
    bookmarkedPosts: true,
  }
}>;
