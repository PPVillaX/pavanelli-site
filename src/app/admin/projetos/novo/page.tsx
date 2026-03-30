import { getProjectCategories } from '@/lib/queries';
import ProjectForm from '@/components/admin/ProjectForm';

export default async function NewProjectPage() {
  const categories = await getProjectCategories();
  return <ProjectForm categoryOptions={categories} />;
}
