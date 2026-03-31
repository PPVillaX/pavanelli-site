'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTracking } from '@/hooks/useTracking';

interface ProjectGalleryProps {
  images: string[];
  title: string;
  projectSlug?: string;
}

export default function ProjectGallery({ images, title, projectSlug }: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const { track } = useTracking();

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    track('lightbox_open', { project_slug: projectSlug, page: window.location.pathname });
  };
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % images.length);
  }, [lightboxIndex, images.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  }, [lightboxIndex, images.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, goNext, goPrev]);

  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) goPrev();
    else if (diff < -50) goNext();
    touchStartX.current = null;
  };

  return (
    <>
      {/* Featured first image — full width */}
      {images[0] && (
        <div
          className="relative overflow-hidden rounded cursor-pointer group mb-3"
          onClick={() => openLightbox(0)}
        >
          <img
            src={images[0]}
            alt={`${title} — Foto 1`}
            loading="eager"
            className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm tracking-wider uppercase">Ampliar</span>
          </div>
        </div>
      )}

      {/* Remaining images — 2-column masonry respecting natural orientation */}
      {images.length > 1 && (
        <div className="columns-1 md:columns-2 gap-3">
          {images.slice(1).map((img, i) => (
            <div
              key={img}
              className="relative overflow-hidden rounded cursor-pointer group break-inside-avoid mb-3"
              onClick={() => openLightbox(i + 1)}
            >
              <img
                src={img}
                alt={`${title} — Foto ${i + 2}`}
                loading="lazy"
                className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm tracking-wider uppercase">Ampliar</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox — portal to document.body to escape ancestor stacking contexts */}
      {lightboxIndex !== null && createPortal(
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          onTouchStart={handleLightboxTouchStart}
          onTouchEnd={handleLightboxTouchEnd}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl bg-transparent border-none cursor-pointer z-10 w-12 h-12 flex items-center justify-center"
            onClick={closeLightbox}
            aria-label="Fechar"
          >
            ✕
          </button>

          <button
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl bg-transparent border-none cursor-pointer z-10 w-12 h-12 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Anterior"
          >
            ‹
          </button>

          <div className="flex items-center justify-center p-4 w-full h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightboxIndex]}
              alt={`${title} — Foto ${lightboxIndex + 1}`}
              className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded"
            />
          </div>

          <button
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl bg-transparent border-none cursor-pointer z-10 w-12 h-12 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Próximo"
          >
            ›
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
