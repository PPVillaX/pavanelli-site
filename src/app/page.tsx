import Link from 'next/link';
import { LocalBusinessJsonLd } from '@/components/JsonLd';
import { GallerySection } from '@/components/GallerySection';
import { HomeBlogPreview } from '@/components/HomeBlogPreview';
import HomeClient from './home-client';
import { getProfileSettings, getContentSettings } from '@/lib/settings';
import { getHeroPhotos, getFeaturedProjectsFromDB } from '@/lib/queries';

export default async function Home() {
  const [profile, content, heroPhotos, featuredProjects] = await Promise.all([
    getProfileSettings(),
    getContentSettings(),
    getHeroPhotos(),
    getFeaturedProjectsFromDB(),
  ]);

  const overlayOpacity = Number(content.featured_overlay_opacity) || 0;

  const heroSlides = heroPhotos.map((p, i) => ({
    src: p.url,
    alt: `Portfólio Pavanelli Arquitetura – foto ${i + 1} de ${heroPhotos.length}`,
    slug: '',
  }));

  return (
    <>
      <LocalBusinessJsonLd />
      <HomeClient
        profileBioIntro={profile.sobre_bio_intro}
        profileName={profile.sobre_name}
        profilePhotoUrl={profile.sobre_photo_url}
        profilePhotoFocalPoint={profile.sobre_photo_focal_point}
        heroTitle={content.cta_hero_title || 'Arquitetura com identidade e alma'}
        heroSubtitle={content.cta_hero_subtitle || 'Projetos residenciais e comerciais que unem brasilidade, contemporaneidade e personalidade. Uberlândia e todo o Brasil.'}
        heroSlides={heroSlides}
        overlayColor={content.featured_overlay_color}
        overlayOpacity={overlayOpacity}
        featuredProjects={featuredProjects}
      />
      <HomeBlogPreview />
      <GallerySection />
      {/* Contact CTA */}
      <section className="px-6 md:px-[60px] py-20 md:py-[120px] text-center">
        <h2 className="font-display text-[28px] md:text-[36px] font-bold text-brand-graphite mb-6 tracking-tight">
          Vamos construir algo juntos?
        </h2>
        <p className="text-brand-gray text-lg max-w-[500px] mx-auto mb-10 font-light">
          Cada projeto começa com uma conversa. Conte-nos sobre o seu.
        </p>
        <Link
          href="/contato"
          className="inline-block bg-brand-terracotta text-white px-10 py-4 text-[13px] font-semibold tracking-[0.1em] uppercase no-underline rounded transition-all duration-300 hover:bg-brand-terracotta-dark hover:-translate-y-0.5"
        >
          Fale conosco
        </Link>
      </section>
    </>
  );
}
