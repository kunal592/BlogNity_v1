'use client';

import type { Post, Author } from '@/lib/types';
import { useSession } from 'next-auth/react';
import BlogList from '@/app/(main)/home/BlogList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rss, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toggleFollow } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface FeedPageClientProps {
  initialPosts: Post[];
  topAuthors: Author[];
}

export default function FeedPageClient({ initialPosts, topAuthors }: FeedPageClientProps) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (session) {
      setLoading(false);
    } else if (session === null) {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    // Initialize following status from session
    const initialFollowing = topAuthors.reduce((acc, author) => {
        acc[author.id] = (session?.user as any)?.following?.includes(author.id);
        return acc;
    }, {} as Record<string, boolean>)
    setFollowingStatus(initialFollowing)
  }, [session, topAuthors]);

  const handleFollow = async (authorId: string, authorName: string) => {
    if (!session) return toast({ title: 'Please log in to follow authors.', variant: 'destructive' });

    const newFollowingStatus = !followingStatus[authorId];
    setFollowingStatus(prev => ({ ...prev, [authorId]: newFollowingStatus }));

    try {
      await toggleFollow(authorId);
      toast({ title: newFollowingStatus ? `Following ${authorName}` : `Unfollowed ${authorName}` });
    } catch (e) {
      setFollowingStatus(prev => ({ ...prev, [authorId]: !newFollowingStatus }));
      toast({ title: 'Something went wrong', variant: 'destructive' });
    }
  };

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
            <Card className="mt-8">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                    <Rss className="h-12 w-12 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Your Feed is Empty</h2>
                    <p className="text-muted-foreground">
                    Follow authors to see personalized content here.
                    </p>
                </CardContent>
            </Card>
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserIcon className="h-6 w-6" />
                        Top Authors to Follow
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {(topAuthors || []).map(author => (
                            <div key={author.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={author.image || ''} />
                                        <AvatarFallback>{author.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{author.name}</p>
                                        <p className="text-sm text-muted-foreground">{author.followersCount} followers</p>
                                    </div>
                                </div>
                                <Button 
                                    variant={followingStatus[author.id] ? 'outline' : 'default'}
                                    onClick={() => handleFollow(author.id, author.name || '')}>
                                    {followingStatus[author.id] ? 'Unfollow' : 'Follow'}
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
      )}
    </div>
  );
}
