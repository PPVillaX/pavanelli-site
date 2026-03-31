'use client';

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import type { HeroPhoto } from '@/lib/queries';

interface Props {
  initialPhotos: HeroPhoto[];
}

export default function HeroAdmin({ initialPhotos }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<HeroPhoto[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  async function resizeOnClient(file: File, maxWidth = 2400): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Canvas toBlob falhou')), 'image/jpeg', 0.88);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Erro ao carregar imagem')); };
      img.src = url;
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Envie apenas imagens (JPG, PNG, WebP).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    setError('');

    try {
      const resized = await resizeOnClient(file);
      const resizedFile = new File([resized], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('file', resizedFile);
      formData.append('folder', 'hero');

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!uploadRes.ok) {
        const d = await uploadRes.json();
        throw new Error(d.error || 'Erro ao fazer upload.');
      }
      const { url, path } = await uploadRes.json();

      const maxOrder = photos.length > 0
        ? Math.max(...photos.map(p => p.display_order)) + 10
        : 0;

      const { data, error: insertError } = await supabase
        .from('hero_photos')
        .insert({ url, storage_path: path, display_order: maxOrder })
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);

      setPhotos(prev => [...prev, data as HeroPhoto]);
      await fetch('/api/revalidate', { method: 'POST' });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar foto.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDelete(photo: HeroPhoto) {
    if (!confirm('Remover esta foto do hero?')) return;
    setDeletingId(photo.id);

    try {
      if (photo.storage_path) {
        await supabase.storage.from('project-images').remove([photo.storage_path]);
      }

      const { error: deleteError } = await supabase
        .from('hero_photos')
        .delete()
        .eq('id', photo.id);

      if (deleteError) throw new Error(deleteError.message);

      setPhotos(prev => prev.filter(p => p.id !== photo.id));
      await fetch('/api/revalidate', { method: 'POST' });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover foto.');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleMove(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const current = photos[index];
    const target = photos[targetIndex];

    const newOrder = [...photos];
    newOrder[index] = { ...current, display_order: target.display_order };
    newOrder[targetIndex] = { ...target, display_order: current.display_order };
    newOrder.sort((a, b) => a.display_order - b.display_order || new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    setPhotos(newOrder);

    try {
      await Promise.all([
        supabase.from('hero_photos').update({ display_order: target.display_order }).eq('id', current.id),
        supabase.from('hero_photos').update({ display_order: current.display_order }).eq('id', target.id),
      ]);
      await fetch('/api/revalidate', { method: 'POST' });
      router.refresh();
    } catch {
      setError('Erro ao reordenar fotos.');
    }
  }

  return (
    <div>
      {/* Upload button */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 bg-brand-terracotta text-white px-5 py-2.5 rounded text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M8 2v8M4 6l4-4 4 4" />
                <path d="M2 12h12" />
              </svg>
              Adicionar foto ao hero
            </>
          )}
        </button>
        <p className="text-xs text-brand-gray mt-2">
          Aceita JPG, PNG, WebP. Recomendado: formato panorâmico (16:9 ou maior), alta resolução.
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded">{error}</p>
      )}

      {photos.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-lg py-20 text-center">
          <p className="text-brand-gray text-sm">Nenhuma foto ainda. Adicione a primeira para o hero aparecer na home.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-video rounded overflow-hidden bg-gray-100">
                <img
                  src={photo.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex flex-col items-center justify-center gap-2">
                <div className="flex gap-1">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="w-8 h-8 bg-white/90 rounded text-brand-graphite text-xs font-bold disabled:opacity-30 hover:bg-white transition-colors cursor-pointer"
                    title="Mover para cima"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === photos.length - 1}
                    className="w-8 h-8 bg-white/90 rounded text-brand-graphite text-xs font-bold disabled:opacity-30 hover:bg-white transition-colors cursor-pointer"
                    title="Mover para baixo"
                  >
                    →
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(photo)}
                  disabled={deletingId === photo.id}
                  className="w-8 h-8 bg-red-500/90 rounded text-white text-xs hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
                  title="Remover"
                >
                  {deletingId === photo.id ? '…' : '✕'}
                </button>
              </div>

              <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <p className="text-xs text-brand-gray mt-4">
          {photos.length} foto{photos.length !== 1 ? 's' : ''} · Passe o mouse para ver as ações · As setas ← → reordenam os slides
        </p>
      )}
    </div>
  );
}
