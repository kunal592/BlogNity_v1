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
  const [likes, setLikes] = useState(post.likes);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLiked(post.likedBy.includes(user.id));
      setIsBookmarked(user.bookmarkedPosts?.includes(post.id));
    } else {
      setIsLiked(false);
      setIsBookmarked(false);
    }
  }, [user, post.id, post.likedBy]);

  const handleLike = async () => {
    if (!user) return toast({ title: 'Please log in to like posts.', variant: 'destructive' });
    
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(prev => newIsLiked ? prev + 1 : prev - 1);
    
    try {
      await toggleLike(post.id, user.id);
      toast({ title: newIsLiked ? 'Post liked!' : 'Post unliked' });
    } catch(e) {
      setIsLiked(!newIsLiked);
      setLikes(prev => newIsLiked ? prev - 1 : prev + 1);
      toast({ title: 'Something went wrong', variant: 'destructive' });
    }
  };

  const handleBookmark = async () => {
    if (!user) return toast({ title: 'Please log in to bookmark posts.', variant: 'destructive' });

    const newIsBookmarked = !isBookmarked;
    setIsBookmarked(newIsBookmarked);
    try {
      await toggleBookmark(post.id, user.id);
      toast({ title: newIsBookmarked ? 'Post bookmarked!' : 'Bookmark removed' });
    } catch(e) {
      setIsBookmarked(!newIsBookmarked);
      toast({ title: 'Something went wrong', variant: 'destructive' });
    }
  };
  
  const handleSummarize = () => {
    toast({
      title: 'AI Summary',
      description: 'This is a mock AI summary of the blog post. It provides a concise overview of the main points.',
    });
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full">
      <CardContent className="p-4 flex gap-4">
        <div className="relative w-1/3 md:w-1/4 flex-shrink-0">
           <Image
            src={post.thumbnailUrl || '/placeholder.jpg'}
            alt={post.title}
            layout="fill"
            className="object-cover rounded-md"
            data-ai-hint="blog thumbnail"
          />
           {post.isExclusive && (
            <Badge className="absolute top-2 right-2" variant="destructive">
                <Gem className="h-3 w-3 mr-1" />
                Exclusive
            </Badge>
            )}
        </div>
        <div className="flex-grow flex flex-col">
            <div className="flex gap-2 mb-2">
                {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
            </div>
            <h2 className="text-xl font-bold mb-2 leading-tight">
                <Link href={`/blog/${post.id}`} className={cn("hover:text-primary transition-colors", post.isExclusive && !user?.hasPaidAccess && "pointer-events-none")}>
                    {post.title}
                </Link>
            </h2>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">{post.excerpt}</p>
            
            <div className="flex items-center justify-between w-full text-muted-foreground">
                {author && (
                    <div className="flex items-center gap-2 text-sm">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={author.avatarUrl || '/user-placeholder.png'} alt={author.name} />
                            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{author.name}</span>
                        <span className="hidden md:inline">·</span>
                        <span className="hidden md:inline">{post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : ''}</span>
                    </div>
                )}
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLike}>
                        <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSummarize}>
                        <BookOpen className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBookmark}>
                        <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
                    </Button>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
