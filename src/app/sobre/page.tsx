import type { Metadata } from 'next';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';
import { getProfileSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Conheça Antônio Pavanelli — arquiteto formado em Uberlândia com pós-graduação em Barcelona. Mais de 13 anos de experiência em projetos residenciais, comerciais e fazendas.',
  alternates: { canonical: '/sobre' },
  openGraph: {
    title: 'Sobre | Pavanelli Arquitetura',
    description: 'Conheça Antônio Pavanelli — arquiteto formado em Uberlândia com pós-graduação em Barcelona. Mais de 13 anos de experiência em projetos residenciais, comerciais e fazendas.',
    url: '/sobre',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre | Pavanelli Arquitetura',
    description: 'Conheça Antônio Pavanelli — arquiteto formado em Uberlândia com pós-graduação em Barcelona. Mais de 13 anos de experiência em projetos residenciais, comerciais e fazendas.',
  },
};

export default async function SobrePage() {
  const profile = await getProfileSettings();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pavanelliarquitetura.com.br';
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.sobre_name || 'Antônio Pavanelli',
    jobTitle: 'Arquiteto',
    url: `${siteUrl}/sobre`,
    image: profile.sobre_photo_url || undefined,
    worksFor: {
      '@type': 'Organization',
      name: 'Pavanelli Arquitetura + Interiores',
      url: siteUrl,
    },
    knowsAbout: ['Arquitetura Residencial', 'Arquitetura Comercial', 'Design de Interiores', 'Arquitetura de Fazendas', 'Arquitetura Sustentável'],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        recognizedBy: { '@type': 'Organization', name: 'Centro Universitário do Triângulo, Uberlândia' },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'postgraduate',
        recognizedBy: { '@type': 'Organization', name: 'Ramon Llull / La Salle, Barcelona' },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      {/* Hero */}
      <section className="bg-brand-white px-6 md:px-[60px] py-20 md:py-[120px]">
        <ScrollReveal>
          <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta mb-4">
            Sobre
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h1 className="font-display text-[32px] md:text-[48px] font-bold text-brand-graphite leading-[1.1] mb-6 tracking-tight">
            {profile.sobre_name}
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <p className="text-xl text-brand-gray max-w-[700px] leading-relaxed font-light">
            {profile.sobre_tagline}
          </p>
        </ScrollReveal>
      </section>

      {/* Bio */}
      <section className="px-6 md:px-[60px] py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
          <ScrollReveal>
            {profile.sobre_photo_url ? (
              <div className="w-full aspect-[3/4] overflow-hidden rounded sticky top-24">
                <img
                  src={profile.sobre_photo_url}
                  alt={profile.sobre_name}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: profile.sobre_photo_focal_point || '50% 50%' }}
                />
              </div>
            ) : (
              <div className="w-full aspect-[3/4] bg-brand-cream rounded flex items-center justify-center text-brand-gray text-sm tracking-[0.1em] text-center sticky top-24">
                FOTO DO ANTÔNIO<br />(aguardando envio)
              </div>
            )}
          </ScrollReveal>

          <div>
            <ScrollReveal>
              <h2 className="font-display text-[28px] md:text-[32px] font-semibold mb-8 text-brand-graphite">
                Uma arquitetura com identidade
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="space-y-6 text-base text-brand-gray leading-[1.8] font-light">
                <p>{profile.sobre_bio_1}</p>
                <p>{profile.sobre_bio_2}</p>
                <p>{profile.sobre_bio_3}</p>
                <p>{profile.sobre_bio_4}</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="mt-12 pt-8 border-t border-brand-cream">
                <h3 className="font-display text-xl font-semibold mb-6 text-brand-graphite">
                  Formação e credenciais
                </h3>
                <ul className="space-y-3 text-brand-gray text-[15px]">
                  <li className="flex items-start gap-3">
                    <span className="text-brand-terracotta mt-1">▸</span>
                    Arquitetura e Urbanismo — Centro Universitário do Triângulo, Uberlândia
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-terracotta mt-1">▸</span>
                    Pós-graduação em Arquitetura Sustentável e Eficiência Energética — Ramon Llull / La Salle, Barcelona (2015-2016)
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-terracotta mt-1">▸</span>
                    {profile.sobre_years_experience} anos de experiência profissional
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-terracotta mt-1">▸</span>
                    {profile.sobre_projects_count} projetos entregues em todo o Brasil
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="mt-12 pt-8 border-t border-brand-cream">
                <h3 className="font-display text-xl font-semibold mb-4 text-brand-graphite">
                  Filosofia
                </h3>
                <blockquote className="text-lg text-brand-graphite italic leading-relaxed border-l-4 border-brand-terracotta pl-6">
                  &ldquo;{profile.sobre_philosophy_quote}&rdquo;
                </blockquote>
                <p className="mt-4 text-sm text-brand-gray tracking-[0.05em]">
                  — {profile.sobre_name}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-dark px-6 md:px-[60px] py-16 md:py-20">
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-brand-terracotta leading-none">{profile.sobre_years_experience}</div>
              <div className="text-sm text-white/50 tracking-[0.05em] mt-3">Anos de experiência</div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-brand-terracotta leading-none">{profile.sobre_projects_count}</div>
              <div className="text-sm text-white/50 tracking-[0.05em] mt-3">Projetos entregues</div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-brand-terracotta leading-none">{profile.sobre_stat_3_value}</div>
              <div className="text-sm text-white/50 tracking-[0.05em] mt-3">{profile.sobre_stat_3_label}</div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-brand-terracotta leading-none">{profile.sobre_stat_4_value}</div>
              <div className="text-sm text-white/50 tracking-[0.05em] mt-3">{profile.sobre_stat_4_label}</div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-[60px] py-20 md:py-[120px] text-center">
        <ScrollReveal>
          <h2 className="font-display text-[28px] md:text-[36px] font-bold text-brand-graphite mb-6 tracking-tight">
            Vamos construir algo juntos?
          </h2>
          <p className="text-brand-gray text-lg max-w-[500px] mx-auto mb-10 font-light">
            Cada projeto começa com uma conversa. Conte-nos sobre o seu.
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
