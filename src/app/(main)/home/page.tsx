'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ViewToggle from './ViewToggle';
import type { Post, User } from '@prisma/client';

// Define the expected structure for a post, including the author.
interface PostWithAuthor extends Post {
    author: User;
}

export default function HomePage() {
    const [publicPosts, setPublicPosts] = useState<PostWithAuthor[]>([]);
    const [trendingPosts, setTrendingPosts] = useState<PostWithAuthor[]>([]);

    useEffect(() => {
        // Fetch public posts
        fetch('/api/posts/public')
            .then(res => res.json())
            .then(data => setPublicPosts(data || [])) // Initialize with an empty array if data is null/undefined
            .catch(error => {
                console.error('Failed to fetch public posts:', error);
                setPublicPosts([]); // Set to empty array on error
            });

        // Fetch trending posts
        fetch('/api/posts/trending')
            .then(res => res.json())
            .then(data => setTrendingPosts(data || [])) // Initialize with an empty array if data is null/undefined
            .catch(error => {
                console.error('Failed to fetch trending posts:', error);
                setTrendingPosts([]); // Set to empty array on error
            });
    }, []);

    return (
        <div className="container mx-auto">
            <Tabs defaultValue="public">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="public">Public</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                </TabsList>
                <TabsContent value="public">
                    <ViewToggle posts={publicPosts} listTitle="Public Feed" />
                </TabsContent>
                <TabsContent value="trending">
                    <ViewToggle posts={trendingPosts} listTitle="Trending Now" />
                </TabsContent>
            </Tabs>
        </div>
    );
}
