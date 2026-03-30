import { getGalleryPhotos } from '@/lib/queries';
import { getSocialSettings } from '@/lib/settings';
import { GalleryCarousel } from './GalleryCarousel';

export async function GallerySection() {
  const [photos, social] = await Promise.all([
    getGalleryPhotos(),
    getSocialSettings(),
  ]);

  if (photos.length === 0) return null;

  return (
    <section className="px-6 md:px-[60px] py-16 md:py-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta mb-3">
            Instagram
          </div>
          <h2 className="font-display text-[28px] md:text-[36px] font-bold text-brand-graphite tracking-tight leading-[1.1]">
            @{social.instagram_handle || 'pavanelliarquitetura'}
          </h2>
        </div>
      </div>
      <GalleryCarousel
        photos={photos}
        instagramHandle={social.instagram_handle}
      />
    </section>
  );
}
