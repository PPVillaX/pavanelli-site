import { notFound } from 'next/navigation';
import { getPostById, getBlogCategories } from '@/lib/queries';
import PostForm from '@/components/admin/PostForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;

  const [post, categories] = await Promise.all([
    getPostById(id),
    getBlogCategories(),
  ]);

  if (!post) notFound();

  const initialData = {
    id: post.id as string,
    title: post.title as string,
    slug: post.slug as string,
    excerpt: (post.excerpt as string) || '',
    content: (post.content as string) || '',
    cover_image_url: (post.cover_image_url as string) || '',
    cover_image_focal_point: (post.cover_image_focal_point as string) || '50% 50%',
    category_id: (post.category_id as string) || '',
    tags: (post.tags as string[]) || [],
    is_published: post.is_published as boolean,
    published_at: (post.published_at as string) || '',
    meta_title: (post.meta_title as string) || '',
    meta_description: (post.meta_description as string) || '',
  };

  return <PostForm initialData={initialData} isEditing categories={categories} />;
}
