import type { MetadataRoute } from 'next';
import {
  getPublishedProjects,
  getPublishedPosts,
  getPublishedServices,
  getPublishedLocations,
} from '@/lib/queries';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pavanelliarquitetura.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, services, locations] = await Promise.all([
    getPublishedProjects(),
    getPublishedPosts().catch(() => []),
    getPublishedServices().catch(() => []),
    getPublishedLocations().catch(() => []),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/servicos`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map(p => ({
    url: `${BASE_URL}/portfolio/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const servicePages: MetadataRoute.Sitemap = services.map(s => ({
    url: `${BASE_URL}/servicos/${s.slug}`,
    lastModified: new Date(s.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((p: { slug: string; updated_at: string; published_at: string | null }) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at || p.published_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Páginas de localização (bairros e empreendimentos): /uberlandia/[slug]
  // Prioridade alta porque são landing pages de SEO local com alta intenção comercial.
  const locationPages: MetadataRoute.Sitemap = locations.map(l => ({
    url: `${BASE_URL}/uberlandia/${l.slug}`,
    lastModified: new Date(l.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  return [
    ...staticPages,
    ...projectPages,
    ...servicePages,
    ...postPages,
    ...locationPages,
  ];
}
