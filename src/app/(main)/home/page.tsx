import { getPosts } from '@/lib/api';
import ViewToggle from './ViewToggle';
import BlogList from './BlogList';

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto">
      <BlogList posts={posts} />
    </div>
  );
}
