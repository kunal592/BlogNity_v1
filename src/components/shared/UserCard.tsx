'use client';

import { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface UserCardProps {
    user: User;
}

export default function UserCard({ user }: UserCardProps) {
    return (
        <div className="border rounded-lg p-4 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.image || ''} alt={user.name || ''} />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            <p className="text-sm my-2">{user.bio}</p>
            <Link href={`/profile/${user.id}`} passHref>
                <Button variant="outline" size="sm">View Profile</Button>
            </Link>
        </div>
    );
}
