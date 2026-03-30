'use client';

import Link from 'next/link';
import type { ProjectWithImages } from '@/lib/types';
import { ImageGalleryJsonLd, BreadcrumbJsonLd } from '@/components/JsonLdProject';
import ProjectGallery from '@/components/ProjectGallery';
import ScrollReveal from '@/components/ScrollReveal';
import { useTracking } from '@/hooks/useTracking';
import { useEffect } from 'react';

const categoryLabels: Record<string, string> = {
  residencial: 'Residencial',
  comercial: 'Comercial',
  fazenda: 'Fazenda / Rural',
  reforma: 'Reforma',
  interiores: 'Interiores',
};

interface Props {
  project: ProjectWithImages;
  prev: ProjectWithImages | null;
  next: ProjectWithImages | null;
  phone: string;
  defaultMessage?: string;
}

export default function ProjectDetailClient({ project, prev, next, phone, defaultMessage }: Props) {
  const { track } = useTracking();
  const slug = project.slug;

  useEffect(() => {
    const timer = setTimeout(() => {
      track('project_view', { project_slug: slug, page: `/portfolio/${slug}` });
    }, 10000);
    return () => clearTimeout(timer);
  }, [slug, track]);

  const sortedImages = [...(project.project_images || [])].sort((a, b) => a.display_order - b.display_order);
  const imageUrls = sortedImages.map(img => img.image_url);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pavanelliarquitetura.com.br';

  const ctaMessage = defaultMessage
    ? defaultMessage
    : `Olá! Vi o projeto ${project.title} no site e gostaria de conversar sobre o meu projeto.`;
  const waHref = `https://wa.me/${phone}?text=${encodeURIComponent(ctaMessage)}`;

  return (
    <>
      {/* SEO: Structured Data */}
      <ImageGalleryJsonLd project={project} />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: siteUrl },
        { name: 'Portfólio', url: `${siteUrl}/portfolio` },
        { name: project.title, url: `${siteUrl}/portfolio/${project.slug}` },
      ]} />
      <section className="px-6 md:px-[60px] py-12 md:py-20">
        {/* Breadcrumb */}
        <ScrollReveal>
          <div className="flex items-center gap-2 text-sm text-brand-gray mb-8">
            <Link href="/portfolio" className="text-brand-gray no-underline hover:text-brand-graphite transition-colors">
              Portfólio
            </Link>
            <span>/</span>
            <span className="text-brand-graphite">{project.title}</span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 md:gap-16">
          {/* Gallery */}
          <ScrollReveal>
            <ProjectGallery images={imageUrls} title={project.title} projectSlug={slug} />
          </ScrollReveal>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ScrollReveal delay={200}>
              <h1 className="font-display text-[32px] md:text-[40px] font-bold text-brand-graphite leading-[1.1] mb-6 tracking-tight">
                {project.title}
              </h1>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-brand-cream">
                  <span className="text-sm text-brand-gray uppercase tracking-[0.08em]">Categoria</span>
                  <span className="text-sm text-brand-graphite font-medium">{categoryLabels[project.category] || project.category}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-brand-cream">
                  <span className="text-sm text-brand-gray uppercase tracking-[0.08em]">Localização</span>
                  <span className="text-sm text-brand-graphite font-medium">{project.location}</span>
                </div>
                {project.year && (
                  <div className="flex justify-between py-3 border-b border-brand-cream">
                    <span className="text-sm text-brand-gray uppercase tracking-[0.08em]">Ano</span>
                    <span className="text-sm text-brand-graphite font-medium">{project.year}</span>
                  </div>
                )}
                {project.area_m2 && (
                  <div className="flex justify-between py-3 border-b border-brand-cream">
                    <span className="text-sm text-brand-gray uppercase tracking-[0.08em]">Área</span>
                    <span className="text-sm text-brand-graphite font-medium">{project.area_m2} m²</span>
                  </div>
                )}
                {project.photographer && (
                  <div className="flex justify-between py-3 border-b border-brand-cream">
                    <span className="text-sm text-brand-gray uppercase tracking-[0.08em]">Fotógrafo</span>
                    <span className="text-sm text-brand-graphite font-medium">{project.photographer}</span>
                  </div>
                )}
              </div>

              <p className="text-[15px] text-brand-gray leading-[1.8] font-light">
                {project.description}
              </p>

              {/* CTA */}
              <Link
                href={waHref}
                target="_blank"
                onClick={() => track('whatsapp_click', { project_slug: slug, page: `/portfolio/${slug}` })}
                className="inline-block mt-8 bg-brand-terracotta text-white px-8 py-3.5 text-[13px] font-semibold tracking-[0.1em] uppercase no-underline rounded transition-all duration-300 hover:bg-brand-terracotta-dark hover:-translate-y-0.5 w-full text-center"
              >
                Quero um projeto assim
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Previous / Next */}
      <section className="px-6 md:px-[60px] py-12 border-t border-brand-cream">
        <div className="flex justify-between items-center">
          {prev ? (
            <Link
              href={`/portfolio/${prev.slug}`}
              className="text-brand-gray no-underline hover:text-brand-graphite transition-colors group"
            >
              <span className="text-xs uppercase tracking-[0.1em] block mb-1">← Anterior</span>
              <span className="font-display font-semibold text-lg group-hover:text-brand-terracotta transition-colors">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/portfolio/${next.slug}`}
              className="text-brand-gray no-underline hover:text-brand-graphite transition-colors text-right group"
            >
              <span className="text-xs uppercase tracking-[0.1em] block mb-1">Próximo →</span>
              <span className="font-display font-semibold text-lg group-hover:text-brand-terracotta transition-colors">
                {next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </>
  );
}
