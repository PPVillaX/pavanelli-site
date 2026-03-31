'use client';

import Link from 'next/link';
import { useTracking } from '@/hooks/useTracking';

interface WhatsAppButtonProps {
  phone: string;
  message: string;
}

export default function WhatsAppButton({ phone, message }: WhatsAppButtonProps) {
  const { track } = useTracking();

  function handleClick() {
    track('whatsapp_click', { page: typeof window !== 'undefined' ? window.location.pathname : '/' });
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'whatsapp_click', { event_category: 'engagement' });
    }
  }

  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <Link
      href={href}
      target="_blank"
      onClick={handleClick}
      className="fixed bottom-[100px] md:bottom-[30px] right-[30px] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center z-[200] shadow-[0_4px_16px_rgba(37,211,102,0.4)] cursor-pointer hover:scale-110 transition-transform duration-300"
      aria-label="Contato via WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.655-1.44A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.18-.589-5.918-1.614l-.424-.253-2.762.855.874-2.684-.278-.441A9.777 9.777 0 012.182 12 9.818 9.818 0 0112 2.182 9.818 9.818 0 0121.818 12 9.818 9.818 0 0112 21.818z" />
      </svg>
    </Link>
  );
}
