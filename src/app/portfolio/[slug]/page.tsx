import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProjectBySlugFromDB, getAdjacentProjectsFromDB, getPublishedProjects } from '@/lib/queries';
import { getContactSettings } from '@/lib/settings';
import ProjectDetailClient from './project-detail-client';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

// Mapeia categoria do banco para texto legível em SEO copy.
const CATEGORY_LABELS: Record<string, string> = {
  residencial: 'projeto residencial',
  comercial: 'projeto comercial',
  fazenda: 'arquitetura de fazenda',
  reforma: 'reforma arquitetônica',
  interiores: 'design de interiores',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlugFromDB(slug);
  if (!project) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pavanelliarquitetura.com.br';
  const canonicalUrl = `${siteUrl}/portfolio/${project.slug}`;
  const ogImage = project.cover_image_url || undefined;

  // Constrói o title rico, mas curto o suficiente para mobile.
  // Usamos `absolute` para não passar pelo template do layout (que adicionaria sufixo longo).
  // Padrão final: "Restaurante Takka, Uberlândia | Pavanelli Arquitetura" (~55 chars).
  const cityPart = project.location?.trim() || 'Uberlândia';
  const seoTitle = `${project.title}, ${cityPart} | Pavanelli Arquitetura`;

  // Constrói uma description rica usando os campos disponíveis quando o description
  // do banco não está preenchido (ou é curto demais para ser útil em SERP).
  // Garante 140-160 chars com keyword + cidade + tipologia.
  const categoryText = project.category ? CATEGORY_LABELS[project.category] : null;
  const fallbackDescription = [
    `${project.title}: ${categoryText || 'projeto arquitetônico'} em ${cityPart}, assinado pela Pavanelli Arquitetura.`,
    project.year ? `Concluído em ${project.year}.` : null,
    'Conheça o conceito, materiais e fotos do projeto.',
  ]
    .filter(Boolean)
    .join(' ');

  const description =
    project.description && project.description.length >= 80
      ? project.description.slice(0, 160)
      : fallbackDescription;

  return {
    title: { absolute: seoTitle },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: seoTitle,
      description,
      url: canonicalUrl,
      images: ogImage ? [{ url: ogImage, alt: project.title }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;

  const [project, adjacent, contact] = await Promise.all([
    getProjectBySlugFromDB(slug),
    getAdjacentProjectsFromDB(slug),
    getContactSettings(),
  ]);

  if (!project) notFound();

  return (
    <ProjectDetailClient
      project={project}
      prev={adjacent.prev}
      next={adjacent.next}
      phone={contact.whatsapp_number}
      defaultMessage={contact.whatsapp_default_message}
    />
  );
}
