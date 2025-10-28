import { getPosts, getUsers } from '@/lib/api';
import ViewToggle from './ViewToggle';
import BlogList from './BlogList';

export default async function HomePage() {
  const posts = await getPosts();
  const users = await getUsers();

  const postsWithAuthors = posts.map(post => {
    const author = users.find(user => user.id === post.authorId);
    return { ...post, author };
  });

  return (
    <div className="container mx-auto">
      <BlogList posts={postsWithAuthors} />
    </div>
  );
}
