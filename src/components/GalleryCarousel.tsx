'use client';

import Link from 'next/link';
import type { GalleryPhoto } from '@/lib/queries';

interface GalleryCarouselProps {
  photos: GalleryPhoto[];
  instagramHandle?: string;
}

export function GalleryCarousel({ photos, instagramHandle }: GalleryCarouselProps) {
  const instagramUrl = instagramHandle
    ? `https://instagram.com/${instagramHandle}`
    : null;

  return (
    <div>
      {/* Mobile: horizontal scroll carousel */}
      <div className="md:hidden -mx-6 px-6 overflow-x-auto scrollbar-none pb-2"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
        <div className="flex gap-3" style={{ width: 'max-content' }}>
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="shrink-0 w-[72vw] max-w-[260px] aspect-square rounded overflow-hidden bg-gray-100"
              style={{ scrollSnapAlign: 'start' }}
            >
              <img
                src={photo.url}
                alt={`Foto ${index + 1}${instagramHandle ? ` — @${instagramHandle}` : ''}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
          {/* Peek spacer */}
          <div className="shrink-0 w-4" />
        </div>
      </div>

      {/* Desktop: 4-column grid */}
      <div className="hidden md:grid grid-cols-4 gap-4">
        {photos.slice(0, 8).map((photo, index) => (
          <div key={photo.id} className="aspect-square rounded overflow-hidden bg-gray-100 group">
            <img
              src={photo.url}
              alt={`Foto ${index + 1}${instagramHandle ? ` — @${instagramHandle}` : ''}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* CTA */}
      {instagramUrl && (
        <div className="mt-10 text-center">
          <Link
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 border border-brand-graphite/30 text-brand-graphite px-8 py-3.5 text-[13px] font-semibold tracking-[0.08em] uppercase no-underline rounded transition-all duration-300 hover:bg-brand-graphite hover:text-white hover:border-brand-graphite"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
            Ver perfil no Instagram
          </Link>
        </div>
      )}
    </div>
  );
}
