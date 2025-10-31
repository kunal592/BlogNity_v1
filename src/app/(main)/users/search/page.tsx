'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import UserCard from '@/components/shared/UserCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

async function searchUsers(query: string): Promise<User[]> {
  const res = await fetch(`/api/users/search?q=${query}`);
  if (!res.ok) {
    throw new Error('Failed to search for users');
  }
  return res.json();
}

export default function UserSearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchUsers(query);
      setUsers(results);
    } catch (error) {
      console.error("Failed to search users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
        handleSearch();
    }
  }, [initialQuery]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Search for Users</h1>
        <form onSubmit={handleSearch} className="flex items-center gap-2 mb-8">
            <Input 
                type="text"
                placeholder="Search by name or username"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="max-w-sm"
            />
            <Button type="submit">Search</Button>
        </form>

      {loading ? (
        <div>Loading...</div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}
