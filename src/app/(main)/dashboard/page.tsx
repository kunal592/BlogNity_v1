'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { deletePost, getPostsByAuthor } from '@/lib/api';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const { toast } = useToast();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);

  const isLoading = status === 'loading';

  useEffect(() => {
    if (status === 'authenticated' && user?.id) {
      getPostsByAuthor(user.id).then(data => {
        setPosts(data);
      });
    }
  }, [status, user]);

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const { success } = await deletePost(postId);
    if (success) {
      setPosts(posts.filter(p => p.id !== postId));
      toast({ title: 'Post deleted successfully.' });
    } else {
      toast({ title: 'Failed to delete post.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/signin');
    return null;
  }

  const publishedPosts = posts.filter(p => p.status.toLowerCase() === 'published');
  const draftPosts = posts.filter(p => p.status.toLowerCase() === 'draft');

  const totalViews = posts.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
  const totalLikes = posts.reduce((sum, p) => sum + (p.likesCount || 0), 0);
  const totalComments = posts.reduce((sum, p) => sum + (p.commentsCount || 0), 0);

  return (
    <div className="container mx-auto space-y-8 py-8">
      <h1 className="text-3xl font-bold">Your Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="published">
        <TabsList>
          <TabsTrigger value="published">Published ({publishedPosts.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftPosts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="published">
          <PostTable posts={publishedPosts} onDelete={handleDelete} onEdit={(id) => router.push(`/editor/${id}`)} />
        </TabsContent>
        <TabsContent value="drafts">
          <PostTable posts={draftPosts} onDelete={handleDelete} onEdit={(id) => router.push(`/editor/${id}`)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PostTable({ posts, onDelete, onEdit }: { posts: Post[], onDelete: (id: string) => void, onEdit: (id: string) => void }) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map(post => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell><Badge variant={post.status.toLowerCase() === 'published' ? 'default' : 'secondary'}>{post.status}</Badge></TableCell>
              <TableCell>{post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'Draft'}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(post.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(post.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
