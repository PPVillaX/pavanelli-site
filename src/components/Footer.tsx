import Link from 'next/link';
import { getContactSettings, getSocialSettings, getSeoSettings } from '@/lib/settings';

export default async function Footer() {
  const [contact, social, seo] = await Promise.all([
    getContactSettings(),
    getSocialSettings(),
    getSeoSettings(),
  ]);

  return (
    <footer className="bg-brand-graphite px-6 md:px-[60px] py-10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-[13px]">
      <div>
        © 2026 {seo.site_name || 'Pavanelli Arquitetura'} · CNPJ 29.736.785/0001-47
      </div>
      <div className="flex gap-5">
        {social.instagram_handle && (
          <Link
            href={`https://instagram.com/${social.instagram_handle}`}
            target="_blank"
            className="text-white/40 no-underline text-[13px] hover:text-brand-terracotta transition-colors"
          >
            Instagram
          </Link>
        )}
        {contact.whatsapp_number && (
          <Link
            href={`https://wa.me/${contact.whatsapp_number}`}
            target="_blank"
            className="text-white/40 no-underline text-[13px] hover:text-brand-terracotta transition-colors"
          >
            WhatsApp
          </Link>
        )}
        {contact.contact_email && (
          <Link
            href={`mailto:${contact.contact_email}`}
            className="text-white/40 no-underline text-[13px] hover:text-brand-terracotta transition-colors"
          >
            E-mail
          </Link>
        )}
      </div>
    </footer>
  );
}
