import type { MetadataRoute } from 'next';
import { getPublishedProjects, getPublishedPosts } from '@/lib/queries';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pavanelliarquitetura.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    getPublishedProjects(),
    getPublishedPosts().catch(() => []),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
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

  const postPages: MetadataRoute.Sitemap = posts.map((p: { slug: string; updated_at: string; published_at: string | null }) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at || p.published_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...postPages];
}
