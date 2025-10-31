'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Post, User } from '@/lib/types';
import BlogCard from '@/app/(main)/home/BlogCard';
import UserCard from '@/components/shared/UserCard';
import { searchPosts, searchUsers } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setLoading(true);
        try {
          const [postResults, userResults] = await Promise.all([
            searchPosts(query),
            searchUsers(query),
          ]);
          setPosts(postResults);
          setUsers(userResults);
        } catch (error) {
          console.error("Failed to search", error);
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results for "{query}"</h1>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList>
          <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
              {posts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="mt-4">No posts found.</p>
          )}
        </TabsContent>
        <TabsContent value="users">
          {users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
              {users.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <p className="mt-4">No users found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
