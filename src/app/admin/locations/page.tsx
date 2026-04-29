import Link from 'next/link';
import { getAllLocations } from '@/lib/queries';

export default async function AdminLocationsPage() {
  const locations = await getAllLocations();

  const bairros = locations.filter(l => l.type === 'bairro');
  const empreendimentos = locations.filter(l => l.type === 'empreendimento');

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-graphite">Localizações</h1>
          <p className="text-xs text-brand-gray mt-1">
            Páginas em /uberlandia/[slug] para SEO local. Bairros e empreendimentos.
          </p>
        </div>
        <Link
          href="/admin/locations/new"
          className="px-5 py-2 bg-brand-terracotta text-white text-sm font-medium rounded no-underline hover:bg-brand-terracotta-dark transition-colors"
        >
          + Nova localização
        </Link>
      </div>

      {locations.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-10 text-center">
          <p className="text-brand-gray text-sm mb-4">Nenhuma localização cadastrada ainda.</p>
          <Link href="/admin/locations/new" className="text-brand-terracotta text-sm font-medium no-underline hover:underline">
            Criar primeira localização →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {[
            { label: 'Bairros', items: bairros },
            { label: 'Empreendimentos', items: empreendimentos },
          ].map(group => group.items.length > 0 && (
            <div key={group.label}>
              <h2 className="text-sm font-semibold text-brand-graphite uppercase tracking-[0.08em] mb-3">
                {group.label} ({group.items.length})
              </h2>
              <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs text-brand-gray uppercase tracking-[0.08em] font-medium">Ordem</th>
                      <th className="text-left px-5 py-3 text-xs text-brand-gray uppercase tracking-[0.08em] font-medium">Nome</th>
                      <th className="text-left px-5 py-3 text-xs text-brand-gray uppercase tracking-[0.08em] font-medium">Subtipo</th>
                      <th className="text-left px-5 py-3 text-xs text-brand-gray uppercase tracking-[0.08em] font-medium">Slug</th>
                      <th className="text-left px-5 py-3 text-xs text-brand-gray uppercase tracking-[0.08em] font-medium">Match keys</th>
                      <th className="text-left px-5 py-3 text-xs text-brand-gray uppercase tracking-[0.08em] font-medium">Status</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb]">
                    {group.items.map(loc => (
                      <tr key={loc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-brand-gray text-center">{loc.display_order}</td>
                        <td className="px-5 py-3 font-medium text-brand-graphite">{loc.name}</td>
                        <td className="px-5 py-3 text-brand-gray text-xs">{loc.subtype || '—'}</td>
                        <td className="px-5 py-3 text-brand-gray font-mono text-xs">/uberlandia/{loc.slug}</td>
                        <td className="px-5 py-3 text-brand-gray text-xs">
                          {loc.match_keys.length === 0 ? (
                            <span className="text-orange-500">⚠️ vazio</span>
                          ) : (
                            <span title={loc.match_keys.join(', ')}>{loc.match_keys.length} chave(s)</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${loc.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {loc.is_published ? 'Publicado' : 'Rascunho'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Link href={`/admin/locations/${loc.id}`} className="text-xs text-brand-terracotta no-underline hover:underline font-medium">
                            Editar →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
