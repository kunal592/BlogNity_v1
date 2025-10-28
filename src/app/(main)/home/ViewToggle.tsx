'use client';

import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-1">
      <Button
        variant={view === 'grid' ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => onViewChange('grid')}
        aria-label="Grid view"
      >
        <LayoutGrid className="h-5 w-5" />
      </Button>
      <Button
        variant={view === 'list' ? 'secondary' : 'ghost'}
        size="icon"
        onClick={() => onViewChange('list')}
        aria-label="List view"
      >
        <List className="h-5 w-5" />
      </Button>
    </div>
  );
}
