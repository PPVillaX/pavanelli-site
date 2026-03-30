'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTracking } from '@/hooks/useTracking';
// Note: lightbox uses plain <img> for proper max-w/max-h sizing

interface ProjectGalleryProps {
  images: string[];
  title: string;
  projectSlug?: string;
}

export default function ProjectGallery({ images, title, projectSlug }: ProjectGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const { track } = useTracking();

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    track('lightbox_open', {
      project_slug: projectSlug,
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    });
  };
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  }, [lightboxIndex, images.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) {
      setActiveIndex(prev => (prev - 1 + images.length) % images.length);
    } else if (diff < -50) {
      setActiveIndex(prev => (prev + 1) % images.length);
    }
    touchStartX.current = null;
  };

  return (
    <>
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((img, i) => (
          <div
            key={img}
            className={`relative overflow-hidden rounded cursor-pointer group ${
              i === 0 ? 'md:col-span-2 aspect-video' : 'aspect-[4/3]'
            }`}
            onClick={() => openLightbox(i)}
          >
            <Image
              src={img}
              alt={`${title} — Foto ${i + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={i === 0 ? '100vw' : '50vw'}
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm tracking-wider uppercase">
                Ampliar
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Dots indicator — mobile only */}
      {images.length > 1 && (
        <div className="flex md:hidden justify-center gap-2 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Foto ${i + 1}`}
              className={`w-2 h-2 rounded-full border-none cursor-pointer transition-colors duration-200 ${
                i === activeIndex ? 'bg-brand-terracotta' : 'bg-brand-cream'
              }`}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
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

          <div className="flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
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
        </div>
      )}
    </>
  );
}
