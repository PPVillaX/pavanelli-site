'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import dynamic from 'next/dynamic';
import type { DbLocation } from '@/lib/types';

const TipTapEditor = dynamic(() => import('@/components/admin/TipTapEditor'), { ssr: false });

interface LocationFormData {
  id?: string;
  slug: string;
  name: string;
  type: 'bairro' | 'empreendimento';
  subtype: string;
  city: string;
  intro: string;
  content: string;
  match_keys: string[];
  parent_location_id: string | null;
  cover_image_url: string;
  cover_image_focal_point: string;
  meta_title: string;
  meta_description: string;
  display_order: number;
  is_published: boolean;
}

interface Props {
  initialData?: LocationFormData;
  isEditing?: boolean;
  /** Locations disponíveis para serem usadas como parent (exclui a própria, se editando). */
  parentOptions: DbLocation[];
}

const defaultData: LocationFormData = {
  slug: '',
  name: '',
  type: 'bairro',
  subtype: '',
  city: 'Uberlândia',
  intro: '',
  content: '',
  match_keys: [],
  parent_location_id: null,
  cover_image_url: '',
  cover_image_focal_point: '50% 50%',
  meta_title: '',
  meta_description: '',
  display_order: 0,
  is_published: false,
};

const SUBTYPE_SUGGESTIONS = [
  'Condomínio',
  'Centro Comercial',
  'Edifício Comercial',
  'Edifício Residencial',
  'Incorporadora',
  'Loteamento',
];

