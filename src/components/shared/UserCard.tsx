'use client';

import { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { toggleFollow } from '@/lib/api';
import { useState, useEffect } from 'react';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (session?.user?.id && (user as any).followers) {
      setIsFollowing((user as any).followers.some((follower: any) => follower.followerId === session.user.id));
    }
  }, [session, user]);

  const handleFollow = async () => {
    if (!session) return;
    await toggleFollow(user.id);
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col items-center text-center">
      <Avatar className="w-24 h-24 mb-4">
        <AvatarImage src={user.image || ''} alt={user.name || ''} />
        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <Link href={`/profile/${user.id}`}>
        <h3 className="text-xl font-semibold hover:underline">{user.name}</h3>
      </Link>
      <p className="text-muted-foreground mb-4">@{user.username}</p>
      {session && session.user.id !== user.id && (
        <Button onClick={handleFollow} size="sm">
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>
      )}
    </div>
  );
}
