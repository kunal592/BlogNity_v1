import { getPosts, getUsers } from '@/lib/api';
import ExclusivePageClient from './ExclusivePageClient';

export default async function ExclusivePage() {
  const allPosts = await getPosts();
  const allUsers = await getUsers();

  const exclusivePosts = allPosts.filter(post => post.isExclusive);

  const exclusivePostsWithAuthors = exclusivePosts.map(post => {
    const author = allUsers.find(u => u.id === post.authorId);
    return { ...post, author };
  });

  return (
    <ExclusivePageClient initialPosts={exclusivePostsWithAuthors} />
  );
}
