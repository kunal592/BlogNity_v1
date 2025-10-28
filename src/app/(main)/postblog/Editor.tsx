'use client';

import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { createPost } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { aiSEOBlog } from '@/ai/flows/ai-seo-blog';
import { Loader2, Wand2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function Editor() {
  const { theme } = useTheme();
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('**Hello world!!!**');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleSave = async (status: 'draft' | 'published') => {
    if (!user) {
      toast({ title: 'You must be logged in to post.', variant: 'destructive' });
      return;
    }
    if (!title || !content) {
      toast({ title: 'Title and content are required.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      await createPost({
        title,
        content,
        authorId: user.id,
        status,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        excerpt: content.substring(0, 150) + '...',
        thumbnailUrl: `https://picsum.photos/seed/${Date.now()}/600/400`,
      });
      toast({ title: `Post ${status === 'draft' ? 'saved as draft' : 'published'}!` });
      router.push('/dashboard');
    } catch (error) {
      toast({ title: 'Failed to save post.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSeoOptimize = async () => {
    setIsOptimizing(true);
    try {
      const result = await aiSEOBlog({ title, content, keywords: tags });
      setTitle(result.optimizedTitle);
      setContent(result.optimizedContent);
      toast({ title: 'AI SEO Optimization Applied!', description: `Meta Description: ${result.metaDescription}` });
    } catch (error) {
      console.error(error);
      toast({ title: 'AI Optimization failed.', description: 'Using mock data instead.', variant: 'destructive' });
      setTitle(title + ' (SEO Optimized)');
      setContent(content + '\n\n*This content has been optimized for SEO by our AI.*');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Input
        placeholder="Post Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-2xl h-14 font-bold"
      />
      <div data-color-mode={theme}>
        <MDEditor
          value={content}
          onChange={(val) => setContent(val || '')}
          height={500}
          preview="live"
        />
      </div>
      <Textarea
        placeholder="Tags (comma-separated, e.g., react, nextjs, webdev)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <div className="flex justify-end gap-4">
        <Button 
          variant="outline" 
          onClick={handleSeoOptimize}
          disabled={isOptimizing || isSubmitting}
        >
          {isOptimizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          AI SEO Optimize
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => handleSave('draft')}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Draft
        </Button>
        <Button 
          onClick={() => handleSave('published')}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Publish
        </Button>
      </div>
    </div>
  );
}
