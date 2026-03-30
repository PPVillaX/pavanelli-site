import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import ScrollReveal from '@/components/ScrollReveal';
import { getContactSettings, getSocialSettings, getSeoSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com a Pavanelli Arquitetura. Escritório em Uberlândia, MG — Gávea Business, sala 330. WhatsApp, e-mail e formulário de contato.',
  alternates: { canonical: '/contato' },
  openGraph: {
    title: 'Contato | Pavanelli Arquitetura',
    description: 'Entre em contato com a Pavanelli Arquitetura. Escritório em Uberlândia, MG.',
    url: '/contato',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contato | Pavanelli Arquitetura',
    description: 'Entre em contato com a Pavanelli Arquitetura. Escritório em Uberlândia, MG.',
  },
};

export default async function ContatoPage() {
  const [contact, social, seo] = await Promise.all([
    getContactSettings(),
    getSocialSettings(),
    getSeoSettings(),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pavanelliarquitetura.com.br';
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seo.site_name || 'Pavanelli Arquitetura + Interiores',
    url: siteUrl,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contact.whatsapp_number ? `+${contact.whatsapp_number}` : undefined,
      email: contact.contact_email || undefined,
      contactType: 'customer service',
      areaServed: 'Uberlândia, MG',
      availableLanguage: 'Portuguese',
    },
    address: contact.address_full ? {
      '@type': 'PostalAddress',
      streetAddress: contact.address_full,
      addressLocality: 'Uberlândia',
      addressRegion: 'MG',
      addressCountry: 'BR',
    } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
    <section className="bg-brand-dark text-white px-6 md:px-[60px] py-20 md:py-[120px]">
      <ScrollReveal>
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta mb-4">
          Contato
        </div>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <h1 className="font-display text-[32px] md:text-[48px] font-bold text-white leading-[1.1] mb-6 tracking-tight">
          Vamos conversar sobre<br />o seu projeto
        </h1>
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <p className="text-[17px] text-white/60 max-w-[600px] leading-relaxed font-light">
          Estamos prontos para transformar suas ideias em espaços com identidade.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 mt-16">
        <ScrollReveal delay={300}>
          <ContactForm />
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <div>
            <h3 className="font-display text-2xl font-semibold mb-6">
              {seo.site_name || 'Pavanelli Arquitetura'}
            </h3>

            <div className="space-y-6">
              {contact.address_full && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/[0.08] flex items-center justify-center text-lg shrink-0">
                    📍
                  </div>
                  <div className="text-[15px] text-white/70 leading-relaxed">
                    <strong className="text-white font-medium block mb-1">Endereço</strong>
                    {contact.address_full}
                  </div>
                </div>
              )}

              {contact.whatsapp_number && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/[0.08] flex items-center justify-center text-lg shrink-0">
                    📱
                  </div>
                  <div className="text-[15px] text-white/70 leading-relaxed">
                    <strong className="text-white font-medium block mb-1">WhatsApp</strong>
                    <a href={`https://wa.me/${contact.whatsapp_number}`} target="_blank" className="text-white/70 no-underline hover:text-brand-terracotta transition-colors">
                      +{contact.whatsapp_number}
                    </a>
                  </div>
                </div>
              )}

              {contact.contact_email && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/[0.08] flex items-center justify-center text-lg shrink-0">
                    ✉️
                  </div>
                  <div className="text-[15px] text-white/70 leading-relaxed">
                    <strong className="text-white font-medium block mb-1">E-mail</strong>
                    <a href={`mailto:${contact.contact_email}`} className="text-white/70 no-underline hover:text-brand-terracotta transition-colors">
                      {contact.contact_email}
                    </a>
                  </div>
                </div>
              )}

              {social.instagram_handle && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/[0.08] flex items-center justify-center text-lg shrink-0">
                    📷
                  </div>
                  <div className="text-[15px] text-white/70 leading-relaxed">
                    <strong className="text-white font-medium block mb-1">Instagram</strong>
                    <a href={`https://instagram.com/${social.instagram_handle}`} target="_blank" className="text-white/70 no-underline hover:text-brand-terracotta transition-colors">
                      @{social.instagram_handle}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Google Maps */}
            {contact.address_coords.lat !== 0 && (
              <div className="mt-8 rounded overflow-hidden border border-white/[0.08]">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.7!2d${contact.address_coords.lng}!3d${contact.address_coords.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94a44490c7e0a3ab%3A0x4e6f1c7a1c3c0c0!2sAv.+Nicomedes+Alves+dos+Santos%2C+3600+-+Santa+M%C3%B4nica%2C+Uberl%C3%A2ndia+-+MG!5e0!3m2!1spt-BR!2sbr!4v1`}
                  width="100%"
                  height="250"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.9)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Pavanelli Arquitetura"
                />
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
    </>
  );
}