export default function LocationForm({ initialData, isEditing = false, parentOptions }: Props) {
  const [data, setData] = useState<LocationFormData>(initialData || defaultData);
  const [matchKeyInput, setMatchKeyInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Auto-gera slug quando usuário digita o nome (se ainda não foi editado manualmente)
  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleNameChange = (name: string) => {
    setData(prev => ({
      ...prev,
      name,
      slug: !isEditing || !prev.slug ? generateSlug(name) : prev.slug,
    }));
  };

  // Quando muda type para 'bairro', limpa subtype
  useEffect(() => {
    if (data.type === 'bairro' && data.subtype) {
      setData(prev => ({ ...prev, subtype: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.type]);

  const addMatchKey = () => {
    const v = matchKeyInput.trim();
    if (!v) return;
    if (data.match_keys.includes(v)) {
      setMatchKeyInput('');
      return;
    }
    setData(prev => ({ ...prev, match_keys: [...prev.match_keys, v] }));
    setMatchKeyInput('');
  };

  const removeMatchKey = (key: string) => {
    setData(prev => ({ ...prev, match_keys: prev.match_keys.filter(k => k !== key) }));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'locations');
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
    if (!data.name.trim()) {
      setError('Nome é obrigatório.');
      return;
    }
    if (!data.slug.trim()) {
      setError('Slug é obrigatório.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const supabase = createBrowserSupabaseClient();
      const payload = {
        slug: data.slug,
        name: data.name,
        type: data.type,
        subtype: data.type === 'empreendimento' ? data.subtype || null : null,
        city: data.city || 'Uberlândia',
        intro: data.intro || null,
        content: data.content || null,
        match_keys: data.match_keys,
        parent_location_id: data.parent_location_id || null,
        cover_image_url: data.cover_image_url || null,
        cover_image_focal_point: data.cover_image_focal_point || '50% 50%',
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
        display_order: data.display_order,
        is_published: data.is_published,
        updated_at: new Date().toISOString(),
      };
      if (isEditing && data.id) {
        const { error: e } = await supabase.from('locations').update(payload).eq('id', data.id);
        if (e) throw e;
      } else {
        const { error: e } = await supabase.from('locations').insert(payload);
        if (e) throw e;
      }
      try { await fetch('/api/revalidate', { method: 'POST' }); } catch { /* non-critical */ }
      router.push('/admin/locations');
      router.refresh();
    } catch (err) {
      setError((err as { message?: string })?.message || 'Erro ao salvar localização.');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!data.id || !confirm('Excluir esta localização?')) return;
      setDeleting(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: deleteError } = await supabase.from('locations').delete().eq('id', data.id);
      if (deleteError) throw deleteError;
      router.push('/admin/locations');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir localização.');
      setDeleting(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 border border-[#d1d5db] rounded text-brand-graphite text-[15px] outline-none transition-colors focus:border-brand-terracotta bg-white';
  const labelClass = 'block text-xs text-brand-gray uppercase tracking-[0.08em] mb-2 font-medium';

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-brand-graphite">
          {isEditing ? 'Editar localização' : 'Nova localização'}
        </h1>
        <div className="flex items-center gap-3">
          {isEditing && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs text-red-500 hover:text-red-700 cursor-pointer bg-transparent border-none"
            >
              {deleting ? 'Excluindo...' : 'Excluir'}
            </button>
          )}
          <button
            onClick={() => router.push('/admin/locations')}
            className="px-4 py-2 text-sm text-brand-gray border border-[#d1d5db] rounded cursor-pointer bg-white hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 text-sm text-white bg-brand-terracotta border-none rounded cursor-pointer hover:bg-brand-terracotta-dark disabled:opacity-60 font-medium"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-6">{error}</div>
      )}

      <div className="space-y-8">
        {/* Identificação */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 space-y-5">
          <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3">Identificação</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tipo *</label>
              <select
                value={data.type}
                onChange={e => setData({ ...data, type: e.target.value as 'bairro' | 'empreendimento' })}
                className={inputClass}
              >
                <option value="bairro">Bairro</option>
                <option value="empreendimento">Empreendimento</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Subtipo {data.type === 'empreendimento' ? '*' : '(N/A)'}</label>
              <input
                type="text"
                value={data.subtype}
                onChange={e => setData({ ...data, subtype: e.target.value })}
                disabled={data.type !== 'empreendimento'}
                list="subtype-suggestions"
                className={`${inputClass} ${data.type !== 'empreendimento' ? 'opacity-40' : ''}`}
                placeholder="Ex: Condomínio, Centro Comercial..."
              />
              <datalist id="subtype-suggestions">
                {SUBTYPE_SUGGESTIONS.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>
          </div>

          <div>
            <label className={labelClass}>Nome *</label>
            <input
              type="text"
              value={data.name}
              onChange={e => handleNameChange(e.target.value)}
              className={inputClass}
              placeholder="Ex: Morada da Colina, Reserva do Vale, Pátio Vinhedos"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Slug (URL) *</label>
              <input
                type="text"
                value={data.slug}
                onChange={e => setData({ ...data, slug: e.target.value })}
                className={inputClass}
              />
              <p className="text-xs text-brand-gray/60 mt-1">/uberlandia/{data.slug || '...'}</p>
            </div>
            <div>
              <label className={labelClass}>Cidade</label>
              <input
                type="text"
                value={data.city}
                onChange={e => setData({ ...data, city: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Localização pai</label>
              <select
                value={data.parent_location_id || ''}
                onChange={e => setData({ ...data, parent_location_id: e.target.value || null })}
                className={inputClass}
              >
                <option value="">Nenhuma</option>
                {parentOptions
                  .filter(opt => opt.id !== data.id)
                  .map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} ({opt.type === 'bairro' ? 'bairro' : opt.subtype || 'empreendimento'})
                    </option>
                  ))}
              </select>
              <p className="text-xs text-brand-gray/60 mt-1">Ex: Reserva do Vale → Morada da Colina</p>
            </div>
            <div>
              <label className={labelClass}>Ordem de exibição</label>
              <input
                type="number"
                value={data.display_order}
                onChange={e => setData({ ...data, display_order: Number(e.target.value) })}
                className={inputClass}
                min={0}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Intro (subtítulo no hero)</label>
            <textarea
              value={data.intro}
              onChange={e => setData({ ...data, intro: e.target.value })}
              className={`${inputClass} min-h-[60px] resize-y`}
              placeholder="Frase curta que aparece abaixo do H1 da página."
            />
          </div>
        </div>

        {/* Match keys */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3 mb-2">
            Match com projetos
          </h2>
          <p className="text-xs text-brand-gray mb-4">
            Strings comparadas (case insensitive, busca parcial) com o campo <code>location</code> dos projetos.
            A página listará automaticamente os projetos cujo <code>location</code> contenha qualquer destas. Adicione todas as variantes de escrita.
          </p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={matchKeyInput}
              onChange={e => setMatchKeyInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addMatchKey();
                }
              }}
              className={`${inputClass} flex-1`}
              placeholder="Ex: Morada da Colina"
            />
            <button
              type="button"
              onClick={addMatchKey}
              className="px-4 py-2 text-sm text-brand-terracotta border border-brand-terracotta rounded cursor-pointer hover:bg-brand-terracotta/5"
            >
              Adicionar
            </button>
          </div>
          {data.match_keys.length === 0 ? (
            <p className="text-xs text-brand-gray/60">Nenhuma chave adicionada. Sem chaves, nenhum projeto será listado automaticamente.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.match_keys.map(key => (
                <span
                  key={key}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-cream rounded-full text-xs text-brand-graphite"
                >
                  {key}
                  <button
                    type="button"
                    onClick={() => removeMatchKey(key)}
                    className="text-brand-gray hover:text-red-500 cursor-pointer bg-transparent border-none text-sm leading-none"
                    title="Remover"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
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
                <img
                  src={data.cover_image_url}
                  alt="Capa"
                  className="w-full h-full object-cover pointer-events-none"
                  style={{ objectPosition: data.cover_image_focal_point }}
                />
                {(() => {
                  const match = data.cover_image_focal_point.match(/^(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
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
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setData({ ...data, cover_image_url: '', cover_image_focal_point: '50% 50%' });
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white text-sm flex items-center justify-center cursor-pointer border-none hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            </>
          )}
          <label className="inline-block px-4 py-2 text-sm text-brand-terracotta border border-brand-terracotta rounded cursor-pointer hover:bg-brand-terracotta/5 transition-colors">
            {coverUploading ? 'Enviando...' : '📷 Escolher imagem'}
            <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
          </label>
        </div>

        {/* Conteúdo (Tiptap) */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3 mb-4">Conteúdo</h2>
          <p className="text-xs text-brand-gray mb-3">
            Texto principal da página. Inclua um H2 chamado <strong>&quot;Perguntas frequentes&quot;</strong> seguido de H3 (perguntas) e parágrafos (respostas) para emitir FAQPage schema automaticamente.
          </p>
          <TipTapEditor content={data.content} onChange={content => setData({ ...data, content })} />
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 space-y-5">
          <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3">SEO</h2>
          <div>
            <label className={labelClass}>Meta título</label>
            <input
              type="text"
              value={data.meta_title}
              onChange={e => setData({ ...data, meta_title: e.target.value })}
              className={inputClass}
              placeholder={`Ex: Arquitetura no ${data.name || 'bairro'}, Uberlândia | Pavanelli`}
            />
            <p className="text-xs text-brand-gray/60 mt-1">Se vazio, é gerado automaticamente.</p>
          </div>
          <div>
            <label className={labelClass}>Meta descrição</label>
            <textarea
              value={data.meta_description}
              onChange={e => setData({ ...data, meta_description: e.target.value })}
              className={`${inputClass} min-h-[60px] resize-y`}
              placeholder="150 a 160 caracteres. Se vazio, usa o intro."
            />
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.is_published}
              onChange={e => setData({ ...data, is_published: e.target.checked })}
              className="w-4 h-4 accent-brand-terracotta"
            />
            <span className="text-sm text-brand-graphite font-medium">Publicado (visível no site)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
