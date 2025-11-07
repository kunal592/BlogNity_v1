
import { Post as PrismaPost, User as PrismaUser } from '@prisma/client';

export enum EntityType {
    POST = "POST",
    COMMENT = "COMMENT",
    USER = "USER",
}

export enum NotificationType {
    LIKE = "LIKE",
    COMMENT = "COMMENT",
    FOLLOW = "FOLLOW",
    MENTION = "MENTION",
    NEW_POST = "NEW_POST",
    BOOKMARK = "BOOKMARK",
    ADMIN_ALERT = "ADMIN_ALERT",
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export type Post = PrismaPost;
export type User = PrismaUser;

