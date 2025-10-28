'use client';

import Editor from './Editor';

export default function PostBlogPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <Editor />
    </div>
  );
}
