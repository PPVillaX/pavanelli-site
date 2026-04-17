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

  const wordCount = (post.content ?? '').replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

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

      <div className="px-6 md:px-[60px] py-20 md:py-[120px]">
        <article className="max-w-[720px] mx-auto">

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

          <div className="flex items-center gap-4 mb-12">
            {post.published_at && (
              <p className="text-xs text-brand-gray/60 tracking-[0.1em] uppercase">
                {new Date(post.published_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
            {wordCount > 0 && (
              <>
                <span className="text-brand-cream">·</span>
                <p className="text-xs text-brand-gray/60 tracking-[0.1em] uppercase">
                  {readingTime} min de leitura
                </p>
              </>
            )}
          </div>

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
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
          />

          {/* Bottom CTA */}
          <div className="mt-16 pt-10 border-t border-brand-cream text-center">
            <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta mb-3">
              Pavanelli Arquitetura
            </div>
            <h2 className="font-display text-[24px] md:text-[30px] font-bold text-brand-graphite mb-4 tracking-tight">
              Inspire-se com nossos projetos
            </h2>
            <p className="text-brand-gray text-[15px] max-w-[400px] mx-auto mb-8 font-light leading-relaxed">
              Do conceito à obra — projetos residenciais, comerciais e fazendas com identidade única.
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
