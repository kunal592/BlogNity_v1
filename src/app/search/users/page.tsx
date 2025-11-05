'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '@/lib/types';
import UserCard from '@/components/shared/UserCard';

export default function UserSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      const fetchUsers = async () => {
        try {
          const res = await fetch(`/api/users/search?query=${query}`);
          const data = await res.json();
          setUsers(data);
        } catch (error) {
          console.error("Error fetching search results:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results for "{query}"</h1>
      {users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}
