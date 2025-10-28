'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getUserProfile } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Edit } from 'lucide-react';
import BlogCard from '../home/BlogCard';
import { useRouter } from 'next/navigation';
import type { User, Post } from '@prisma/client'; // Import User and Post types

// Define a more specific type for the user profile data
interface UserProfile extends User {
  posts: Post[];
  bookmarkedPosts: Post[];
  followingUsers: User[];
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      getUserProfile(session.user.id).then(data => {
        setUserProfile(data as UserProfile);
      });
    } else if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [session, status, router]);

  if (status === 'loading' || !userProfile) {
    return <div>Loading profile...</div>;
  }
  
  const { name, username, image, bio, postsCount, followersCount, followingCount, posts, bookmarkedPosts, followingUsers } = userProfile;

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
                <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="blogs">My Blogs</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="blogs" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} author={userProfile as User} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="bookmarked" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookmarkedPosts.map(post => (
              <BlogCard key={post.id} post={post} author={post.author} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="following" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {followingUsers.map(followedUser => (
                    <Card key={followedUser.id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    {followedUser.image && <AvatarImage src={followedUser.image} alt={followedUser.name} />}
                                    <AvatarFallback>{followedUser.name ? followedUser.name.charAt(0) : 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{followedUser.name}</p>
                                    <p className="text-sm text-muted-foreground">@{followedUser.username}</p>
                                </div>
                            </div>
                            <Button variant="secondary" size="sm">Unfollow</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
