import { getPosts } from '@/lib/api';
import ExclusivePageClient from './ExclusivePageClient';

export default async function ExclusivePage() {
  const exclusivePosts = await getPosts({ isExclusive: true });

  return (
    <ExclusivePageClient initialPosts={exclusivePosts} />
  );
}
