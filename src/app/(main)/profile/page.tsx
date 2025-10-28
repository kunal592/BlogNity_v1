import { getUser, getPostsByAuthor, getPosts, getUsers } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Edit } from 'lucide-react';
import BlogCard from '../home/BlogCard';

export default async function ProfilePage() {
  // In a real app, this might come from the URL, but here we get the logged-in user.
  const currentUserId = '1';
  const user = await getUser(currentUserId);
  
  if (!user) {
    return <div>User not found</div>;
  }

  const userPosts = await getPostsByAuthor(user.id);
  const allPosts = await getPosts();
  const allUsers = await getUsers();

  const bookmarkedPosts = allPosts.filter(post => user.bookmarkedPosts.includes(post.id))
    .map(post => ({
      ...post,
      author: allUsers.find(u => u.id === post.authorId)
    }));

  const followingUsers = allUsers.filter(u => user.followingUsers.includes(u.id));

  return (
    <div className="container mx-auto">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-md">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
              </div>
              <p className="text-muted-foreground">@{user.username}</p>
              <p className="mt-4">{user.bio}</p>
              <div className="flex gap-6 mt-4 text-sm">
                <div><span className="font-semibold">{userPosts.length}</span> Posts</div>
                <div><span className="font-semibold">{user.followers}</span> Followers</div>
                <div><span className="font-semibold">{user.following}</span> Following</div>
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
            {userPosts.map(post => (
              <BlogCard key={post.id} post={post} author={user} />
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
                                    <AvatarImage src={followedUser.avatarUrl} alt={followedUser.name} />
                                    <AvatarFallback>{followedUser.name.charAt(0)}</AvatarFallback>
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
