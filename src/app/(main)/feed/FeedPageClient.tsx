'use client';

import type { Post, User } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import BlogList from '@/app/(main)/home/BlogList';
import { Card, CardContent } from '@/components/ui/card';
import { Rss } from 'lucide-react';

interface FeedPageClientProps {
    initialPosts: (Post & { author?: User })[];
}

export default function FeedPageClient({ initialPosts }: FeedPageClientProps) {
  const { user } = useAuth();
  
  if (!user) {
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
      {initialPosts.length > 0 ? (
        <BlogList posts={initialPosts} listTitle="Your Feed" />
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
