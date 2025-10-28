'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
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
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  post: Post;
  author?: User;
}

export default function BlogCard({ post, author }: BlogCardProps) {
  const { user, refetchUser } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(user ? post.likedBy.includes(user.id) : false);
  const [likes, setLikes] = useState(post.likes);
  const [isBookmarked, setIsBookmarked] = useState(user ? user.bookmarkedPosts.includes(post.id) : false);

  const handleLike = async () => {
    if (!user) return toast({ title: 'Please log in to like posts.', variant: 'destructive' });
    
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    
    await toggleLike(post.id, user.id);
    toast({ title: isLiked ? 'Post unliked' : 'Post liked!' });
  };

  const handleBookmark = async () => {
    if (!user) return toast({ title: 'Please log in to bookmark posts.', variant: 'destructive' });

    setIsBookmarked(!isBookmarked);
    await toggleBookmark(post.id, user.id);
    refetchUser(); // update user context
    toast({ title: isBookmarked ? 'Bookmark removed' : 'Post bookmarked!' });
  };
  
  const handleSummarize = () => {
    // In a real app, this would trigger the AI summary flow.
    toast({
      title: 'AI Summary',
      description: 'This is a mock AI summary of the blog post. It provides a concise overview of the main points.',
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <Image
          src={post.thumbnailUrl}
          alt={post.title}
          width={600}
          height={400}
          className="object-cover w-full h-48"
          data-ai-hint="blog thumbnail"
        />
        {post.isExclusive && (
          <Badge className="absolute top-2 right-2" variant="destructive">
            <Gem className="h-3 w-3 mr-1" />
            Exclusive
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex gap-2 mb-2">
          {post.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <CardTitle className="text-xl mb-2 leading-tight">
          <Link href={`/blog/${post.id}`} className={cn("hover:text-primary transition-colors", post.isExclusive && !user?.hasPaidAccess && "pointer-events-none")}>
            {post.title}
          </Link>
        </CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col items-start">
        {author && (
          <div className="flex items-center gap-2 mb-4 w-full justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={author.avatarUrl} alt={author.name} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{author.name}</span>
            </div>
            <Button size="sm" variant="outline">Follow</Button>
          </div>
        )}
        <div className="flex items-center justify-between w-full text-muted-foreground">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLike}>
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="ml-1 text-xs">{likes}</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MessageCircle className="h-4 w-4" />
              <span className="ml-1 text-xs">{post.comments.length}</span>
            </Button>
          </div>
          <div className="flex items-center gap-1">
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
      </CardFooter>
    </Card>
  );
}
