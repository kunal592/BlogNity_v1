'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Post, User } from '@prisma/client';
import BlogCard from '../home/BlogCard';
import { Button } from '@/components/ui/button';

// Define the expected structure for a post, including the author.
interface PostWithAuthor extends Post {
    author: User;
}

export default function ExclusivePage() {
    const router = useRouter();
    const [exclusivePosts, setExclusivePosts] = useState<PostWithAuthor[]>([]);

    useEffect(() => {
        fetch('/api/posts/exclusive')
            .then((res) => res.json())
            .then((data) => setExclusivePosts(data))
            .catch((error) => console.error('Failed to fetch exclusive posts:', error));
    }, []);

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Your Private Posts</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {exclusivePosts.map((post) => (
                    <BlogCard key={post.id} post={post} author={post.author} />
                ))}
            </div>
        </div>
    );
}
