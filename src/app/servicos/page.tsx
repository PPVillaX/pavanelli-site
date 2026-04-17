import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedServices } from '@/lib/queries';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Serviços',
  description: 'Arquitetura residencial, comercial e fazendas em Uberlândia. Conheça os serviços da Pavanelli Arquitetura — do conceito à obra.',
  alternates: { canonical: '/servicos' },
  openGraph: {
    title: 'Serviços | Pavanelli Arquitetura',
    description: 'Projetos residenciais, comerciais e fazendas com identidade única. Arquiteto em Uberlândia.',
    url: '/servicos',
    type: 'website',
  },
};

export default async function ServicosPage() {
  const services = await getPublishedServices();

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Serviços de Arquitetura — Pavanelli Arquitetura',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://pavanelliarquitetura.com.br/servicos/${s.slug}`,
      name: s.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <div className="px-6 md:px-[60px] py-20 md:py-[120px]">
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta mb-4">
          O que fazemos
        </div>
        <h1 className="font-display text-[32px] md:text-[48px] font-bold text-brand-graphite leading-[1.1] mb-6 tracking-tight">
          Serviços de arquitetura<br className="hidden md:block" /> em Uberlândia
        </h1>
        <p className="text-[17px] text-brand-gray max-w-[600px] leading-relaxed font-light mb-16">
          Do conceito à obra — projetos residenciais, comerciais e fazendas com identidade única, brasilidade e contemporaneidade.
        </p>

        {services.length === 0 ? (
          <div className="bg-brand-white rounded-lg p-8 border border-brand-cream text-center max-w-lg">
            <span className="text-brand-terracotta text-2xl block mb-4">✦</span>
            <p className="text-brand-graphite text-[15px]">
              Em breve, conheça todos os nossos serviços de arquitetura.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(service => (
              <Link
                key={service.id}
                href={`/servicos/${service.slug}`}
                className="group border border-brand-cream rounded-lg overflow-hidden no-underline flex flex-col transition-shadow hover:shadow-lg hover:-translate-y-1 duration-300"
              >
                <div className="w-full aspect-[4/3] overflow-hidden bg-brand-cream">
                  {service.cover_image_url ? (
                    <img
                      src={service.cover_image_url}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: service.cover_image_focal_point ?? 'center' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-brand-terracotta text-4xl">✦</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="font-display text-[20px] font-bold text-brand-graphite mb-2 leading-snug group-hover:text-brand-terracotta transition-colors">
                    {service.title}
                  </h2>
                  {service.tagline && (
                    <p className="text-[14px] text-brand-gray leading-relaxed font-light flex-1">
                      {service.tagline}
                    </p>
                  )}
                  <span className="text-[13px] font-semibold text-brand-terracotta mt-4 block">
                    Saiba mais →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 pt-16 border-t border-brand-cream text-center">
          <h2 className="font-display text-[24px] md:text-[32px] font-bold text-brand-graphite mb-4 tracking-tight">
            Pronto para começar seu projeto?
          </h2>
          <p className="text-brand-gray text-[15px] max-w-[420px] mx-auto mb-8 font-light leading-relaxed">
            Cada projeto começa com uma conversa. Conte-nos sobre o seu.
          </p>
          <Link
            href="/contato"
            className="inline-block bg-brand-terracotta text-white px-8 py-3.5 text-[13px] font-semibold tracking-[0.1em] uppercase no-underline rounded transition-all duration-300 hover:bg-brand-terracotta-dark hover:-translate-y-0.5"
          >
            Fale conosco
          </Link>
        </div>
      </div>
    </>
  );
}
