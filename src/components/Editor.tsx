'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import MDEditor from '@uiw/react-md-editor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updatePost, createPost } from '@/lib/api';
import type { Post } from '@/lib/types';
import { useSession } from 'next-auth/react';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
});

interface EditorProps {
  post?: Post;
}

export default function Editor({ post }: EditorProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      status: post?.status || 'DRAFT',
      visibility: post?.visibility || 'PUBLIC',
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (post) {
        await updatePost(post.id, data);
      } else if (session?.user?.id) {
        await createPost(data, session.user.id);
      }
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{post ? 'Edit Post' : 'Create Post'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Title"
              {...register('title')}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>}
          </div>
          <div data-color-mode="light">
            <Controller
              name="content"
              control={control}
              render={({ field }) => <MDEditor {...field} />}
            />
          </div>
           {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message as string}</p>}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Controller
              name="visibility"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLIC">Public</SelectItem>
                    <SelectItem value="PRIVATE">Private</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
