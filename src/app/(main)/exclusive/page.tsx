'use client';

import { useEffect, useState } from 'react';
import type { Post, User } from '@prisma/client';
import BlogCard from '../home/BlogCard';

// Define the expected structure for a post, including the author.
interface PostWithAuthor extends Post {
    author: User;
}

export default function ExclusivePage() {
    const [exclusivePosts, setExclusivePosts] = useState<PostWithAuthor[]>([]);

    useEffect(() => {
        fetch('/api/posts/exclusive')
            .then((res) => res.json())
            .then((data) => setExclusivePosts(data))
            .catch((error) => console.error('Failed to fetch exclusive posts:', error));
    }, []);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Exclusive Content</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {exclusivePosts.map((post) => (
                    <BlogCard key={post.id} post={post} author={post.author} />
                ))}
            </div>
        </div>
    );
}
