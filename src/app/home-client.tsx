'use client';

import Link from 'next/link';
import HeroSlideshow from '@/components/HeroSlideshow';
import { ParallaxHero } from '@/components/ParallaxHero';
import ProjectCard from '@/components/ProjectCard';
import ScrollReveal from '@/components/ScrollReveal';
import type { ProjectWithImages } from '@/lib/types';
import { useTracking } from '@/hooks/useTracking';

interface HomeClientProps {
  profileBioIntro: string;
  profileName: string;
  profilePhotoUrl: string;
  profilePhotoFocalPoint?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroSlides: { src: string; alt: string; slug: string }[];
  overlayColor?: string;
  overlayOpacity?: number;
  featuredProjects: ProjectWithImages[];
}

export default function HomeClient({
  profileBioIntro,
  profileName,
  profilePhotoUrl,
  profilePhotoFocalPoint,
  heroTitle,
  heroSubtitle,
  heroSlides,
  overlayColor,
  overlayOpacity,
  featuredProjects,
}: HomeClientProps) {
  const { track } = useTracking();

  return (
    <>
      {/* Hero */}
      <ParallaxHero>
        <HeroSlideshow slides={heroSlides} title={heroTitle} subtitle={heroSubtitle} />
      </ParallaxHero>

      {/* Portfolio Preview */}
      <section className="px-6 md:px-[60px] py-20 md:py-[120px]">
        <ScrollReveal>
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta mb-4">
            Portfólio
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="font-display text-[32px] md:text-[48px] font-bold text-brand-graphite mb-6 tracking-tight leading-[1.1]">
            Projetos em destaque
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <p className="text-[17px] text-brand-gray max-w-[600px] leading-relaxed font-light">
            Cada projeto carrega uma identidade única — sólida, contemporânea e com a brasilidade que define o nosso trabalho.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-[60px]">
          {featuredProjects.map((project, i) => (
            <div
              key={project.slug}
              className="transition-all duration-500"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <ProjectCard
                project={project}
                overlayColor={overlayColor}
                overlayOpacity={overlayOpacity}
              />
            </div>
          ))}
        </div>
        <ScrollReveal delay={400}>
          <div className="text-center mt-16">
            <Link
              href="/portfolio"
              onClick={() => track('portfolio_cta_click', { page: '/' })}
              className="inline-block border-2 border-brand-terracotta text-brand-terracotta px-10 py-4 text-[13px] font-semibold tracking-[0.1em] uppercase no-underline rounded transition-all duration-300 hover:bg-brand-terracotta hover:text-white"
            >
              Ver todos os projetos
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* About Section */}
      <section className="bg-brand-dark px-6 md:px-[60px] py-20 md:py-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            {profilePhotoUrl ? (
              <div className="w-full aspect-[3/4] overflow-hidden rounded">
                <img
                  src={profilePhotoUrl}
                  alt={profileName}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: profilePhotoFocalPoint || '50% 50%' }}
                />
              </div>
            ) : (
              <div className="w-full aspect-[3/4] bg-brand-dark/50 rounded flex items-center justify-center text-white/20 text-sm tracking-[0.1em]">
                FOTO DO ANTÔNIO (aguardando)
              </div>
            )}
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta mb-4">
              Sobre
            </div>
            <h2 className="font-display text-[28px] md:text-[36px] font-bold text-white mb-6 tracking-tight leading-[1.1]">
              {profileName}
            </h2>
            <p className="text-base text-white/60 leading-[1.8] font-light mb-8">
              {profileBioIntro}
            </p>
            <Link
              href="/sobre"
              className="inline-block text-white text-[13px] font-semibold tracking-[0.1em] uppercase no-underline border-b-2 border-brand-terracotta pb-1 transition-colors hover:text-brand-terracotta"
            >
              Conheça mais →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
