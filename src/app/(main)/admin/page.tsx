'use client';

import { useEffect, useState } from 'react';
import { getPosts, getUsers, getContactMessages } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, BarChart2, MessageSquareWarning, Settings, MailQuestion } from 'lucide-react';
import AdminUserTable from './AdminUserTable';
import AdminPostTable from './AdminPostTable';
import type { User, Post, ContactMessage } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResolveQueriesTable from './ResolveQueriesTable';

function ReportedCommentsPlaceholder() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Reported Comments</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground py-12">
                    <MessageSquareWarning className="mx-auto h-12 w-12 mb-4" />
                    <p>No reported comments at this time.</p>
                </div>
            </CardContent>
        </Card>
    )
}

function SiteSettingsPlaceholder() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Site Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground py-12">
                     <Settings className="mx-auto h-12 w-12 mb-4" />
                    <p>General site settings will be managed here.</p>
                </div>
            </CardContent>
        </Card>
    )
}


export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [queries, setQueries] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const totalReports = 12; // Mock data

  const fetchData = async () => {
    setLoading(true);
    const [userResponse, postResponse, queryResponse] = await Promise.all([getUsers(), getPosts(), getContactMessages()]);
    setUsers(userResponse);
    setPosts(postResponse);
    setQueries(queryResponse);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Queries</CardTitle>
            <MailQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queries.filter(q => q.status === 'pending').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
          </CardContent>
        </Card>
      </div>

       <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="posts">Manage Posts</TabsTrigger>
          <TabsTrigger value="queries">Resolve Queries</TabsTrigger>
          <TabsTrigger value="comments">Reported Comments</TabsTrigger>
          <TabsTrigger value="settings">Site Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
            <AdminUserTable users={users} />
        </TabsContent>
        <TabsContent value="posts">
            <AdminPostTable posts={posts} onUpdate={fetchData} />
        </TabsContent>
        <TabsContent value="queries">
            <ResolveQueriesTable queries={queries} onUpdate={fetchData} />
        </TabsContent>
        <TabsContent value="comments">
            <ReportedCommentsPlaceholder />
        </TabsContent>
        <TabsContent value="settings">
            <SiteSettingsPlaceholder />
        </TabsContent>
      </Tabs>

    </div>
  );
}
