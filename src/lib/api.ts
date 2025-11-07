'use server';

import { PrismaClient, EntityType, NotificationType, PostStatus, PostVisibility } from '@prisma/client';
import type { Post, User, ContactMessage } from '@prisma/client';
import nodemailer from 'nodemailer';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

// --- HELPERS ---
const transformPost = (post: any) => {
    const likedBy = post.likes.map((like: any) => like.userId);
    const bookmarkedBy = post.bookmarks?.map((bookmark: any) => bookmark.userId) || [];
    const { likes, bookmarks, ...restOfPost } = post;
    return {
        ...restOfPost,
        likedBy,
        bookmarkedBy,
    };
};


// --- USER API ---
export const getTopAuthors = async () => {
  const authors = await prisma.user.findMany({
    include: {
      _count: {
        select: { receivedFollows: true },
      },
    },
    orderBy: {
      receivedFollows: { _count: 'desc' },
    },
    take: 10,
  });
  return authors.map((author: any) => ({
    ...author,
    followersCount: author._count.receivedFollows,
  }));
};

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          posts: true,
          receivedFollows: true, // Followers
          sentFollows: true,     // Following
        },
      },
      posts: {
        where: { status: PostStatus.PUBLISHED },
        orderBy: { publishedAt: 'desc' },
        include: { 
          author: true,
          tags: {
            include: {
              tag: true,
            },
          },
        }, 
      },
      bookmarks: {
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            include: {
              author: true,
              tags: {
                include: {
                  tag: true,
                },
              },
            },
          },
        },
      },
      sentFollows: {
          include: {
              following: true, // The user they are following
          }
      }
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    image: user.image,
    bio: user.bio,
    postsCount: user._count.posts,
    followersCount: user._count.receivedFollows,
    followingCount: user._count.sentFollows,
    posts: user.posts || [],
    bookmarkedPosts: (user.bookmarks || []).map((b: any) => b.post),
    followingUsers: (user.sentFollows || []).map((f: any) => f.following)
  };
};

export const getUser = async (userId: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id: userId }});
};

export const getUsers = async (): Promise<User[]> => {
  return prisma.user.findMany();
};


// --- POST API ---
export const getPosts = async (): Promise<any[]> => {
    const posts = await prisma.post.findMany({
      where: { 
        status: PostStatus.PUBLISHED,
      },
      include: {
        author: true,
        tags: { include: { tag: true } },
        likes: { select: { userId: true } },
        bookmarks: { select: { userId: true } },
      },
      orderBy: { publishedAt: 'desc' },
    });

    return posts.map(transformPost);
  };

export const getPost = async (slug: string): Promise<any | null> => {
    const post = await prisma.post.findUnique({
        where: { slug },
        include: {
            author: true,
            tags: { include: { tag: true } },
            comments: {
                include: { author: true },
                where: { parentId: null },
                orderBy: { createdAt: 'desc' },
            },
            likes: { select: { userId: true } },
            bookmarks: { select: { userId: true } },
        },
    });

    if (post) {
        await prisma.post.update({
            where: { slug },
            data: { viewsCount: { increment: 1 } },
        });

        return transformPost(post);
    }

    return null;
};

export const searchPosts = async (query: string): Promise<any[]> => {
    const posts = await prisma.post.findMany({
        where: {
            status: PostStatus.PUBLISHED,
            OR: [
                {
                    title: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
                {
                    content: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
            ],
        },
        include: {
            author: true,
            tags: { include: { tag: true } },
            likes: { select: { userId: true } },
            bookmarks: { select: { userId: true } },
        },
        orderBy: { publishedAt: 'desc' },
    });

    return posts.map(transformPost);
};

export const getPostById = async (postId: string): Promise<any | null> => {
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            author: true,
            tags: { include: { tag: true } },
            comments: {
                include: { author: true },
                where: { parentId: null },
                orderBy: { createdAt: 'desc' },
            },
            likes: { select: { userId: true } },
            bookmarks: { select: { userId: true } },
        },
    });

    if (post) {
        return transformPost(post);
    }

    return null;
};

export const getPostsByAuthor = async (authorId: string) => {
    const posts = await prisma.post.findMany({
        where: { authorId },
        orderBy: { createdAt: 'desc' },
        include: {
            author: true,
        },
    });

    const stats = await prisma.post.aggregate({
        where: {
            authorId: authorId,
            status: PostStatus.PUBLISHED,
        },
        _sum: {
            viewsCount: true,
            likesCount: true,
            commentsCount: true,
        },
    });

    return {
        posts,
        totalViews: stats._sum.viewsCount || 0,
        totalLikes: stats._sum.likesCount || 0,
        totalComments: stats._sum.commentsCount || 0,
    };
};

const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
};

