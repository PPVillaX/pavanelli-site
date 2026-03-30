import type { ProjectWithImages } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pavanelliarquitetura.com.br';

export function ImageGalleryJsonLd({ project, siteName }: { project: ProjectWithImages; siteName?: string }) {
  const sortedImages = [...(project.project_images || [])].sort(
    (a, b) => a.display_order - b.display_order
  );

  const resolvedSiteName = siteName || 'Pavanelli Arquitetura';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: `${project.title} — ${resolvedSiteName}`,
    description: project.description,
    url: `${BASE_URL}/portfolio/${project.slug}`,
    image: sortedImages.map((img, i) => ({
      '@type': 'ImageObject',
      url: img.image_url.startsWith('http') ? img.image_url : `${BASE_URL}${img.image_url}`,
      name: img.alt_text || `${project.title} — Foto ${i + 1}`,
      description: `Projeto ${project.title} por ${resolvedSiteName}${project.location ? ` em ${project.location}` : ''}`,
    })),
    author: {
      '@type': 'Organization',
      name: resolvedSiteName,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
