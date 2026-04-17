import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import GA4Script from "@/components/GA4Script";
import SiteChrome from "@/components/SiteChrome";
import BottomNav from "@/components/BottomNav";
import { PageTransition } from "@/components/PageTransition";
import { getSeoSettings, getContactSettings, getSocialSettings, getAppearanceSettings } from "@/lib/settings";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pavanelliarquitetura.com.br';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: seo.site_name || 'Pavanelli Arquitetura + Interiores',
      template: `%s | ${seo.site_name || 'Pavanelli Arquitetura + Interiores'}`,
    },
    description: seo.site_description ||
      'Escritório de arquitetura em Uberlândia especializado em projetos residenciais, comerciais e fazendas. Brasilidade, contemporaneidade e personalidade em cada projeto.',
    keywords: [
      'arquiteto em uberlândia',
      'escritório de arquitetura uberlândia',
      'projeto residencial uberlândia',
      'arquiteto interiores uberlândia',
      'pavanelli arquitetura',
    ],
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: BASE_URL,
      siteName: seo.site_name || 'Pavanelli Arquitetura',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [contact, social, appearance, seo] = await Promise.all([
    getContactSettings(),
    getSocialSettings(),
    getAppearanceSettings(),
    getSeoSettings(),
  ]);

  const styleContent = `:root { --color-brand-terracotta: ${appearance.brand_primary_color || '#C49A6C'}; --color-brand-terracotta-dark: ${appearance.brand_primary_dark_color || '#b08a5e'}; --color-brand-offwhite: ${appearance.brand_background_color || '#F5F2EE'}; --color-brand-graphite: ${appearance.brand_graphite_color || '#3D3D3D'}; }`;

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seo.site_name || 'Pavanelli Arquitetura + Interiores',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/portfolio?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="pt-BR" className={`${inter.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://fgssgugdoatfchtcrlpa.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fgssgugdoatfchtcrlpa.supabase.co" />
        <style dangerouslySetInnerHTML={{ __html: styleContent }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <PageTransition />
        <SiteChrome><Header instagramHandle={social.instagram_handle} /></SiteChrome>
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <SiteChrome><Footer /></SiteChrome>
        <SiteChrome><BottomNav /></SiteChrome>
        <SiteChrome>
          <WhatsAppButton
            phone={contact.whatsapp_number}
            message={contact.whatsapp_default_message}
          />
        </SiteChrome>
        <GA4Script />
      </body>
    </html>
  );
}
