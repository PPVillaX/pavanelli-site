import Script from 'next/script';
import { getGA4Id } from '@/lib/queries';

export default async function GA4Script() {
  let ga4Id: string | null = null;

  try {
    ga4Id = await getGA4Id();
  } catch {
    // Silently fail if DB is unavailable
    return null;
  }

  if (!ga4Id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ga4Id}');
        `}
      </Script>
    </>
  );
}
