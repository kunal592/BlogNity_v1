
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTopAuthors } from "@/lib/api";
import FeedPageClient from "./FeedPageClient";
import type { Post, User } from "@prisma/client";

async function getFeedPosts(userId: string): Promise<(Post & { author: User })[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/feed`);
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export default async function FeedPage() {
  const session = await getServerSession(authOptions);
  let feedPosts: (Post & { author: User })[] = [];
  let topAuthors: User[] = [];

  if (session?.user?.id) {
    feedPosts = await getFeedPosts(session.user.id);
    if (feedPosts.length === 0) {
        topAuthors = await getTopAuthors();
    }
  }

  return <FeedPageClient initialPosts={feedPosts} topAuthors={topAuthors} />;
}
