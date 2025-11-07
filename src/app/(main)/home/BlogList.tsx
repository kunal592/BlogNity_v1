'use client';

import BlogCard from './BlogCard';
import BlogCardList from './BlogCardList';
import type { Post, User } from '@/lib/types';

interface BlogListProps {
  posts: (Post & { author?: User })[];
  view?: 'grid' | 'list';
  listTitle?: string;
}

export default function BlogList({ posts, view, listTitle }: BlogListProps) {
  return (
    <>
      {listTitle && <h1 className="text-3xl font-bold mb-6">{listTitle}</h1>}
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
