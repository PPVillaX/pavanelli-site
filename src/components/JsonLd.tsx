import { getContactSettings, getSeoSettings, getSocialSettings } from '@/lib/settings';

// Re-export client-safe JsonLd components for backward compatibility
export { ImageGalleryJsonLd, BreadcrumbJsonLd } from '@/components/JsonLdProject';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pavanelliarquitetura.com.br';

export async function LocalBusinessJsonLd() {
  const [contact, seo, social] = await Promise.all([
    getContactSettings(),
    getSeoSettings(),
    getSocialSettings(),
  ]);

  const sameAs: string[] = [];
  if (social.instagram_handle) {
    sameAs.push(`https://instagram.com/${social.instagram_handle}`);
  }
  if (social.linkedin_url) {
    sameAs.push(social.linkedin_url);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Architect'],
    '@id': `${BASE_URL}/#organization`,
    name: seo.site_name || undefined,
    description: seo.site_description || undefined,
    url: BASE_URL,
    telephone: contact.whatsapp_number ? `+${contact.whatsapp_number}` : undefined,
    email: contact.contact_email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address_full || undefined,
      addressLocality: 'Uberlândia',
      addressRegion: 'MG',
      postalCode: '38408-144',
      addressCountry: 'BR',
    },
    geo: contact.address_coords.lat !== 0 ? {
      '@type': 'GeoCoordinates',
      latitude: contact.address_coords.lat,
      longitude: contact.address_coords.lng,
    } : undefined,
    image: 'https://fgssgugdoatfchtcrlpa.supabase.co/storage/v1/object/public/project-images/uploads/ig_pa_oe-2-1774920597867.webp',
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00',
    },
    priceRange: '$$$',
    areaServed: contact.address_coords.lat !== 0 ? {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: contact.address_coords.lat,
        longitude: contact.address_coords.lng,
      },
      geoRadius: '500000',
    } : undefined,
    founder: {
      '@type': 'Person',
      name: 'Antônio Loyola Pavanelli',
      jobTitle: 'Arquiteto e Urbanista',
    },
    taxID: '29.736.785/0001-47',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
