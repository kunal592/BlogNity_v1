'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';
import type { Post, User } from '@/lib/types';
import {
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Gem,
} from 'lucide-react';
import { toggleBookmark, toggleLike } from '@/lib/api';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BlogCardListProps {
  post: Post;
  author?: User;
}

export default function BlogCardList({ post, author }: BlogCardListProps) {
  const { data: session } = useSession();
  const user = session?.user as any;
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (user && post.likedBy) {
      setIsLiked(post.likedBy.includes(user.id));
    }
    if (user && post.bookmarkedBy) {
      setIsBookmarked(post.bookmarkedBy.includes(user.id));
    }
  }, [user, post]);

  const handleLike = async () => {
    if (!user) {
      toast({ title: 'Please sign in to like posts' });
      return;
    }
    try {
      await toggleLike(post.id, user.id);
      setIsLiked(!isLiked);
    } catch (error) {
      toast({ title: 'Error liking post', variant: 'destructive' });
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast({ title: 'Please sign in to bookmark posts' });
      return;
    }
    try {
      await toggleBookmark(post.id, user.id);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      toast({ title: 'Error bookmarking post', variant: 'destructive' });
    }
  };

  const postAuthor = author || post.author;

  return (
    <Card className="w-full flex flex-col sm:flex-row overflow-hidden hover:bg-muted/50 transition-colors">
      <div className="sm:w-1/3 md:w-2/5 relative h-48 sm:h-auto">
        <Link href={`/blog/${post.slug}`}>
          <Image
            src={post.coverImage || '/placeholder.jpg'}
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
        </Link>
      </div>
      <div className="sm:w-2/3 md:w-3/5 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href={`/user/${postAuthor.id}`} className="flex items-center gap-2 hover:text-primary">
              <Avatar className="h-6 w-6">
                <AvatarImage src={postAuthor.image || ''} />
                <AvatarFallback>{postAuthor.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{postAuthor.name}</span>
            </Link>
            <span>·</span>
            <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
          </div>
          <Link href={`/blog/${post.slug}`} className="block group">
            <h3 className="text-xl font-bold leading-snug mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {post.excerpt}
            </p>
          </Link>
          <div className="flex flex-wrap gap-2 mt-4">
          {post.tags?.map((tag: any) => (
              <Badge key={tag.tag.id} variant="secondary">{tag.tag.name}</Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <Heart className={cn("h-4 w-4", { 'fill-red-500 text-red-500': isLiked })} />
              <span>{post.likesCount || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.commentsCount || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleBookmark}>
              <Bookmark className={cn("h-5 w-5", { 'fill-primary text-primary': isBookmarked })} />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
