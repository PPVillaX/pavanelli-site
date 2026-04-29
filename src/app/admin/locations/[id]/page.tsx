import { notFound } from 'next/navigation';
import { getLocationById, getAllLocations } from '@/lib/queries';
import LocationForm from '@/components/admin/LocationForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLocationPage({ params }: Props) {
  const { id } = await params;
  const [location, allLocations] = await Promise.all([
    getLocationById(id),
    getAllLocations(),
  ]);
  if (!location) notFound();

  const initialData = {
    id: location.id,
    slug: location.slug,
    name: location.name,
    type: location.type,
    subtype: location.subtype || '',
    city: location.city,
    intro: location.intro || '',
    content: location.content || '',
    match_keys: location.match_keys || [],
    parent_location_id: location.parent_location_id,
    cover_image_url: location.cover_image_url || '',
    cover_image_focal_point: location.cover_image_focal_point || '50% 50%',
    meta_title: location.meta_title || '',
    meta_description: location.meta_description || '',
    display_order: location.display_order,
    is_published: location.is_published,
  };

  return <LocationForm initialData={initialData} isEditing parentOptions={allLocations} />;
}
