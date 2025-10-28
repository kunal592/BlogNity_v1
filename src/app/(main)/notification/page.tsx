'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getNotifications } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Heart, MessageCircle, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


function NotificationIcon({ type }: { type: string }) {
    switch (type) {
      case 'NEW_FOLLOWER':
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case 'LIKE':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'COMMENT':
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
}

export default function NotificationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
        getNotifications(session.user.id).then(setNotifications);
    } else if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [session, status, router]);


  const getNotificationText = (notification: any) => {
    const fromUser = notification.actor;
    if (!fromUser) return 'An action occurred.';
    switch (notification.type) {
        case 'NEW_FOLLOWER':
            return <><span className="font-semibold">{fromUser.name}</span> started following you.</>;
        case 'LIKE':
            return <><span className="font-semibold">{fromUser.name}</span> liked your post.</>;
        case 'COMMENT':
            return <><span className="font-semibold">{fromUser.name}</span> commented on your post.</>;
        case 'MENTION':
            return <><span className="font-semibold">{fromUser.name}</span> mentioned you in a post.</>;
        default:
            return 'New notification.';
    }
  };

  if (status === 'loading') {
      return <div>Loading notifications...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <Card>
        <CardContent className="p-0">
          {notifications.length > 0 ? (
            <ul className="divide-y">
              {notifications.map(notification => {
                 const fromUser = notification.actor;
                 const notificationLink = notification.post ? `/blog/${notification.post.slug}` : (fromUser ? `/profile/${fromUser.id}`: '#');

                return (
                  <li key={notification.id} className={cn('hover:bg-muted/50 transition-colors', !notification.read && 'bg-primary/5')}>
                     <Link href={notificationLink} className="flex items-start gap-4 p-4">
                      <div className="relative">
                        {fromUser && (
                          <Avatar>
                            {fromUser.image && <AvatarImage src={fromUser.image} alt={fromUser.name || 'User'} />}
                            <AvatarFallback>{fromUser.name ? fromUser.name.charAt(0) : 'U'}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-card p-0.5 rounded-full">
                           <NotificationIcon type={notification.type} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{getNotificationText(notification)}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.read && <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1"></div>}
                     </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="mx-auto h-12 w-12 mb-4" />
              <p>No new notifications.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
