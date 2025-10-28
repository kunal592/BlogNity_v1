'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import BlogCard from './BlogCard';
import BlogCardList from './BlogCardList';
import type { Post, User } from '@/lib/types';

interface BlogListProps {
  posts: (Post & { author?: User })[];
  listTitle?: string;
}

export default function BlogList({ posts, listTitle = "Public Feed" }: BlogListProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{listTitle}</h1>
        <div className="flex gap-1">
            <Button
                variant={view === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setView('grid')}
                aria-label="Grid view"
            >
                <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setView('list')}
                aria-label="List view"
            >
                <List className="h-5 w-5" />
            </Button>
        </div>
      </div>
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} author={post.author} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map(post => (
            <BlogCardList key={post.id} post={post} author={post.author} />
          ))}
        </div>
      )}
    </>
  );
}
