import { getNotifications, getUsers } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Heart, MessageCircle, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case 'new_follower':
      return <UserPlus className="h-5 w-5 text-blue-500" />;
    case 'like':
      return <Heart className="h-5 w-5 text-red-500" />;
    case 'comment':
      return <MessageCircle className="h-5 w-5 text-green-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
}

export default async function NotificationPage() {
  // In a real app, we'd get the current user ID from the session.
  const currentUserId = '1';
  const notifications = await getNotifications(currentUserId);
  const users = await getUsers();

  const getNotificationText = (notification: (typeof notifications)[0]) => {
    const fromUser = users.find(u => u.id === notification.fromUserId);
    if (!fromUser) return 'An action occurred.';
    switch (notification.type) {
      case 'new_follower':
        return <><span className="font-semibold">{fromUser.name}</span> started following you.</>;
      case 'like':
        return <><span className="font-semibold">{fromUser.name}</span> liked your post.</>;
      case 'comment':
        return <><span className="font-semibold">{fromUser.name}</span> commented on your post.</>;
      case 'mention':
        return <><span className="font-semibold">{fromUser.name}</span> mentioned you in a post.</>;
      default:
        return 'New notification.';
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <Card>
        <CardContent className="p-0">
          {notifications.length > 0 ? (
            <ul className="divide-y">
              {notifications.map(notification => {
                 const fromUser = users.find(u => u.id === notification.fromUserId);
                 const notificationLink = notification.postId ? `/blog/${notification.postId}` : `/profile/${notification.fromUserId}`;

                return (
                  <li key={notification.id} className={cn('hover:bg-muted/50 transition-colors', !notification.read && 'bg-primary/5')}>
                     <Link href={notificationLink} className="flex items-start gap-4 p-4">
                      <div className="relative">
                        {fromUser && (
                          <Avatar>
                            <AvatarImage src={fromUser.avatarUrl} alt={fromUser.name} />
                            <AvatarFallback>{fromUser.name.charAt(0)}</AvatarFallback>
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
