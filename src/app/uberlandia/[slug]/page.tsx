import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getLocationBySlug,
  getPublishedLocations,
  getPublishedProjects,
  getPublishedLocationById,
  filterProjectsByLocationMatchKeys,
} from '@/lib/queries';
import { extractFAQs, buildFAQPageJsonLd } from '@/lib/extract-faqs';
import ProjectCard from '@/components/ProjectCard';
import ScrollReveal from '@/components/ScrollReveal';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const locations = await getPublishedLocations();
  return locations.map((l) => ({ slug: l.slug }));
}

const SUBTYPE_LABEL: Record<string, string> = {
  bairro: 'Bairro',
  empreendimento: 'Empreendimento',
};

function resolveTypeLabel(location: { type: string; subtype: string | null }) {
  if (location.type === 'empreendimento' && location.subtype) {
    return location.subtype;
  }
  return SUBTYPE_LABEL[location.type] || 'Localização';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pavanelliarquitetura.com.br';
  const canonical = `${siteUrl}/uberlandia/${location.slug}`;

  const seoTitle =
    location.meta_title ||
    `Arquitetura no ${location.name}, ${location.city} | Pavanelli Arquitetura`;

  const description =
    location.meta_description ||
    location.intro ||
    `Projetos de arquitetura no ${location.name}, ${location.city}, assinados pela Pavanelli Arquitetura. ${resolveTypeLabel(location)}.`;

  return {
    title: { absolute: seoTitle },
    description: description.slice(0, 160),
    alternates: { canonical },
    openGraph: {
      title: seoTitle,
      description: description.slice(0, 160),
      url: canonical,
      type: 'website',
      images: location.cover_image_url ? [{ url: location.cover_image_url, alt: location.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: description.slice(0, 160),
      images: location.cover_image_url ? [location.cover_image_url] : [],
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pavanelliarquitetura.com.br';
  const canonical = `${siteUrl}/uberlandia/${location.slug}`;
  const typeLabel = resolveTypeLabel(location);

  // Carrega projetos e parent (para breadcrumb hierárquico) em paralelo.
  // IMPORTANTE: usa getPublishedLocationById (com cache) e não getLocationById,
  // porque a página é estática com revalidate=60 e generateStaticParams.
  // Misturar fetch sem cache (ADMIN_REVALIDATE=0) com geração estática causa
  // erro 500 em Next 16.
  const [allProjects, parentLocation] = await Promise.all([
    getPublishedProjects(),
    location.parent_location_id
      ? getPublishedLocationById(location.parent_location_id)
      : Promise.resolve(null),
  ]);

  const projectsHere = filterProjectsByLocationMatchKeys(allProjects, location.match_keys);

  // Schema: Place (a localização como entidade geográfica)
  const placeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${location.name}, ${location.city}`,
    description: location.intro || undefined,
    url: canonical,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.city,
      addressRegion: 'MG',
      addressCountry: 'BR',
    },
    image: location.cover_image_url || undefined,
    containedInPlace: parentLocation
      ? {
          '@type': 'Place',
          name: parentLocation.name,
          url: `${siteUrl}/uberlandia/${parentLocation.slug}`,
        }
      : undefined,
  };

  // Schema: BreadcrumbList (hierarquia: Home > Uberlândia > [parent?] > location)
  const breadcrumbItems: { name: string; url: string }[] = [
    { name: 'Home', url: `${siteUrl}/` },
    { name: location.city, url: `${siteUrl}/uberlandia` },
  ];
  if (parentLocation) {
    breadcrumbItems.push({
      name: parentLocation.name,
      url: `${siteUrl}/uberlandia/${parentLocation.slug}`,
    });
  }
  breadcrumbItems.push({ name: location.name, url: canonical });

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };

  // Schema: ItemList dos projetos da Pavanelli na localização
  const itemListJsonLd =
    projectsHere.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Projetos da Pavanelli Arquitetura no ${location.name}`,
          numberOfItems: projectsHere.length,
          itemListElement: projectsHere.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${siteUrl}/portfolio/${p.slug}`,
            name: p.title,
          })),
        }
      : null;

  // Schema: FAQPage (reusa o mesmo extractor das outras páginas)
  const faqs = extractFAQs(location.content);
  const faqJsonLd = faqs.length > 0 ? buildFAQPageJsonLd(faqs) : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {itemListJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      )}
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      {/* Hero */}
      <section
        className="bg-brand-white px-6 md:px-[60px] py-20 md:py-[120px] relative"
        style={
          location.cover_image_url
            ? {
                backgroundImage: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url(${location.cover_image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: location.cover_image_focal_point || 'center',
              }
            : undefined
        }
      >
        <ScrollReveal>
          {/* Breadcrumb visual */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap gap-1 text-[12px] text-brand-gray mb-6">
            <Link href="/" className="text-brand-gray no-underline hover:text-brand-graphite">
              Home
            </Link>
            <span>/</span>
            <span>{location.city}</span>
            {parentLocation && (
              <>
                <span>/</span>
                <Link
                  href={`/uberlandia/${parentLocation.slug}`}
                  className="text-brand-gray no-underline hover:text-brand-graphite"
                >
                  {parentLocation.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-brand-graphite">{location.name}</span>
          </nav>

          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta mb-4">
            {typeLabel} em {location.city}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h1 className="font-display text-[32px] md:text-[48px] font-bold text-brand-graphite leading-[1.1] mb-6 tracking-tight">
            Arquitetura no {location.name}, {location.city}
          </h1>
        </ScrollReveal>

        {location.intro && (
          <ScrollReveal delay={200}>
            <p className="text-xl text-brand-gray max-w-[700px] leading-relaxed font-light">
              {location.intro}
            </p>
          </ScrollReveal>
        )}
      </section>

      {/* Conteúdo principal */}
      {location.content && (
        <section className="px-6 md:px-[60px] py-16 md:py-20">
          <div className="max-w-[720px] mx-auto">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: location.content }}
            />
          </div>
        </section>
      )}

      {/* Projetos da Pavanelli na localização */}
      {projectsHere.length > 0 && (
        <section className="px-6 md:px-[60px] py-16 md:py-20 bg-brand-cream/30">
          <ScrollReveal>
            <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta mb-4">
              Portfólio
            </div>
            <h2 className="font-display text-[28px] md:text-[36px] font-bold text-brand-graphite mb-3 tracking-tight">
              Projetos da Pavanelli no {location.name}
            </h2>
            <p className="text-[15px] text-brand-gray max-w-[600px] leading-relaxed font-light mb-10">
              {projectsHere.length === 1
                ? '1 projeto autoral assinado pelo escritório nesta localização.'
                : `${projectsHere.length} projetos autorais assinados pelo escritório nesta localização.`}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {projectsHere.map(project => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="px-6 md:px-[60px] py-20 md:py-[120px] text-center">
        <ScrollReveal>
          <h2 className="font-display text-[28px] md:text-[36px] font-bold text-brand-graphite mb-6 tracking-tight">
            Vai construir ou reformar no {location.name}?
          </h2>
          <p className="text-brand-gray text-lg max-w-[500px] mx-auto mb-10 font-light">
            Conte-nos sobre o seu projeto. A primeira conversa é uma etapa de entendimento, sem compromisso.
          </p>
          <Link
            href="/contato"
            className="inline-block bg-brand-terracotta text-white px-10 py-4 text-[13px] font-semibold tracking-[0.1em] uppercase no-underline rounded transition-all duration-300 hover:bg-brand-terracotta-dark hover:-translate-y-0.5"
          >
            Fale conosco
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
