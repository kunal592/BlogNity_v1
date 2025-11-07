
'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search, User, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserNav } from '@/components/shared/UserNav';
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AppHeader() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('blogs'); // 'blogs' or 'users'
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      if (searchType === 'blogs') {
        router.push(`/search?query=${searchQuery}`);
      } else {
        router.push(`/search/users?query=${searchQuery}`);
      }
    }
  };

  const toggleSearchType = () => {
    setSearchType(searchType === 'blogs' ? 'users' : 'blogs');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={searchType === 'blogs' ? 'Search blogs...' : 'Search users...'}
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
         <Button variant="ghost" size="icon" onClick={toggleSearchType} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
          {searchType === 'blogs' ? <FileText className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </Button>
      </div>
      {session ? (
        <UserNav />
      ) : (
        <Button onClick={() => signIn("google")}>Login</Button>
      )}
    </header>
  );
}
