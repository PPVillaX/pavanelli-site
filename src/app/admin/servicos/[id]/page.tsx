import { notFound } from 'next/navigation';
import { getServiceById } from '@/lib/queries';
import ServiceForm from '@/components/admin/ServiceForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) notFound();

  const initialData = {
    id: service.id,
    title: service.title,
    slug: service.slug,
    tagline: service.tagline || '',
    content: service.content || '',
    cover_image_url: service.cover_image_url || '',
    cover_image_focal_point: service.cover_image_focal_point || '50% 50%',
    category_filter: service.category_filter || '',
    display_order: service.display_order,
    is_active: service.is_active,
    meta_title: service.meta_title || '',
    meta_description: service.meta_description || '',
  };

  return <ServiceForm initialData={initialData} isEditing />;
}
