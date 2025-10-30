
import { getPostById } from '@/lib/api';
import Editor from '@/components/Editor';

interface EditorPageProps {
  params: {
    id: string;
  };
}

export default async function EditorPage({ params }: EditorPageProps) {
  const post = await getPostById(params.id);

  if (!post) {
    return <div>Post not found</div>;
  }

  return <Editor post={post} />;
}
