'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getUserProfile, toggleFollow } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Edit } from 'lucide-react';
import BlogCard from '../home/BlogCard';
import { useRouter } from 'next/navigation';
import type { User, Post } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
    bio: string | null;
    postsCount: number;
    followersCount: number;
    followingCount: number;
    posts: Post[];
    bookmarkedPosts: (Post & { author: User })[];
    followers: User[];
    followingUsers: User[];
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [followingUsersState, setFollowingUsersState] = useState<User[]>([]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      getUserProfile(session.user.id).then(data => {
        setUserProfile(data);
        if(data && data.followingUsers) {
          setFollowingUsersState(data.followingUsers);
        }
      });
    } else if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [session, status, router]);

  const handleUnfollow = async (userId: string, userName: string) => {
    await toggleFollow(userId);
    toast({ title: `Unfollowed ${userName}` });
    // Optimistically update the UI
    setFollowingUsersState(prev => prev.filter(user => user.id !== userId));
    // Update the main user profile state to reflect the change in the following count
    if(userProfile) {
      setUserProfile({
        ...userProfile,
        followingCount: userProfile.followingCount - 1,
      })
    }
  };

  if (status === 'loading' || !userProfile) {
    return <div>Loading profile...</div>;
  }
  
  const { name, username, image, bio, postsCount, followersCount, followingCount, posts, bookmarkedPosts, followers } = userProfile;

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-md">
              {image && <AvatarImage src={image} alt={name || 'User'} />}
              <AvatarFallback className="text-4xl">{name ? name.charAt(0) : 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold">{name}</h1>
                <Button variant="outline" onClick={() => router.push('/profile/edit')}><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
              </div>
              <p className="text-muted-foreground">@{username}</p>
              <p className="mt-4">{bio || 'This user has not set a bio yet.'}</p>
              <div className="flex gap-6 mt-4 text-sm">
                <div><span className="font-semibold">{postsCount}</span> Posts</div>
                <div><span className="font-semibold">{followersCount}</span> Followers</div>
                <div><span className="font-semibold">{followingCount}</span> Following</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="blogs">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="blogs">My Blogs</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="blogs" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(posts || []).map(post => (
              <BlogCard key={post.id} post={post} author={userProfile as any} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="bookmarked" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(bookmarkedPosts || []).map(post => (
              <BlogCard key={post.id} post={post} author={post.author} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="followers" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(followers || []).map(follower => (
                    <Card key={follower.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    {follower.image && <AvatarImage src={follower.image} alt={follower.name || ''} />}
                                    <AvatarFallback>{follower.name ? follower.name.charAt(0) : 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{follower.name}</p>
                                    <p className="text-sm text-muted-foreground">@{follower.username}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>
        <TabsContent value="following" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {followingUsersState.map(followedUser => (
                    <Card key={followedUser.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    {followedUser.image && <AvatarImage src={followedUser.image} alt={followedUser.name || ''} />}
                                    <AvatarFallback>{followedUser.name ? followedUser.name.charAt(0) : 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{followedUser.name}</p>
                                    <p className="text-sm text-muted-foreground">@{followedUser.username}</p>
                                </div>
                            </div>
                            <Button variant="secondary" size="sm" onClick={() => handleUnfollow(followedUser.id, followedUser.name || '')}>Unfollow</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