export const createPost = async (postData: { title: string; content: string; status: PostStatus, visibility: PostVisibility, tags?: string[] }, authorId: string): Promise<Post> => {
    const { title, content, status, visibility, tags = [] } = postData;
    let slug = generateSlug(title);

    const existingPost = await prisma.post.findUnique({ where: { slug }});
    if(existingPost) {
        slug = `${slug}-${Date.now()}`;
    }

    const post = await prisma.post.create({
        data: {
            title,
            content,
            slug,
            status,
            visibility,
            authorId,
            publishedAt: status === PostStatus.PUBLISHED ? new Date() : null,
        }
    });

    if (tags && tags.length > 0) {
        const tagOperations = (tags || []).map(async (tagName) => {
            const formattedTagName = tagName.trim().toLowerCase();
            const tagSlug = generateSlug(formattedTagName);
            const tag = await prisma.tag.upsert({
                where: { slug: tagSlug },
                update: { name: formattedTagName },
                create: { name: formattedTagName, slug: tagSlug },
            });

            await prisma.postTag.create({
                data: {
                    postId: post.id,
                    tagId: tag.id,
                },
            });
        });
        await Promise.all(tagOperations);
    }

    return post;
};

export const updatePost = async (postId: string, updateData: any): Promise<Post | undefined> => {
    const { title, content, status, visibility } = updateData;
    let slug = updateData.slug;
    if (title && !slug) {
        slug = generateSlug(title);
    }
    
    return prisma.post.update({
        where: { id: postId },
        data: {
            title,
            content,
            slug,
            status,
            visibility,
            updatedAt: new Date(),
            publishedAt: (await prisma.post.findUnique({where: {id: postId}}))?.status !== PostStatus.PUBLISHED && status === PostStatus.PUBLISHED ? new Date() : undefined,
        }
    });
};

export const deletePost = async (postId: string): Promise<{ success: boolean }> => {
    try {
      await prisma.post.delete({ where: { id: postId } });
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
};

// --- NOTIFICATION API ---
export const getNotifications = async (userId: string) => {
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
      include: {
        actor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  
    const notificationsWithPosts = await Promise.all(
      (notifications || []).map(async (notification: any) => {
        if (notification.entityType === EntityType.POST && notification.entityId) {
          const post = await prisma.post.findUnique({
            where: { id: notification.entityId },
            select: { slug: true },
          });
          return { ...notification, post };
        }
        return notification;
      })
    );
  
    return notificationsWithPosts;
  };

// --- INTERACTIONS ---
export const toggleLike = async (postId: string, userId: string) => {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Post not found');

    const existingLike = await prisma.like.findUnique({
        where: { userId_postId: { userId, postId } },
    });

    if (existingLike) {
        await prisma.$transaction([
            prisma.like.delete({ where: { userId_postId: { userId, postId } } }),
            prisma.post.update({ 
                where: { id: postId }, 
                data: { likesCount: { decrement: 1 } }
            })
        ]);
    } else {
        await prisma.$transaction([
            prisma.like.create({ data: { userId, postId } }),
            prisma.post.update({ 
                where: { id: postId }, 
                data: { likesCount: { increment: 1 } }
            })
        ]);
        if (post.authorId !== userId) {
            await prisma.notification.create({
                data: {
                    type: NotificationType.LIKE,
                    actorId: userId,
                    recipientId: post.authorId,
                    entityId: postId,
                    entityType: EntityType.POST,
                },
            });
        }
    }

    revalidatePath('/');
    revalidatePath(`/blog/${post.slug}`);
};
  
export const toggleBookmark = async (postId: string, userId: string) => {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error('Post not found');

    const existingBookmark = await prisma.bookmark.findUnique({
        where: { userId_postId: { userId, postId } },
    });

    if (existingBookmark) {
        await prisma.bookmark.delete({ where: { userId_postId: { userId, postId } } });
    } else {
        await prisma.bookmark.create({ data: { userId, postId } });
    }
    revalidatePath('/');
    revalidatePath(`/blog/${post.slug}`);
};

export const toggleFollow = async (followingId: string) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("Unauthorized");
    const followerId = session.user.id;

    if (followerId === followingId) {
        throw new Error("You cannot follow yourself.");
    }

    const existingFollow = await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId, followingId } },
    });

    if (existingFollow) {
        await prisma.follow.delete({ where: { followerId_followingId: { followerId, followingId } } });
    } else {
        await prisma.$transaction([
            prisma.follow.create({ data: { followerId, followingId } }),
            prisma.notification.create({
                data: {
                    type: NotificationType.FOLLOW,
                    actorId: followerId,
                    recipientId: followingId,
                },
            }),
        ]);
    }
    revalidatePath('/');
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
    return prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  };

export const sendContactMessage = async (formData: { name: string; email: string; message: string; }) => {
    try {
        await prisma.contactMessage.create({
            data: {
                name: formData.name,
                email: formData.email,
                message: formData.message,
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to save contact message:', error);
        return { success: false, message: 'Failed to save message.' };
    }
};

export const resolveContactMessage = async (id: string): Promise<{ success: boolean }> => {
    try {
        await prisma.contactMessage.update({
            where: { id },
            data: { status: 'resolved' },
        });
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
};