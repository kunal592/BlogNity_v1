
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MDEditor from '@uiw/react-md-editor';
import { format } from 'date-fns';
import CommentSection from './CommentSection';
import { Post, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { toggleBookmark, toggleLike, toggleFollow } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface BlogPostPageClientProps {
    post: Post & { author: User };
}

export default function BlogPostPageClient({ post: initialPost }: BlogPostPageClientProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [post, setPost] = useState(initialPost);

    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            setIsLiked(post.likedBy?.includes(session.user.id) || false);
            setIsBookmarked(post.bookmarkedBy?.includes(session.user.id) || false);
            setIsFollowing((post.author as any).followers?.some((follower: any) => follower.followerId === session.user.id) || false);
        }
    }, [session, status, post]);

    const handleLike = async () => {
        if (!session) return router.push('/signin');
        await toggleLike(post.id, session.user.id);
        await refetchPost();
    };

    const handleBookmark = async () => {
        if (!session) return router.push('/signin');
        await toggleBookmark(post.id, session.user.id);
        setIsBookmarked(!isBookmarked);
    };

    const handleFollow = async () => {
        if (!session) return router.push('/signin');
        await toggleFollow(post.author.id);
        setIsFollowing(!isFollowing);
    };

    const refetchPost = async () => {
        const res = await fetch(`/api/posts/${post.id}`);
        if(res.ok) {
            const newPost = await res.json();
            setPost(newPost);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <article className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{post.title}</h1>
                <div className="flex items-center gap-4 mb-8 text-muted-foreground">
                    <Avatar>
                        <AvatarImage src={post.author.image || ''} alt={post.author.name || ''} />
                        <AvatarFallback>{post.author.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <span>{post.author.name}</span>
                        <span className="mx-2">·</span>
                        <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    {session?.user?.id !== post.author.id && (
                        <Button size="sm" variant="outline" onClick={handleFollow}>
                            {isFollowing ? 'Unfollow' : 'Follow'}                   
                        </Button>
                    )}
                </div>
                
                <div data-color-mode="light">
                    <MDEditor.Markdown 
                        source={post.content} 
                        className="prose prose-lg max-w-none" 
                    />
                </div>

                <div className="flex items-center justify-between w-full text-muted-foreground mt-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLike}>
                        <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        <span className="ml-1 text-xs">{post.likedBy?.length || 0}</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageCircle className="h-4 w-4" />
                        <span className="ml-1 text-xs">{post.comments?.length || 0}</span>
                        </Button>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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

                <hr className="my-12" />

                <CommentSection postId={post.id} comments={post.comments || []} onCommentAdded={refetchPost}/>

            </article>
        </div>
    );
}
