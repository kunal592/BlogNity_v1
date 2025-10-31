'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Post } from '@/lib/types';
import BlogCard from '@/app/(main)/home/BlogCard';
import { searchPosts } from '@/lib/api';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      const fetchPosts = async () => {
        try {
          const results = await searchPosts(query);
          setPosts(results);
        } catch (error) {
          console.error("Failed to search posts", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    }
  }, [query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results for "{query}"</h1>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}
