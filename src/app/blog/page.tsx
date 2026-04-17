import type { Metadata } from 'next';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { getPublishedPosts } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Reflexões sobre arquitetura, materiais, processo criativo e tendências. Pavanelli Arquitetura — Uberlândia.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog | Pavanelli Arquitetura',
    description: 'Reflexões sobre arquitetura, materiais, processo criativo e tendências. Pavanelli Arquitetura — Uberlândia.',
    url: '/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Pavanelli Arquitetura',
    description: 'Reflexões sobre arquitetura, materiais, processo criativo e tendências. Pavanelli Arquitetura — Uberlândia.',
  },
};

const placeholder_posts = [
  {
    tag: 'Materiais',
    title: 'A importância de uma boa base para uma arquitetura perene',
    excerpt: 'Como a escolha de materiais de qualidade define a longevidade e o caráter de um projeto. Entenda por que investir na base é investir no futuro da sua construção.',
  },
  {
    tag: 'Processo',
    title: 'Arquiteto em Uberlândia: como escolher o profissional certo',
    excerpt: 'O que observar na hora de contratar um arquiteto para o seu projeto residencial ou comercial. Dicas práticas para acertar na escolha.',
  },
  {
    tag: 'Referências',
    title: 'Brasilidade na arquitetura: projetar casas com identidade local',
    excerpt: 'Como a arquitetura brasileira contemporânea pode unir tradição e inovação sem cair em clichês ou tendências passageiras.',
  },
  {
    tag: 'Tendências',
    title: 'Tendências em arquitetura residencial para 2026',
    excerpt: 'O que esperar da arquitetura residencial neste ano: sustentabilidade, integração com a natureza e novos materiais.',
  },
  {
    tag: 'Sustentabilidade',
    title: 'Materiais sustentáveis na arquitetura contemporânea',
    excerpt: 'Como incorporar práticas sustentáveis sem comprometer a estética e o conforto dos projetos arquitetônicos.',
  },
  {
    tag: 'Cases',
    title: 'Casa da Oliveira: simplicidade, contemporaneidade e charme',
    excerpt: 'Um mergulho no processo criativo e nas decisões arquitetônicas que definiram este projeto residencial marcante.',
  },
];

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const hasPosts = posts.length > 0;

  return (
    <section className="px-6 md:px-[60px] py-20 md:py-[120px]">
      <ScrollReveal>
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta mb-4">
          Blog
        </div>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <h1 className="font-display text-[32px] md:text-[48px] font-bold text-brand-graphite leading-[1.1] mb-6 tracking-tight">
          Ideias e referências
        </h1>
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <p className="text-[17px] text-brand-gray max-w-[600px] leading-relaxed font-light">
          Reflexões sobre arquitetura, materiais, processo criativo e tendências.
        </p>
      </ScrollReveal>

      {hasPosts ? (
        /* ── Real posts from database ── */
        <ScrollReveal delay={300}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-brand-white rounded overflow-hidden transition-all duration-300 group no-underline hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-full aspect-[16/9] overflow-hidden bg-brand-cream">
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: post.cover_image_focal_point ?? 'center' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-brand-terracotta text-3xl">✦</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {post.blog_categories && (
                    <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-brand-terracotta mb-3">
                      {post.blog_categories.name}
                    </div>
                  )}
                  <h3 className="font-display text-lg font-semibold mb-2 text-brand-graphite leading-[1.3] group-hover:text-brand-terracotta transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-brand-gray leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  {post.published_at && (
                    <p className="text-xs text-brand-gray/50 mt-4 tracking-[0.1em] uppercase">
                      {new Date(post.published_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      ) : (
        /* ── Placeholder: no posts yet ── */
        <>
          <ScrollReveal delay={250}>
            <div className="mt-10 bg-brand-white rounded-lg p-6 border border-brand-cream inline-flex items-center gap-3">
              <span className="text-brand-terracotta text-xl">✦</span>
              <p className="text-brand-graphite text-[15px]">
                O blog está em preparação. Em breve, artigos sobre arquitetura, materiais e processo criativo.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {placeholder_posts.map((post, i) => (
                <div
                  key={i}
                  className="bg-brand-white rounded overflow-hidden transition-transform duration-300 cursor-default group opacity-80"
                >
                  <div className="h-[200px] bg-brand-cream flex items-center justify-center text-[13px] text-brand-gray tracking-[0.1em]">
                    EM BREVE
                  </div>
                  <div className="p-6">
                    <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-brand-terracotta mb-3">
                      {post.tag}
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2 text-brand-graphite leading-[1.3]">
                      {post.title}
                    </h3>
                    <p className="text-sm text-brand-gray leading-relaxed">
                      {post.excerpt}
                    </p>
                    <p className="text-xs text-brand-gray/50 mt-4 tracking-[0.1em] uppercase">
                      Em breve
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </>
      )}
    </section>
  );
}
