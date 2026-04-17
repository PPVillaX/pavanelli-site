import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPublishedPosts } from '@/lib/queries';
import { BreadcrumbJsonLd } from '@/components/JsonLdProject';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pavanelliarquitetura.com.br';
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  const ogImage = post.cover_image_url || undefined;

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} | Pavanelli Arquitetura`,
      description: post.excerpt ?? undefined,
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      images: ogImage ? [{ url: ogImage, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt ?? undefined,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pavanelliarquitetura.com.br';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_image_url ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at ?? post.published_at ?? undefined,
    author: {
      '@type': 'Person',
      name: 'Antônio Pavanelli',
      url: `${siteUrl}/sobre`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pavanelli Arquitetura',
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
  };

  const breadcrumbItems = [
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'Blog', url: `${siteUrl}/blog` },
    { name: post.title, url: `${siteUrl}/blog/${post.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <article className="px-6 md:px-[60px] py-20 md:py-[120px] max-w-[800px]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.15em] uppercase text-brand-terracotta no-underline hover:opacity-70 transition-opacity mb-12"
        >
          ← Voltar ao Blog
        </Link>

        {post.blog_categories && (
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta mb-4">
            {post.blog_categories.name}
          </div>
        )}

        <h1 className="font-display text-[32px] md:text-[48px] font-bold text-brand-graphite leading-[1.1] mb-6 tracking-tight">
          {post.title}
        </h1>

        {post.published_at && (
          <p className="text-xs text-brand-gray/50 tracking-[0.1em] uppercase mb-12">
            {new Date(post.published_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        )}

        {post.cover_image_url && (
          <div className="aspect-[16/9] rounded-lg overflow-hidden mb-12 bg-gray-100">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
              style={{ objectPosition: post.cover_image_focal_point ?? 'center' }}
            />
          </div>
        )}

        <div
          className="prose prose-lg text-brand-gray leading-[1.8] font-light"
          dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
        />
      </article>
    </>
  );
}
