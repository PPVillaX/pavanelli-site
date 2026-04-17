'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface ImageUpload {
  id?: string;
  url: string;
  alt_text?: string;
  display_order: number;
}

interface Props {
  images: ImageUpload[];
  projectId?: string;
  onChange: (images: ImageUpload[]) => void;
}

export default function ImageManager({ images, projectId, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) formData.append('projectId', projectId);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data.url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao fazer upload.';
      setUploadError(msg);
      console.error('Upload failed:', err);
      return null;
    }
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setUploading(true);
    setUploadError('');
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    const newImages: ImageUpload[] = [];

    for (const file of fileArray) {
      const url = await uploadFile(file);
      if (url) {
        newImages.push({
          url,
          display_order: images.length + newImages.length + 1,
        });
      }
    }

    onChange([...images, ...newImages]);
    setUploading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, projectId]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, display_order: i + 1 }));
    onChange(updated);
  };

  const handleMove = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated.map((img, i) => ({ ...img, display_order: i + 1 })));
  };

  const handleSetCover = (index: number) => {
    // Move to position 0
    handleMove(index, 0);
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragOver ? 'border-brand-terracotta bg-brand-terracotta/5' : 'border-[#d1d5db] hover:border-brand-terracotta/50'
        }`}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.accept = 'image/*';
          input.onchange = e => {
            const files = (e.target as HTMLInputElement).files;
            if (files) handleFiles(files);
          };
          input.click();
        }}
      >
        {uploading ? (
          <div className="text-sm text-brand-gray">
            <div className="animate-spin w-6 h-6 border-2 border-brand-terracotta border-t-transparent rounded-full mx-auto mb-2" />
            Processando imagens...
          </div>
        ) : (
          <>
            <div className="text-2xl mb-2">📸</div>
            <p className="text-sm text-brand-gray">
              Arraste imagens aqui ou <span className="text-brand-terracotta font-medium">clique para selecionar</span>
            </p>
            <p className="text-xs text-brand-gray/60 mt-1">
              Imagens serão otimizadas automaticamente (WebP, max 2400px)
            </p>
            {uploadError && (
              <p className="text-xs text-red-500 mt-2 font-medium">{uploadError}</p>
            )}
          </>
        )}
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
          {images.map((img, i) => (
            <div key={img.url + i} className="relative group rounded overflow-hidden aspect-square bg-gray-100">
              <Image
                src={img.url}
                alt={img.alt_text || ''}
                fill
                className="object-cover"
                sizes="120px"
                unoptimized
              />
              {i === 0 && (
                <div className="absolute top-1 left-1 bg-brand-terracotta text-white text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                  Capa
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {i > 0 && (
                  <button
                    onClick={() => handleMove(i, i - 1)}
                    className="w-7 h-7 rounded bg-white/90 text-brand-graphite text-xs flex items-center justify-center cursor-pointer border-none hover:bg-white"
                    title="Mover para esquerda"
                  >←</button>
                )}
                {i > 0 && (
                  <button
                    onClick={() => handleSetCover(i)}
                    className="w-7 h-7 rounded bg-brand-terracotta text-white text-xs flex items-center justify-center cursor-pointer border-none hover:bg-brand-terracotta-dark"
                    title="Definir como capa"
                  >★</button>
                )}
                {i < images.length - 1 && (
                  <button
                    onClick={() => handleMove(i, i + 1)}
                    className="w-7 h-7 rounded bg-white/90 text-brand-graphite text-xs flex items-center justify-center cursor-pointer border-none hover:bg-white"
                    title="Mover para direita"
                  >→</button>
                )}
                <button
                  onClick={() => handleRemove(i)}
                  className="w-7 h-7 rounded bg-red-500 text-white text-xs flex items-center justify-center cursor-pointer border-none hover:bg-red-600"
                  title="Remover"
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
