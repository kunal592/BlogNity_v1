'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import BlogList from './BlogList';
import type { Post, User } from '@/lib/types';

interface ViewToggleProps {
  posts: (Post & { author?: User })[];
  listTitle?: string;
}

export default function ViewToggle({ posts, listTitle }: ViewToggleProps) {
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
      <BlogList posts={posts} view={view} />
    </>
  );
}
