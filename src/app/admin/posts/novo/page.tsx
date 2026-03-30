import { getBlogCategories } from '@/lib/queries';
import PostForm from '@/components/admin/PostForm';

export default async function NewPostPage() {
  const categories = await getBlogCategories();
  return <PostForm categories={categories} />;
}
