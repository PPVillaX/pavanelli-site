'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import dynamic from 'next/dynamic';

const TipTapEditor = dynamic(() => import('@/components/admin/TipTapEditor'), { ssr: false });

interface PostData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  cover_image_focal_point: string;
  category_id: string;
  tags: string[];
  is_published: boolean;
  published_at: string;
  meta_title: string;
  meta_description: string;
}

function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return new Date().toISOString().slice(0, 16);
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 16);
}

interface Props {
  initialData?: PostData;
  isEditing?: boolean;
  categories: { id: string; name: string; slug: string }[];
}

const defaultData: PostData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  cover_image_focal_point: '50% 50%',
  category_id: '',
  tags: [],
  is_published: false,
  published_at: new Date().toISOString().slice(0, 16),
  meta_title: '',
  meta_description: '',
};

export default function PostForm({ initialData, isEditing = false, categories }: Props) {
  const [data, setData] = useState<PostData>(() => {
    const base = initialData || defaultData;
    return {
      ...base,
      published_at: toDatetimeLocal((base as any).published_at),
    };
  });
  const [tagInput, setTagInput] = useState('');
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

  const handleAddTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      setData({ ...data, tags: [...data.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setData({ ...data, tags: data.tags.filter(t => t !== tag) });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'blog');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (res.ok) {
        setData(prev => ({ ...prev, cover_image_url: result.url }));
      } else {
        setError(result.error || 'Erro ao fazer upload da imagem.');
      }
    } catch (err) {
      setError('Erro ao fazer upload da imagem.');
      console.error(err);
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
        excerpt: data.excerpt || null,
        content: data.content || null,
        cover_image_url: data.cover_image_url || null,
        cover_image_focal_point: data.cover_image_focal_point || '50% 50%',
        category_id: data.category_id || null,
        tags: data.tags,
        is_published: data.is_published,
        published_at: data.is_published
          ? (data.published_at ? new Date(data.published_at).toISOString() : new Date().toISOString())
          : null,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
      };

      if (isEditing && data.id) {
        const { error: updateError } = await supabase.from('blog_posts').update(payload).eq('id', data.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('blog_posts').insert(payload);
        if (insertError) throw insertError;
      }

      try { await fetch('/api/revalidate', { method: 'POST' }); } catch { /* non-critical */ }
      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      setError((err as any)?.message || 'Erro ao salvar post.');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!data.id || !confirm('Excluir este post?')) return;
    setDeleting(true);
    try {
      const supabase = createBrowserSupabaseClient();
      await supabase.from('blog_posts').delete().eq('id', data.id);
      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir post.');
      setDeleting(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 border border-[#d1d5db] rounded text-brand-graphite text-[15px] outline-none transition-colors focus:border-brand-terracotta bg-white';
  const labelClass = 'block text-xs text-brand-gray uppercase tracking-[0.08em] mb-2 font-medium';

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-brand-graphite">
          {isEditing ? 'Editar post' : 'Novo post'}
        </h1>
        <div className="flex items-center gap-3">
          {isEditing && (
            <button onClick={handleDelete} disabled={deleting}
              className="text-xs text-red-500 hover:text-red-700 cursor-pointer bg-transparent border-none">
              {deleting ? 'Excluindo...' : 'Excluir'}
            </button>
          )}
          <button onClick={() => router.push('/admin/posts')}
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
            <input type="text" value={data.title} onChange={e => handleTitleChange(e.target.value)} className={inputClass} placeholder="Título do post" />
          </div>
          <div>
            <label className={labelClass}>Slug (URL)</label>
            <input type="text" value={data.slug} onChange={e => setData({ ...data, slug: e.target.value })} className={inputClass} />
            <p className="text-xs text-brand-gray/60 mt-1">/blog/{data.slug || '...'}</p>
          </div>
          <div>
            <label className={labelClass}>Resumo</label>
            <textarea value={data.excerpt} onChange={e => setData({ ...data, excerpt: e.target.value })} className={`${inputClass} min-h-[80px] resize-y`} placeholder="Resumo curto para listagens..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Categoria</label>
              <select value={data.category_id} onChange={e => setData({ ...data, category_id: e.target.value })} className={inputClass}>
                <option value="">Selecionar...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Tags</label>
              <div className="flex gap-2">
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} className={inputClass} placeholder="Adicionar tag..." />
                <button onClick={handleAddTag} className="px-3 py-2 text-sm bg-gray-100 rounded cursor-pointer border-none hover:bg-gray-200">+</button>
              </div>
              {data.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {data.tags.map(tag => (
                    <span key={tag} className="text-xs bg-brand-terracotta/10 text-brand-terracotta px-2 py-1 rounded-full flex items-center gap-1">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="text-brand-terracotta/60 hover:text-brand-terracotta cursor-pointer bg-transparent border-none text-xs">✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cover image */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3 mb-4">Imagem de capa</h2>
          {data.cover_image_url ? (
            <>
              <p className="text-xs text-brand-gray mb-2">Clique na imagem para ajustar o enquadramento</p>
              <div
                className="relative aspect-video rounded overflow-hidden bg-gray-100 mb-3 cursor-crosshair select-none"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                  const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                  setData(prev => ({ ...prev, cover_image_focal_point: `${x}% ${y}%` }));
                }}
              >
                <img
                  src={data.cover_image_url}
                  alt="Capa"
                  className="w-full h-full object-cover pointer-events-none"
                  style={{ objectPosition: data.cover_image_focal_point }}
                />
                {/* Focal point crosshair */}
                {(() => {
                  const raw = data.cover_image_focal_point || '50% 50%';
                  const match = raw.match(/^(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
                  const x = match ? parseFloat(match[1]) : 50;
                  const y = match ? parseFloat(match[2]) : 50;
                  return (
                    <div
                      className="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg pointer-events-none -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${x}%`, top: `${y}%`, background: 'rgba(194,80,56,0.85)' }}
                    />
                  );
                })()}
                <button
                  onClick={(e) => { e.stopPropagation(); setData({ ...data, cover_image_url: '', cover_image_focal_point: '50% 50%' }); }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white text-sm flex items-center justify-center cursor-pointer border-none hover:bg-red-600"
                >✕</button>
              </div>
            </>
          ) : null}
          <label className="inline-block px-4 py-2 text-sm text-brand-terracotta border border-brand-terracotta rounded cursor-pointer hover:bg-brand-terracotta/5 transition-colors">
            {coverUploading ? 'Enviando...' : '📷 Escolher imagem'}
            <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
          </label>
        </div>

        {/* Content (TipTap) */}
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
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={data.is_published} onChange={e => setData({ ...data, is_published: e.target.checked })} className="w-4 h-4 accent-brand-terracotta" />
            <span className="text-sm text-brand-graphite font-medium">Publicar</span>
          </label>
          {data.is_published && (
            <div>
              <label className={labelClass}>Data de publicação</label>
              <input
                type="datetime-local"
                value={data.published_at}
                onChange={e => setData({ ...data, published_at: e.target.value })}
                className={inputClass}
              />
              <p className="text-xs text-brand-gray/60 mt-1">Data que aparecerá no post publicado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
