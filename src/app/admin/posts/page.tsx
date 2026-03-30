import { getAllPosts } from '@/lib/queries';
import AdminPostsList from './posts-list';

export default async function AdminPostsPage() {
  const posts = await getAllPosts();
  return <AdminPostsList posts={posts} />;
}
