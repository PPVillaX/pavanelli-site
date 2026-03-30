import { getBlogCategories, getProjectCategories } from '@/lib/queries';
import CategoriesAdmin from './CategoriesAdmin';

export default async function CategoriesPage() {
  const [blogCategories, projectCategories] = await Promise.all([
    getBlogCategories(),
    getProjectCategories(),
  ]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-display font-bold text-brand-graphite mb-8">Categorias</h1>
      <CategoriesAdmin
        title="Categorias de Projetos"
        table="project_categories"
        initialCategories={projectCategories}
      />
      <CategoriesAdmin
        title="Categorias do Blog"
        table="blog_categories"
        initialCategories={blogCategories}
      />
    </div>
  );
}
