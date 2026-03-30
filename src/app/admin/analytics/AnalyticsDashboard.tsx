'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Summary {
  whatsapp_clicks: number;
  project_views: number;
  contact_submits: number;
  conversion_rate: number;
}

interface EngagementRow {
  project_slug: string;
  whatsapp_clicks: number;
  views: number;
  lightbox_opens: number;
  conversion_rate: number;
}

interface Funnel {
  unique_sessions: number;
  project_views: number;
  whatsapp_clicks: number;
}

interface Props {
  summary: Summary;
  engagement: EngagementRow[];
  funnel: Funnel;
  days: number;
}

type SortKey = 'project_slug' | 'views' | 'whatsapp_clicks' | 'conversion_rate';

export function AnalyticsDashboard({ summary, engagement, funnel, days }: Props) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>('views');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  function handlePeriod(d: number) {
    router.push(`/admin/analytics?days=${d}`);
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sortedEngagement = [...engagement].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === 'string' && typeof bv === 'string') {
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  const maxFunnelValue = Math.max(funnel.unique_sessions, 1);

  const summaryCards = [
    { label: 'Cliques WhatsApp', value: summary.whatsapp_clicks },
    { label: 'Visualizações de projetos', value: summary.project_views },
    { label: 'Contatos enviados', value: summary.contact_submits },
    { label: 'Taxa de conversão', value: `${summary.conversion_rate.toFixed(1)}%` },
  ];

  const periodButtons = [
    { label: '7d', value: 7 },
    { label: '30d', value: 30 },
    { label: '90d', value: 90 },
  ];

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return ' ↕';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  };

  const funnelStages = [
    {
      label: 'Sessões únicas',
      value: funnel.unique_sessions,
      pct: null,
    },
    {
      label: 'Projetos abertos',
      value: funnel.project_views,
      pct: funnel.unique_sessions > 0
        ? ((funnel.project_views / funnel.unique_sessions) * 100).toFixed(1)
        : '0.0',
    },
    {
      label: 'WhatsApp clicado',
      value: funnel.whatsapp_clicks,
      pct: funnel.project_views > 0
        ? ((funnel.whatsapp_clicks / funnel.project_views) * 100).toFixed(1)
        : '0.0',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Period filter */}
      <div className="flex items-center gap-2">
        {periodButtons.map(btn => (
          <button
            key={btn.value}
            onClick={() => handlePeriod(btn.value)}
            className={`px-4 py-2 text-sm rounded-md border transition-colors cursor-pointer ${
              days === btn.value
                ? 'bg-brand-terracotta text-white border-brand-terracotta font-medium'
                : 'bg-white text-brand-gray border-[#e5e7eb] hover:border-brand-terracotta/50 hover:text-brand-graphite'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <div
            key={card.label}
            className="bg-white border border-brand-cream rounded-xl p-6"
          >
            <div className="text-3xl font-bold text-brand-graphite">{card.value}</div>
            <div className="text-xs text-brand-gray mt-2 leading-snug">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Project ranking table */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e5e7eb]">
          <h2 className="text-sm font-semibold text-brand-graphite">Ranking de projetos</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-[#e5e7eb]">
            <tr>
              <th
                className="px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-[0.08em] cursor-pointer hover:text-brand-graphite select-none"
                onClick={() => handleSort('project_slug')}
              >
                Projeto{sortIcon('project_slug')}
              </th>
              <th
                className="px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-[0.08em] cursor-pointer hover:text-brand-graphite select-none"
                onClick={() => handleSort('views')}
              >
                Visualizações{sortIcon('views')}
              </th>
              <th
                className="px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-[0.08em] cursor-pointer hover:text-brand-graphite select-none hidden md:table-cell"
                onClick={() => handleSort('whatsapp_clicks')}
              >
                Cliques WhatsApp{sortIcon('whatsapp_clicks')}
              </th>
              <th
                className="px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-[0.08em] cursor-pointer hover:text-brand-graphite select-none hidden md:table-cell"
                onClick={() => handleSort('conversion_rate')}
              >
                Conversão %{sortIcon('conversion_rate')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {sortedEngagement.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm text-brand-gray">
                  Sem dados para o período selecionado
                </td>
              </tr>
            ) : (
              sortedEngagement.map(row => (
                <tr key={row.project_slug} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm text-brand-graphite font-medium">
                    {row.project_slug}
                  </td>
                  <td className="px-5 py-4 text-sm text-brand-gray">
                    {row.views}
                  </td>
                  <td className="px-5 py-4 text-sm text-brand-gray hidden md:table-cell">
                    {row.whatsapp_clicks}
                  </td>
                  <td className="px-5 py-4 text-sm text-brand-gray hidden md:table-cell">
                    {row.conversion_rate.toFixed(1)}%
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Conversion funnel */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
        <h2 className="text-sm font-semibold text-brand-graphite mb-6">Funil de conversão</h2>
        <div className="space-y-5">
          {funnelStages.map(stage => (
            <div key={stage.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-brand-graphite">{stage.label}</span>
                <span className="text-sm text-brand-gray">
                  {stage.value.toLocaleString('pt-BR')}
                  {stage.pct !== null && (
                    <span className="text-brand-terracotta ml-2">({stage.pct}%)</span>
                  )}
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-terracotta rounded-full transition-all duration-700"
                  style={{
                    width: `${maxFunnelValue > 0 ? (stage.value / maxFunnelValue) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
