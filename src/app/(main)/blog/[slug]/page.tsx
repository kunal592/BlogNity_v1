
import { getPost } from '@/lib/api';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import BlogPostPageClient from './BlogPostPageClient';
import { auth } from '@/lib/auth';

// Revalidate the page every hour
export const revalidate = 3600;

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const excerpt = post.content ? post.content.substring(0, 150) + '...' : 'A post from our blog.';

  return {
    title: post.title,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const session = await auth();
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  if (post.isExclusive && !(session?.user as any)?.hasPaidAccess) {
    redirect('/membership');
  }

  return <BlogPostPageClient post={post} />;
}
