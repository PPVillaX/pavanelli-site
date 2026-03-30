import { notFound } from 'next/navigation';
import { getProjectById, getProjectCategories } from '@/lib/queries';
import ProjectForm from '@/components/admin/ProjectForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const [project, categoryOptions] = await Promise.all([
    getProjectById(id),
    getProjectCategories(),
  ]);
  if (!project) notFound();

  const sortedImages = [...(project.project_images || [])].sort((a, b) => a.display_order - b.display_order);

  const initialData = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description || '',
    location: project.location || 'Uberlândia, MG',
    year: project.year,
    area_m2: project.area_m2,
    category: project.category,
    photographer: project.photographer || '',
    is_featured: project.is_featured,
    is_published: project.is_published,
    display_order: project.display_order,
    cover_image_url: project.cover_image_url || '',
    cover_image_focal_point: project.cover_image_focal_point || '50% 50%',
    images: sortedImages.map(img => ({
      id: img.id,
      url: img.image_url,
      alt_text: img.alt_text || undefined,
      display_order: img.display_order,
    })),
  };

  return <ProjectForm initialData={initialData} isEditing categoryOptions={categoryOptions} />;
}
