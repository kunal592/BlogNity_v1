import type { LucideIcon } from "lucide-react";

export type User = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  following: number;
  role: 'USER' | 'ADMIN';
  followedBy: string[]; // user ids
  followingUsers: string[]; // user ids
  bookmarkedPosts: string[]; // post ids
  hasPaidAccess?: boolean;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  thumbnailUrl: string;
  authorId: string;
  tags: string[];
  likes: number;
  likedBy: string[]; // user ids
  comments: Comment[];
  publishedAt: string;
  status: 'published' | 'draft';
  views: number;
  isExclusive: boolean;
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
};

export type NotificationType = 'new_follower' | 'comment' | 'like' | 'mention';

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  fromUserId: string;
  postId?: string;
  read: boolean;
  createdAt: string;
};

export type NavItem = {
  href: string;
  title: string;
  icon: LucideIcon;
  label?: string;
};

export type TeamMember = {
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
};

export type DashboardStat = {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: LucideIcon;
};

export type ContactMessage = {
    id: string;
    name: string;
    email: string;
    message: string;
    status: 'pending' | 'resolved';
    createdAt: string;
}
