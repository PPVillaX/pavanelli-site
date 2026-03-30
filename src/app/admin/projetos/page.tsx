import Link from 'next/link';
import Image from 'next/image';
import { getAllProjects } from '@/lib/queries';

const categoryLabels: Record<string, string> = {
  residencial: 'Residencial',
  comercial: 'Comercial',
  fazenda: 'Fazenda',
  reforma: 'Reforma',
  interiores: 'Interiores',
};

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-brand-graphite">
          Projetos
        </h1>
        <Link
          href="/admin/projetos/novo"
          className="px-5 py-2.5 text-sm text-white bg-brand-terracotta border-none rounded no-underline hover:bg-brand-terracotta-dark transition-colors font-medium"
        >
          + Novo projeto
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-[#e5e7eb]">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-[0.08em]">Projeto</th>
              <th className="px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-[0.08em] hidden md:table-cell">Categoria</th>
              <th className="px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-[0.08em] hidden md:table-cell">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-[0.08em] hidden md:table-cell">Destaque</th>
              <th className="px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-[0.08em]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {projects?.map(project => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-brand-cream overflow-hidden shrink-0 relative">
                      {project.cover_image_url && (
                        <Image
                          src={project.cover_image_url}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                          unoptimized
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-brand-graphite">{project.title}</div>
                      <div className="text-xs text-brand-gray">{project.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="text-xs text-brand-gray bg-gray-100 px-2 py-1 rounded">
                    {categoryLabels[project.category] || project.category}
                  </span>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                    project.is_published
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${project.is_published ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {project.is_published ? 'Publicado' : 'Rascunho'}
                  </span>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  {project.is_featured && (
                    <span className="text-brand-terracotta text-sm">★</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/projetos/${project.id}`}
                      className="text-xs text-brand-terracotta hover:underline no-underline font-medium"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/portfolio/${project.slug}`}
                      target="_blank"
                      className="text-xs text-brand-gray hover:text-brand-graphite no-underline"
                    >
                      Ver ↗
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
