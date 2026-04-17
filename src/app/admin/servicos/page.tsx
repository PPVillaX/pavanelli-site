import Link from 'next/link';
import { getAllServices } from '@/lib/queries';

export default async function AdminServicosPage() {
  const services = await getAllServices();

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-brand-graphite">Serviços</h1>
        <Link
          href="/admin/servicos/new"
          className="px-5 py-2 bg-brand-terracotta text-white text-sm font-medium rounded no-underline hover:bg-brand-terracotta-dark transition-colors"
        >
          + Novo serviço
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-10 text-center">
          <p className="text-brand-gray text-sm mb-4">Nenhum serviço cadastrado ainda.</p>
          <Link href="/admin/servicos/new" className="text-brand-terracotta text-sm font-medium no-underline hover:underline">
            Criar primeiro serviço →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-[#e5e7eb]">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-brand-gray uppercase tracking-[0.08em] font-medium">Ordem</th>
                <th className="text-left px-5 py-3 text-xs text-brand-gray uppercase tracking-[0.08em] font-medium">Título</th>
                <th className="text-left px-5 py-3 text-xs text-brand-gray uppercase tracking-[0.08em] font-medium">Slug</th>
                <th className="text-left px-5 py-3 text-xs text-brand-gray uppercase tracking-[0.08em] font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {services.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-brand-gray text-center">{s.display_order}</td>
                  <td className="px-5 py-3 font-medium text-brand-graphite">{s.title}</td>
                  <td className="px-5 py-3 text-brand-gray font-mono text-xs">/servicos/{s.slug}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/servicos/${s.id}`} className="text-xs text-brand-terracotta no-underline hover:underline font-medium">
                      Editar →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
