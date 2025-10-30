'use client';

import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/lib/types';
import { Archive, Star, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { deletePost, togglePostExclusivity } from '@/lib/api';
import { Switch } from '@/components/ui/switch';

export default function AdminPostTable({ posts, onUpdate }: { posts: Post[], onUpdate: () => void }) {
    const { toast } = useToast();

    const handleDelete = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        const { success } = await deletePost(postId);
        if (success) {
            toast({ title: 'Post deleted successfully.' });
            onUpdate();
        } else {
            toast({ title: 'Failed to delete post.', variant: 'destructive' });
        }
    };

    const handleToggleExclusive = async (postId: string, currentStatus: boolean) => {
        const { success } = await togglePostExclusivity(postId);
        if (success) {
            toast({ title: `Post is now ${currentStatus ? 'public' : 'exclusive'}` });
            onUpdate();
        } else {
            toast({ title: 'Failed to update post.', variant: 'destructive' });
        }
    };

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Exclusive</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {posts.map(post => (
                        <TableRow key={post.id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>
                                <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>{post.status}</Badge>
                            </TableCell>
                             <TableCell>
                                <Switch
                                    checked={post.isExclusive}
                                    onCheckedChange={() => handleToggleExclusive(post.id, post.isExclusive!)}
                                    aria-label="Toggle exclusive status"
                                />
                            </TableCell>
                            <TableCell>{post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : '-'}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
