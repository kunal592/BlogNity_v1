
import { v4 as uuidv4 } from 'uuid';
import { User, Post, Comment, Notification, TeamMember, ContactMessage } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getUserAvatar = (seed: number) => `https://picsum.photos/seed/avatar${seed}/100/100`;
const getPostThumbnail = (seed: number) => `https://picsum.photos/seed/post${seed}/600/400`;

export let mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    username: 'alexj',
    email: 'alex.johnson@example.com',
    avatarUrl: getUserAvatar(1),
    bio: 'Full-stack developer and tech blogger. Passionate about Next.js and serverless architecture.',
    followers: 1200,
    following: 150,
    role: 'USER',
    followedBy: ['2', '3'],
    followingUsers: ['2', '3', '4'],
    bookmarkedPosts: ['p2', 'p3'],
    hasPaidAccess: true,
  },
  {
    id: '2',
    name: 'Brenda Smith',
    username: 'brendas',
    email: 'brenda.smith@example.com',
    avatarUrl: getUserAvatar(2),
    bio: 'UX/UI designer creating beautiful and intuitive web experiences.',
    followers: 800,
    following: 200,
    role: 'ADMIN',
    followedBy: ['1'],
    followingUsers: ['1'],
    bookmarkedPosts: ['p1'],
    hasPaidAccess: true,
  },
  {
    id: '3',
    name: 'Charlie Brown',
    username: 'charlieb',
    email: 'charlie.brown@example.com',
    avatarUrl: getUserAvatar(3),
    bio: 'Data scientist and avid writer. Exploring the intersection of AI and creativity.',
    followers: 2500,
    following: 50,
    role: 'USER',
    followedBy: ['1'],
    followingUsers: ['1'],
    bookmarkedPosts: [],
    hasPaidAccess: false,
  },
  {
    id: '4',
    name: 'Diana Prince',
    username: 'dianap',
    email: 'diana.prince@example.com',
    avatarUrl: getUserAvatar(4),
    bio: 'Marketing guru and content strategist. Helping brands tell their story.',
    followers: 500,
    following: 300,
    role: 'USER',
    followedBy: [],
    followingUsers: ['1'],
    bookmarkedPosts: ['p1', 'p4'],
    hasPaidAccess: false,
  },
];

export let mockPosts: Post[] = [
  {
    id: 'p1',
    title: 'Getting Started with Next.js 14',
    content: '## Introduction\n\nNext.js 14 brings a new set of features that improve developer experience and application performance. In this post, we will explore the key changes and how to get started with a new project.\n\n### App Router\n\nThe App Router is now stable and the recommended way to build Next.js applications. It supports layouts, server components, and streaming UI.',
    excerpt: 'Next.js 14 brings a new set of features that improve developer experience and application performance. Explore the key changes...',
    thumbnailUrl: getPostThumbnail(1),
    authorId: '1',
    tags: ['Next.js', 'React', 'Web Dev'],
    likes: 150,
    likedBy: ['2', '4'],
    comments: [
      { id: 'c1', postId: 'p1', authorId: '2', content: 'Great overview, Alex!', createdAt: '2023-10-27T10:00:00Z' },
      { id: 'c2', postId: 'p1', authorId: '3', content: 'Looking forward to trying out the new features.', createdAt: '2023-10-27T11:30:00Z' },
    ],
    publishedAt: '2023-10-26T14:00:00Z',
    status: 'published',
    views: 5200,
    isExclusive: false,
  },
  {
    id: 'p2',
    title: 'The Principles of Good UX Design',
    content: '## User-Centricity\n\nGood UX design always puts the user first. Understanding user needs, behaviors, and motivations is crucial. This involves user research, personas, and usability testing.\n\n### Consistency\n\nConsistency in design elements, navigation, and terminology helps users learn and navigate the interface more easily.',
    excerpt: 'Good UX design always puts the user first. Understanding user needs, behaviors, and motivations is crucial for a successful product.',
    thumbnailUrl: getPostThumbnail(2),
    authorId: '2',
    tags: ['UX', 'Design', 'UI'],
    likes: 230,
    likedBy: ['1'],
    comments: [],
    publishedAt: '2023-10-25T09:00:00Z',
    status: 'published',
    views: 8900,
    isExclusive: true,
  },
  {
    id: 'p3',
    title: 'A Deep Dive into Large Language Models',
    content: '## What are LLMs?\n\nLarge Language Models (LLMs) are a type of artificial intelligence that can understand and generate human-like text. They are trained on vast amounts of text data and can be used for a variety of tasks, such as translation, summarization, and question answering.',
    excerpt: 'Large Language Models (LLMs) are a type of artificial intelligence that can understand and generate human-like text...',
    thumbnailUrl: getPostThumbnail(3),
    authorId: '3',
    tags: ['AI', 'Data Science', 'LLM'],
    likes: 310,
    likedBy: ['1'],
    comments: [],
    publishedAt: '2023-10-24T18:00:00Z',
    status: 'published',
    views: 12000,
    isExclusive: true,
  },
  {
    id: 'p4',
    title: 'Content is King: A Guide to Content Strategy',
    content: '## Defining Your Audience\n\nThe first step in any content strategy is to define your target audience. Who are you trying to reach? What are their pain points? What kind of content do they consume?',
    excerpt: 'The first step in any content strategy is to define your target audience. Who are you trying to reach? What are their pain points?',
    thumbnailUrl: getPostThumbnail(4),
    authorId: '4',
    tags: ['Marketing', 'Content Strategy'],
    likes: 80,
    likedBy: ['4'],
    comments: [],
    publishedAt: '2023-10-23T11:00:00Z',
    status: 'published',
    views: 3400,
    isExclusive: false,
  },
  {
    id: 'p5',
    title: 'My First Draft Post',
    content: 'This is a draft and should not be visible on the public feed.',
    excerpt: 'This is a draft...',
    thumbnailUrl: getPostThumbnail(5),
    authorId: '1',
    tags: ['Drafting'],
    likes: 0,
    likedBy: [],
    comments: [],
    publishedAt: '',
    status: 'draft',
    views: 0,
    isExclusive: false,
  },
];

