'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import ImageManager from '@/components/admin/ImageManager';

type Category = string;

interface ProjectImage {
  id?: string;
  url: string;
  alt_text?: string;
  display_order: number;
}

interface ProjectData {
  id?: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  year: number | null;
  area_m2: number | null;
  category: Category;
  photographer: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  cover_image_url: string;
  cover_image_focal_point: string;
  images: ProjectImage[];
}

interface Props {
  initialData?: ProjectData;
  isEditing?: boolean;
  categoryOptions?: { name: string; slug: string }[];
}

const defaultData: ProjectData = {
  title: '',
  slug: '',
  description: '',
  location: 'Uberlândia, MG',
  year: null,
  area_m2: null,
  category: 'residencial',
  photographer: '',
  is_featured: false,
  is_published: true,
  display_order: 0,
  cover_image_url: '',
  cover_image_focal_point: '50% 50%',
  images: [],
};

const DEFAULT_CATEGORIES = [
  { slug: 'residencial', name: 'Residencial' },
  { slug: 'comercial', name: 'Comercial' },
  { slug: 'fazenda', name: 'Fazenda' },
  { slug: 'reforma', name: 'Reforma' },
  { slug: 'interiores', name: 'Interiores' },
];

export default function ProjectForm({ initialData, isEditing = false, categoryOptions }: Props) {
  const categories = categoryOptions && categoryOptions.length > 0 ? categoryOptions : DEFAULT_CATEGORIES;
  const [data, setData] = useState<ProjectData>(initialData || defaultData);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setData(prev => ({
      ...prev,
      title,
      slug: !isEditing || !prev.slug ? generateSlug(title) : prev.slug,
    }));
  };

  const handleImagesChange = (images: ProjectImage[]) => {
    setData(prev => ({
      ...prev,
      images,
      cover_image_url: images.length > 0 ? images[0].url : '',
    }));
  };

  const handleSave = async () => {
    if (!data.title.trim()) { setError('Título é obrigatório.'); return; }
    if (!data.slug.trim()) { setError('Slug é obrigatório.'); return; }
    setSaving(true);
    setError('');

    try {
      const supabase = createBrowserSupabaseClient();

      const projectPayload = {
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        location: data.location || null,
        year: data.year,
        area_m2: data.area_m2,
        category: data.category,
        photographer: data.photographer || null,
        is_featured: data.is_featured,
        is_published: data.is_published,
        display_order: data.display_order,
        cover_image_url: data.cover_image_url || null,
        cover_image_focal_point: data.cover_image_focal_point || '50% 50%',
      };

      let projectId = data.id;

      if (isEditing && projectId) {
        const { error: updateError } = await supabase
          .from('projects')
          .update(projectPayload)
          .eq('id', projectId);
        if (updateError) throw updateError;
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from('projects')
          .insert(projectPayload)
          .select('id')
          .single();
        if (insertError) throw insertError;
        projectId = inserted.id;
      }

      // Sync images: delete old, insert new
      if (projectId) {
        await supabase
          .from('project_images')
          .delete()
          .eq('project_id', projectId);

        if (data.images.length > 0) {
          const imageRows = data.images.map(img => ({
            project_id: projectId,
            image_url: img.url,
            alt_text: img.alt_text || null,
            display_order: img.display_order,
          }));
          const { error: imgError } = await supabase
            .from('project_images')
            .insert(imageRows);
          if (imgError) throw imgError;
        }
      }

      router.push('/admin/projetos');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar projeto.');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!data.id || !confirm('Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.')) return;
    setDeleting(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: delError } = await supabase
        .from('projects')
        .delete()
        .eq('id', data.id);
      if (delError) throw delError;

      router.push('/admin/projetos');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir projeto.');
      setDeleting(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 border border-[#d1d5db] rounded text-brand-graphite text-[15px] outline-none transition-colors focus:border-brand-terracotta bg-white';
  const labelClass = 'block text-xs text-brand-gray uppercase tracking-[0.08em] mb-2 font-medium';

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-brand-graphite">
          {isEditing ? 'Editar projeto' : 'Novo projeto'}
        </h1>
        <div className="flex items-center gap-3">
          {isEditing && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs text-red-500 hover:text-red-700 cursor-pointer bg-transparent border-none transition-colors disabled:opacity-50"
            >
              {deleting ? 'Excluindo...' : 'Excluir projeto'}
            </button>
          )}
          <button
            onClick={() => router.push('/admin/projetos')}
            className="px-4 py-2 text-sm text-brand-gray border border-[#d1d5db] rounded cursor-pointer bg-white hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 text-sm text-white bg-brand-terracotta border-none rounded cursor-pointer hover:bg-brand-terracotta-dark transition-colors disabled:opacity-60 font-medium"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* Basic info */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 space-y-5">
          <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3">
            Informações básicas
          </h2>
          <div>
            <label className={labelClass}>Título *</label>
            <input
              type="text"
              value={data.title}
              onChange={e => handleTitleChange(e.target.value)}
              className={inputClass}
              placeholder="Ex: Casa da Oliveira"
            />
          </div>
          <div>
            <label className={labelClass}>Slug (URL)</label>
            <input
              type="text"
              value={data.slug}
              onChange={e => setData({ ...data, slug: e.target.value })}
              className={inputClass}
              placeholder="casa-da-oliveira"
            />
            <p className="text-xs text-brand-gray/60 mt-1">/portfolio/{data.slug || '...'}</p>
          </div>
          <div>
            <label className={labelClass}>Descrição</label>
            <textarea
              value={data.description}
              onChange={e => setData({ ...data, description: e.target.value })}
              className={`${inputClass} min-h-[120px] resize-y`}
              placeholder="Descrição detalhada do projeto..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Categoria *</label>
              <select
                value={data.category}
                onChange={e => setData({ ...data, category: e.target.value })}
                className={inputClass}
              >
                <option value="">Selecionar...</option>
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Localização</label>
              <input
                type="text"
                value={data.location}
                onChange={e => setData({ ...data, location: e.target.value })}
                className={inputClass}
                placeholder="Uberlândia, MG"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Ano</label>
              <input
                type="number"
                value={data.year || ''}
                onChange={e => setData({ ...data, year: e.target.value ? parseInt(e.target.value) : null })}
                className={inputClass}
                placeholder="2024"
              />
            </div>
            <div>
              <label className={labelClass}>Área (m²)</label>
              <input
                type="number"
                value={data.area_m2 || ''}
                onChange={e => setData({ ...data, area_m2: e.target.value ? parseFloat(e.target.value) : null })}
                className={inputClass}
                placeholder="350"
              />
            </div>
            <div>
              <label className={labelClass}>Fotógrafo</label>
              <input
                type="text"
                value={data.photographer}
                onChange={e => setData({ ...data, photographer: e.target.value })}
                className={inputClass}
                placeholder="Nome do fotógrafo"
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Ordem de exibição</label>
            <input
              type="number"
              value={data.display_order}
              onChange={e => setData({ ...data, display_order: parseInt(e.target.value) || 0 })}
              className={`${inputClass} max-w-[120px]`}
              min={0}
            />
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3">
            Visibilidade
          </h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.is_published}
              onChange={e => setData({ ...data, is_published: e.target.checked })}
              className="w-4 h-4 accent-brand-terracotta"
            />
            <span className="text-sm text-brand-graphite">Publicado (visível no site)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.is_featured}
              onChange={e => setData({ ...data, is_featured: e.target.checked })}
              className="w-4 h-4 accent-brand-terracotta"
            />
            <span className="text-sm text-brand-graphite">Destaque (aparece na home)</span>
          </label>
        </div>

        {/* Cover focal point */}
        {data.cover_image_url && (
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3 mb-4">
              Ponto focal da capa
            </h2>
            <p className="text-xs text-brand-gray mb-3">Clique na imagem para definir o centro de foco ao recortar.</p>
            <div
              className="relative w-full aspect-[4/3] rounded overflow-hidden cursor-crosshair select-none"
              onClick={e => {
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                setData(prev => ({ ...prev, cover_image_focal_point: `${x}% ${y}%` }));
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.cover_image_url}
                alt="Capa"
                className="w-full h-full object-cover"
                style={{ objectPosition: data.cover_image_focal_point }}
              />
              {(() => {
                const parts = (data.cover_image_focal_point || '50% 50%').split(' ');
                const x = parseFloat(parts[0]) || 50;
                const y = parseFloat(parts[1]) || 50;
                return (
                  <div
                    className="absolute w-4 h-4 rounded-full border-2 border-white shadow -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ left: `${x}%`, top: `${y}%`, backgroundColor: 'rgba(196,154,108,0.8)' }}
                  />
                );
              })()}
            </div>
            <p className="text-xs text-brand-gray/60 mt-2">Ponto: {data.cover_image_focal_point}</p>
          </div>
        )}

        {/* Images */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3 mb-4">
            Imagens
          </h2>
          <ImageManager
            images={data.images}
            projectId={data.id}
            onChange={handleImagesChange}
          />
        </div>
      </div>
    </div>
  );
}
