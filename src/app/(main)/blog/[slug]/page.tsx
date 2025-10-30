import { getPost } from '@/lib/api';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import BlogPostPageClient from './BlogPostPageClient';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Revalidate the page every hour
export const revalidate = 3600;

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const post = await getPost(slug);

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
  const { slug } = params;
  const session = await getServerSession(authOptions);
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  if (post.isExclusive && !(session?.user as any)?.hasPaidAccess) {
    redirect('/membership');
  }

  return <BlogPostPageClient post={post} />;
}