export let mockNotifications: Notification[] = [
  {
    id: uuidv4(),
    userId: '1',
    type: 'new_follower',
    fromUserId: '2',
    read: false,
    createdAt: '2023-10-28T09:00:00Z',
  },
  {
    id: uuidv4(),
    userId: '1',
    type: 'comment',
    fromUserId: '2',
    postId: 'p1',
    read: false,
    createdAt: '2023-10-27T10:00:00Z',
  },
  {
    id: uuidv4(),
    userId: '1',
    type: 'like',
    fromUserId: '4',
    postId: 'p1',
    read: true,
    createdAt: '2023-10-27T09:30:00Z',
  },
  {
    id: uuidv4(),
    userId: '2',
    type: 'mention',
    fromUserId: '1',
    postId: 'p1',
    read: true,
    createdAt: '2023-10-26T15:00:00Z',
  },
];


export const mockTeam: TeamMember[] = [
  { name: 'Brenda Smith', role: 'CEO & Founder', avatarUrl: getUserAvatar(2), bio: 'Visionary leader with a passion for empowering creators.' },
  { name: 'Alex Johnson', role: 'Chief Technology Officer', avatarUrl: getUserAvatar(1), bio: 'Architecting the future of digital publishing.' },
  { name: 'Diana Prince', role: 'Head of Marketing', avatarUrl: getUserAvatar(4), bio: 'Connecting writers with readers across the globe.' },
  { name: 'Charlie Brown', role: 'Lead Data Scientist', avatarUrl: getUserAvatar(3), bio: 'Uncovering insights to build a smarter platform.' },
];

export let mockContactMessages: ContactMessage[] = [
  {
    id: uuidv4(),
    name: 'John Doe',
    email: 'john.doe@example.com',
    message: 'I am having trouble logging into my account. Can you please help?',
    status: 'pending',
    createdAt: '2023-10-29T14:00:00Z',
  },
  {
    id: uuidv4(),
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    message: 'I would like to suggest a feature for your platform. It would be great to have a way to co-author posts.',
    status: 'pending',
    createdAt: '2023-10-29T11:20:00Z',
  },
  {
    id: uuidv4(),
    name: 'Peter Jones',
    email: 'peter.jones@example.com',
    message: 'Just wanted to say I love your platform! Keep up the great work.',
    status: 'resolved',
    createdAt: '2023-10-28T18:30:00Z',
  },
];

export function findUserByEmail(email: string): User | undefined {
  return mockUsers.find((user) => user.email === email);
}

export function deleteMockPost(postId: string) {
  const index = mockPosts.findIndex(p => p.id === postId);
  if (index > -1) {
    mockPosts.splice(index, 1);
  }
}
