import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedServices, getServiceBySlug } from '@/lib/queries';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getPublishedServices();
  return services.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pavanelliarquitetura.com.br';
  const title = service.meta_title || `${service.title} | Arquiteto Uberlândia`;
  const description = service.meta_description || service.tagline || `${service.title} em Uberlândia com a Pavanelli Arquitetura. Do conceito à obra com identidade única.`;

  return {
    title,
    description,
    alternates: { canonical: `/servicos/${service.slug}` },
    openGraph: {
      title: `${title} | Pavanelli Arquitetura`,
      description,
      url: `${siteUrl}/servicos/${service.slug}`,
      type: 'website',
      images: service.cover_image_url ? [{ url: service.cover_image_url, alt: service.title }] : [],
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pavanelliarquitetura.com.br';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.tagline || service.meta_description || undefined,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Pavanelli Arquitetura',
      url: siteUrl,
    },
    areaServed: {
      '@type': 'City',
      name: 'Uberlândia',
      addressRegion: 'MG',
      addressCountry: 'BR',
    },
    url: `${siteUrl}/servicos/${service.slug}`,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Serviços', item: `${siteUrl}/servicos` },
      { '@type': 'ListItem', position: 3, name: service.title, item: `${siteUrl}/servicos/${service.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="px-6 md:px-[60px] py-20 md:py-[120px]">
        <article className="max-w-[720px] mx-auto">

          <Link
            href="/servicos"
            className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.15em] uppercase text-brand-terracotta no-underline hover:opacity-70 transition-opacity mb-12"
          >
            ← Todos os serviços
          </Link>

          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta mb-4">
            Serviços
          </div>

          <h1 className="font-display text-[32px] md:text-[48px] font-bold text-brand-graphite leading-[1.1] mb-4 tracking-tight">
            {service.title}
          </h1>

          {service.tagline && (
            <p className="text-[18px] text-brand-gray font-light leading-relaxed mb-12">
              {service.tagline}
            </p>
          )}

          {service.cover_image_url && (
            <div className="aspect-[16/9] rounded-lg overflow-hidden mb-12 bg-gray-100">
              <img
                src={service.cover_image_url}
                alt={service.title}
                className="w-full h-full object-cover"
                style={{ objectPosition: service.cover_image_focal_point ?? 'center' }}
              />
            </div>
          )}

          {service.content && (
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: service.content }}
            />
          )}

          {/* Link to related portfolio */}
          {service.category_filter && (
            <div className="mt-12 pt-8 border-t border-brand-cream">
              <p className="text-[14px] text-brand-gray mb-4">
                Conheça nossos projetos de {service.title.toLowerCase()}:
              </p>
              <Link
                href={`/portfolio?category=${service.category_filter}`}
                className="inline-block border-2 border-brand-terracotta text-brand-terracotta px-8 py-3.5 text-[13px] font-semibold tracking-[0.1em] uppercase no-underline rounded transition-all duration-300 hover:bg-brand-terracotta hover:text-white"
              >
                Ver portfólio →
              </Link>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-16 pt-10 border-t border-brand-cream text-center">
            <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta mb-3">
              Pavanelli Arquitetura
            </div>
            <h2 className="font-display text-[24px] md:text-[30px] font-bold text-brand-graphite mb-4 tracking-tight">
              Vamos construir algo juntos?
            </h2>
            <p className="text-brand-gray text-[15px] max-w-[400px] mx-auto mb-8 font-light leading-relaxed">
              Cada projeto começa com uma conversa. Conte-nos sobre o seu.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/contato"
                className="inline-block bg-brand-terracotta text-white px-8 py-3.5 text-[13px] font-semibold tracking-[0.1em] uppercase no-underline rounded transition-all duration-300 hover:bg-brand-terracotta-dark hover:-translate-y-0.5"
              >
                Fale conosco
              </Link>
              <Link
                href="/portfolio"
                className="inline-block border-2 border-brand-terracotta text-brand-terracotta px-8 py-3.5 text-[13px] font-semibold tracking-[0.1em] uppercase no-underline rounded transition-all duration-300 hover:bg-brand-terracotta hover:text-white"
              >
                Ver portfólio
              </Link>
            </div>
          </div>

        </article>
      </div>
    </>
  );
}
