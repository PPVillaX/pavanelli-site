import LocationForm from '@/components/admin/LocationForm';
import { getAllLocations } from '@/lib/queries';

export default async function NewLocationPage() {
  const allLocations = await getAllLocations();
  return <LocationForm parentOptions={allLocations} />;
}
