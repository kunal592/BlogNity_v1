
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPosts, getUserProfile, getTopAuthors } from "@/lib/api";
import FeedPageClient from "./FeedPageClient";
import type { Post, User } from "@prisma/client";

export default async function FeedPage() {
  const session = await getServerSession(authOptions);
  let feedPostsWithAuthors: (Post & { author?: User })[] = [];
  let topAuthors: User[] = [];

  if (session?.user?.id) {
    const userProfile = await getUserProfile(session.user.id);
    const allPosts = await getPosts();

    if (userProfile?.followingUsers && userProfile.followingUsers.length > 0) {
      const followedUserIds = userProfile.followingUsers.map((user) => user.id);
      const feedPosts = allPosts.filter((post) =>
        followedUserIds.includes(post.authorId)
      );

      feedPostsWithAuthors = feedPosts.map((post) => {
        const author = userProfile.followingUsers.find(
          (user) => user.id === post.authorId
        );
        return { ...post, author };
      });
    } else {
        topAuthors = await getTopAuthors();
    }
  }

  return <FeedPageClient initialPosts={feedPostsWithAuthors} topAuthors={topAuthors} />;
}
