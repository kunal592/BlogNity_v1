import { getPosts } from '@/lib/api';
import ViewToggle from './ViewToggle';

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto">
      <ViewToggle posts={posts} listTitle="Public Feed" />
    </div>
  );
}
