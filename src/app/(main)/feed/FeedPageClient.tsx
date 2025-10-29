'use client';

import type { Post, User } from '@/lib/types';
import { useSession } from 'next-auth/react';
import BlogList from '@/app/(main)/home/BlogList';
import { Card, CardContent } from '@/components/ui/card';
import { Rss } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeedPageClient() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<(Post & { author?: User })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch(`/api/users/${session.user.id}/feed`);
          if (res.ok) {
            const data = await res.json();
            setPosts(data);
          }
        } catch (error) {
          console.error('Failed to fetch feed:', error);
        } finally {
          setLoading(false);
        }
      } else if (session === null) { // session is loaded, but user is not logged in
        setLoading(false);
      }
    };

    fetchFeed();
  }, [session]);

  if (loading) {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Feed</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
        <Card className="mt-8">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <Rss className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Please Log In</h2>
                <p className="text-muted-foreground">
                Log in to see your personalized feed.
                </p>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="container mx-auto">
      {posts.length > 0 ? (
        <BlogList posts={posts} listTitle="Your Feed" />
      ) : (
        <>
            <h1 className="text-3xl font-bold mb-6">Your Feed</h1>
            <Card className="mt-8">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <Rss className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Your Feed is Empty</h2>
                <p className="text-muted-foreground">
                Follow authors to see personalized content here.
                </p>
            </CardContent>
            </Card>
        </>
      )}
    </div>
  );
}
