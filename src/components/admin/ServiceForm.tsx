'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import dynamic from 'next/dynamic';

const TipTapEditor = dynamic(() => import('@/components/admin/TipTapEditor'), { ssr: false });

interface ServiceData {
  id?: string;
  title: string;
  slug: string;
  tagline: string;
  content: string;
  cover_image_url: string;
  cover_image_focal_point: string;
  category_filter: string;
  display_order: number;
  is_active: boolean;
  meta_title: string;
  meta_description: string;
}

interface Props {
  initialData?: ServiceData;
  isEditing?: boolean;
}

const defaultData: ServiceData = {
  title: '',
  slug: '',
  tagline: '',
  content: '',
  cover_image_url: '',
  cover_image_focal_point: '50% 50%',
  category_filter: '',
  display_order: 0,
  is_active: true,
  meta_title: '',
  meta_description: '',
};

const CATEGORY_OPTIONS = [
  { value: '', label: 'Nenhuma' },
  { value: 'residencial', label: 'Residencial' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'fazenda', label: 'Fazenda' },
  { value: 'interiores', label: 'Interiores' },
  { value: 'reforma', label: 'Reforma' },
];

export default function ServiceForm({ initialData, isEditing = false }: Props) {
  const [data, setData] = useState<ServiceData>(initialData || defaultData);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [coverUploading, setCoverUploading] = useState(false);
  const router = useRouter();

  const generateSlug = (title: string) =>
    title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const handleTitleChange = (title: string) => {
    setData(prev => ({
      ...prev,
      title,
      slug: !isEditing || !prev.slug ? generateSlug(title) : prev.slug,
    }));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'services');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (res.ok) {
        setData(prev => ({ ...prev, cover_image_url: result.url }));
      } else {
        setError(result.error || 'Erro ao fazer upload da imagem.');
      }
    } catch {
      setError('Erro ao fazer upload da imagem.');
    }
    setCoverUploading(false);
  };

  const handleSave = async () => {
    if (!data.title.trim()) { setError('Título é obrigatório.'); return; }
    setSaving(true);
    setError('');
    try {
      const supabase = createBrowserSupabaseClient();
      const payload = {
        title: data.title,
        slug: data.slug,
        tagline: data.tagline || null,
        content: data.content || null,
        cover_image_url: data.cover_image_url || null,
        cover_image_focal_point: data.cover_image_focal_point || '50% 50%',
        category_filter: data.category_filter || null,
        display_order: data.display_order,
        is_active: data.is_active,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
      };
      if (isEditing && data.id) {
        const { error: e } = await supabase.from('services').update(payload).eq('id', data.id);
        if (e) throw e;
      } else {
        const { error: e } = await supabase.from('services').insert(payload);
        if (e) throw e;
      }
      try { await fetch('/api/revalidate', { method: 'POST' }); } catch { /* non-critical */ }
      router.push('/admin/servicos');
      router.refresh();
    } catch (err) {
      setError((err as any)?.message || 'Erro ao salvar serviço.');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!data.id || !confirm('Excluir este serviço?')) return;
    setDeleting(true);
    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.from('services').delete().eq('id', data.id);
      router.push('/admin/servicos');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir serviço.');
      setDeleting(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 border border-[#d1d5db] rounded text-brand-graphite text-[15px] outline-none transition-colors focus:border-brand-terracotta bg-white';
  const labelClass = 'block text-xs text-brand-gray uppercase tracking-[0.08em] mb-2 font-medium';

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-brand-graphite">
          {isEditing ? 'Editar serviço' : 'Novo serviço'}
        </h1>
        <div className="flex items-center gap-3">
          {isEditing && (
            <button onClick={handleDelete} disabled={deleting}
              className="text-xs text-red-500 hover:text-red-700 cursor-pointer bg-transparent border-none">
              {deleting ? 'Excluindo...' : 'Excluir'}
            </button>
          )}
          <button onClick={() => router.push('/admin/servicos')}
            className="px-4 py-2 text-sm text-brand-gray border border-[#d1d5db] rounded cursor-pointer bg-white hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2 text-sm text-white bg-brand-terracotta border-none rounded cursor-pointer hover:bg-brand-terracotta-dark disabled:opacity-60 font-medium">
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-6">{error}</div>}

      <div className="space-y-8">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 space-y-5">
          <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3">Informações</h2>
          <div>
            <label className={labelClass}>Título *</label>
            <input type="text" value={data.title} onChange={e => handleTitleChange(e.target.value)} className={inputClass} placeholder="Ex: Projetos Residenciais" />
          </div>
          <div>
            <label className={labelClass}>Slug (URL)</label>
            <input type="text" value={data.slug} onChange={e => setData({ ...data, slug: e.target.value })} className={inputClass} />
            <p className="text-xs text-brand-gray/60 mt-1">/servicos/{data.slug || '...'}</p>
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input type="text" value={data.tagline} onChange={e => setData({ ...data, tagline: e.target.value })} className={inputClass} placeholder="Frase curta de destaque" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Categoria do portfólio</label>
              <select value={data.category_filter} onChange={e => setData({ ...data, category_filter: e.target.value })} className={inputClass}>
                {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <p className="text-xs text-brand-gray/60 mt-1">Filtra projetos relacionados</p>
            </div>
            <div>
              <label className={labelClass}>Ordem de exibição</label>
              <input type="number" value={data.display_order} onChange={e => setData({ ...data, display_order: Number(e.target.value) })} className={inputClass} min={0} />
            </div>
          </div>
        </div>

        {/* Cover image */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3 mb-4">Imagem de capa</h2>
          {data.cover_image_url && (
            <>
              <p className="text-xs text-brand-gray mb-2">Clique na imagem para ajustar o enquadramento</p>
              <div
                className="relative aspect-video rounded overflow-hidden bg-gray-100 mb-3 cursor-crosshair select-none"
                onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                  const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                  setData(prev => ({ ...prev, cover_image_focal_point: `${x}% ${y}%` }));
                }}
              >
                <img src={data.cover_image_url} alt="Capa" className="w-full h-full object-cover pointer-events-none" style={{ objectPosition: data.cover_image_focal_point }} />
                {(() => {
                  const match = data.cover_image_focal_point.match(/^(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
                  const x = match ? parseFloat(match[1]) : 50;
                  const y = match ? parseFloat(match[2]) : 50;
                  return <div className="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg pointer-events-none -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%`, background: 'rgba(194,80,56,0.85)' }} />;
                })()}
                <button onClick={e => { e.stopPropagation(); setData({ ...data, cover_image_url: '', cover_image_focal_point: '50% 50%' }); }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white text-sm flex items-center justify-center cursor-pointer border-none hover:bg-red-600">✕</button>
              </div>
            </>
          )}
          <label className="inline-block px-4 py-2 text-sm text-brand-terracotta border border-brand-terracotta rounded cursor-pointer hover:bg-brand-terracotta/5 transition-colors">
            {coverUploading ? 'Enviando...' : '📷 Escolher imagem'}
            <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
          </label>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3 mb-4">Conteúdo</h2>
          <TipTapEditor content={data.content} onChange={content => setData({ ...data, content })} />
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 space-y-5">
          <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3">SEO</h2>
          <div>
            <label className={labelClass}>Meta título</label>
            <input type="text" value={data.meta_title} onChange={e => setData({ ...data, meta_title: e.target.value })} className={inputClass} placeholder="Título para buscadores" />
          </div>
          <div>
            <label className={labelClass}>Meta descrição</label>
            <textarea value={data.meta_description} onChange={e => setData({ ...data, meta_description: e.target.value })} className={`${inputClass} min-h-[60px] resize-y`} placeholder="Descrição para buscadores..." />
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={data.is_active} onChange={e => setData({ ...data, is_active: e.target.checked })} className="w-4 h-4 accent-brand-terracotta" />
            <span className="text-sm text-brand-graphite font-medium">Ativo (visível no site)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
