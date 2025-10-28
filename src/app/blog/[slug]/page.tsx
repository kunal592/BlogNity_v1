'use client';

import { useEffect, useState } from 'react';
import { getPost } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Post, User, Comment } from '@prisma/client';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';

interface PostWithDetails extends Post {
  author: User;
  tags: { tag: { id: string; name: string; } }[];
  comments: (Comment & { author: User })[];
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<PostWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    getPost(slug)
      .then(data => {
        if (!data) {
          notFound();
        } else {
          setPost(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div>Loading post...</div>;
  }

  if (!post) {
    return null; // notFound() will have already been called
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          {post.thumbnailUrl && (
            <Image 
              src={post.thumbnailUrl} 
              alt={post.title} 
              width={1200} 
              height={600} 
              className="rounded-t-lg object-cover w-full mb-4"
            />
          )}
          <CardTitle className="text-4xl font-bold">{post.title}</CardTitle>
          <div className="flex items-center gap-4 mt-4">
            <Avatar>
              {post.author.image && <AvatarImage src={post.author.image} alt={post.author.name || ''} />}
              <AvatarFallback>{post.author.name ? post.author.name.charAt(0) : 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.publishedAt!).toLocaleDateString()} • {post.viewsCount} views
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {post.tags?.map(({ tag }) => (
              <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </CardContent>
      </Card>

      {/* --- Comments Section --- */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments ({post.comments?.length || 0})</h2>
        {/* Add comment submission form here */}
        <div className="space-y-6 mt-6">
          {post.comments?.map(comment => (
            <Card key={comment.id}>
              <CardContent className="p-4 flex gap-4">
                <Avatar className="h-10 w-10">
                  {comment.author.image && <AvatarImage src={comment.author.image} alt={comment.author.name || ''} />}
                  <AvatarFallback>{comment.author.name ? comment.author.name.charAt(0) : 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{comment.author.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
