
'use server';

import { PrismaClient, EntityType, ContactMessage } from '@prisma/client';
import type { Post, User } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// --- USER API ---
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
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        include: { author: true }, 
      },
      bookmarks: {
        orderBy: { createdAt: 'desc' },
        include: {
          post: {
            include: {
              author: true,
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
    posts: user.posts,
    bookmarkedPosts: user.bookmarks.map(b => b.post),
    followingUsers: user.sentFollows.map(f => f.following)
  };
};

export const getUser = async (userId: string): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id: userId }});
};

export const getUsers = async (): Promise<User[]> => {
  return prisma.user.findMany();
};


// --- POST API ---
export const getPosts = async (options?: { isExclusive?: boolean }): Promise<any[]> => {
    return prisma.post.findMany({
      where: { 
        status: 'PUBLISHED',
        isExclusive: options?.isExclusive
      },
      include: {
        author: true,
        tags: { include: { tag: true } },
      },
      orderBy: { publishedAt: 'desc' },
    });
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
        },
    });

    if (post) {
        await prisma.post.update({
            where: { slug },
            data: { viewsCount: { increment: 1 } },
        });
    }

    return post;
};

export const getPostsByAuthor = async (authorId: string): Promise<Post[]> => {
    return prisma.post.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
      },
    });
};

const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
};

export const createPost = async (postData: { title: string; content: string; status: 'DRAFT' | 'PUBLISHED', visibility: 'PUBLIC' | 'PRIVATE', isExclusive: boolean, tags?: string[] }, authorId: string): Promise<Post> => {
    const { title, content, status, visibility, isExclusive, tags = [] } = postData;
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
            isExclusive,
            authorId,
            publishedAt: status === 'PUBLISHED' ? new Date() : null,
        }
    });

    if (tags && tags.length > 0) {
        const tagOperations = tags.map(async (tagName) => {
            const formattedTagName = tagName.trim().toLowerCase();
            const tagSlug = generateSlug(formattedTagName);
            const tag = await prisma.tag.upsert({
                where: { slug: tagSlug },
                update: {},
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
    const { title, content, status, visibility, isExclusive } = updateData;
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
            isExclusive,
            updatedAt: new Date(),
            publishedAt: (await prisma.post.findUnique({where: {id: postId}}))?.status !== 'PUBLISHED' && status === 'PUBLISHED' ? new Date() : undefined,
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
      notifications.map(async (notification) => {
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
      return { liked: false, likesCount: updatedPost.likesCount };
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
      return { liked: true, likesCount: updatedPost.likesCount };
    }
  };
  
  export const toggleBookmark = async (postId: string, userId: string) => {
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  
    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return { bookmarked: false };
    } else {
      await prisma.bookmark.create({
        data: {
          userId,
          postId,
        },
      });
      return { bookmarked: true };
    }
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

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.example.com',
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER || 'user@example.com',
                pass: process.env.EMAIL_PASS || 'password',
            },
        });

        await transporter.sendMail({
            from: `"${formData.name}" <${formData.email}>`,
            to: process.env.CONTACT_EMAIL || 'contact@example.com',
            subject: 'New Contact Form Message',
            text: formData.message,
            html: `<p>${formData.message}</p>`,
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
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