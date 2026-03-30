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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlugFromDB(slug);
  if (!project) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pavanelliarquitetura.com.br';
  const canonicalUrl = `${siteUrl}/portfolio/${project.slug}`;
  const ogImage = project.cover_image_url || undefined;

  return {
    title: project.title,
    description: project.description ?? `${project.title} — Pavanelli Arquitetura`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${project.title} — Pavanelli Arquitetura`,
      description: project.description ?? undefined,
      url: canonicalUrl,
      images: ogImage ? [{ url: ogImage }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} — Pavanelli Arquitetura`,
      description: project.description ?? undefined,
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
