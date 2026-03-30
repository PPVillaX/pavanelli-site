'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { Camera, ImageUp, Globe } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────

interface Props {
  initialSettings: Record<string, unknown>;
}

type TabId = 'contato' | 'redes' | 'seo' | 'conteudo' | 'aparencia' | 'integracoes' | 'perfil';

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: 'contato', label: 'Contato' },
  { id: 'redes', label: 'Redes Sociais' },
  { id: 'seo', label: 'SEO' },
  { id: 'conteudo', label: 'Conteúdo' },
  { id: 'aparencia', label: 'Aparência' },
  { id: 'integracoes', label: 'Integrações' },
  { id: 'perfil', label: 'Perfil' },
];

// ─── Helpers ──────────────────────────────────────────────────────

function strVal(settings: Record<string, unknown>, key: string): string {
  const v = settings[key];
  return typeof v === 'string' ? v : '';
}

function boolVal(settings: Record<string, unknown>, key: string, fallback = true): boolean {
  const v = settings[key];
  return typeof v === 'boolean' ? v : fallback;
}

function coordsVal(settings: Record<string, unknown>): { lat: string; lng: string } {
  const v = settings['address_coords'];
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    const c = v as Record<string, unknown>;
    return {
      lat: typeof c.lat === 'number' ? String(c.lat) : '',
      lng: typeof c.lng === 'number' ? String(c.lng) : '',
    };
  }
  return { lat: '', lng: '' };
}

// ─── Shared UI primitives ─────────────────────────────────────────

const inputClass =
  'w-full px-4 py-3 border border-[#d1d5db] rounded text-brand-graphite text-[15px] outline-none transition-colors focus:border-brand-terracotta bg-white';
const labelClass =
  'block text-xs text-brand-gray uppercase tracking-[0.08em] mb-2 font-medium';
const helpClass = 'text-xs text-brand-gray mt-1';
const fieldClass = 'mb-5';

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={fieldClass}>
      <label className={labelClass}>{label}</label>
      {children}
      {help && <p className={helpClass}>{help}</p>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────

export default function SettingsForm({ initialSettings }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('contato');

  // ── Contato state ──
  const [whatsappNumber, setWhatsappNumber] = useState(strVal(initialSettings, 'whatsapp_number'));
  const [whatsappMessage, setWhatsappMessage] = useState(strVal(initialSettings, 'whatsapp_default_message'));
  const [contactEmail, setContactEmail] = useState(strVal(initialSettings, 'contact_email'));
  const [notificationEmail, setNotificationEmail] = useState(strVal(initialSettings, 'notification_email'));
  const [addressFull, setAddressFull] = useState(strVal(initialSettings, 'address_full'));
  const [coords, setCoords] = useState(coordsVal(initialSettings));
  const [businessHours, setBusinessHours] = useState(strVal(initialSettings, 'business_hours'));

  // ── Redes Sociais state ──
  const [instagramHandle, setInstagramHandle] = useState(strVal(initialSettings, 'instagram_handle'));
  const [instagramEnabled, setInstagramEnabled] = useState(boolVal(initialSettings, 'instagram_enabled'));
  const [linkedinUrl, setLinkedinUrl] = useState(strVal(initialSettings, 'linkedin_url'));

  // ── SEO state ──
  const [siteName, setSiteName] = useState(strVal(initialSettings, 'site_name'));
  const [siteDescription, setSiteDescription] = useState(strVal(initialSettings, 'site_description'));
  const [ogImage, setOgImage] = useState(strVal(initialSettings, 'og_default_image'));
  const [faviconUrl, setFaviconUrl] = useState(strVal(initialSettings, 'favicon_url'));
  const [faviconUploading, setFaviconUploading] = useState(false);
  const [ogImageUploading, setOgImageUploading] = useState(false);

  // ── Conteúdo state ──
  const [heroTitle, setHeroTitle] = useState(strVal(initialSettings, 'cta_hero_title'));
  const [heroSubtitle, setHeroSubtitle] = useState(strVal(initialSettings, 'cta_hero_subtitle'));
  const [ctaContact, setCtaContact] = useState(strVal(initialSettings, 'cta_contact_text'));
  const [ctaPortfolio, setCtaPortfolio] = useState(strVal(initialSettings, 'cta_portfolio_text'));
  const [logoUrl, setLogoUrl] = useState(strVal(initialSettings, 'logo_url'));
  const [logoUploading, setLogoUploading] = useState(false);
  const [overlayColor, setOverlayColor] = useState(strVal(initialSettings, 'featured_overlay_color') || '#2A2A2A');
  const [overlayOpacity, setOverlayOpacity] = useState(strVal(initialSettings, 'featured_overlay_opacity') || '0');

  // ── Aparência state ──
  const [brandPrimary, setBrandPrimary] = useState(strVal(initialSettings, 'brand_primary_color') || '#C49A6C');
  const [brandBackground, setBrandBackground] = useState(strVal(initialSettings, 'brand_background_color') || '#F5F2EE');

  // ── Integrações state ──
  const [ga4Id, setGa4Id] = useState(strVal(initialSettings, 'ga4_measurement_id'));

  // ── Perfil state ──
  const [sobrePhotoUrl, setSobrePhotoUrl] = useState(strVal(initialSettings, 'sobre_photo_url'));
  const [sobrePhotoFocalPoint, setSobrePhotoFocalPoint] = useState(
    strVal(initialSettings, 'sobre_photo_focal_point') || '50% 50%'
  );
  const [profilePhotoUploading, setProfilePhotoUploading] = useState(false);
  const [sobreName, setSobreName] = useState(strVal(initialSettings, 'sobre_name'));
  const [sobreTagline, setSobreTagline] = useState(strVal(initialSettings, 'sobre_tagline'));
  const [sobreBioIntro, setSobreBioIntro] = useState(strVal(initialSettings, 'sobre_bio_intro'));
  const [sobreBio1, setSobreBio1] = useState(strVal(initialSettings, 'sobre_bio_1'));
  const [sobreBio2, setSobreBio2] = useState(strVal(initialSettings, 'sobre_bio_2'));
  const [sobreBio3, setSobreBio3] = useState(strVal(initialSettings, 'sobre_bio_3'));
  const [sobreBio4, setSobreBio4] = useState(strVal(initialSettings, 'sobre_bio_4'));
  const [sobrePhilosophyQuote, setSobrePhilosophyQuote] = useState(strVal(initialSettings, 'sobre_philosophy_quote'));
  const [sobreYearsExperience, setSobreYearsExperience] = useState(strVal(initialSettings, 'sobre_years_experience'));
  const [sobreProjectsCount, setSobreProjectsCount] = useState(strVal(initialSettings, 'sobre_projects_count'));
  const [sobreStat3Value, setSobreStat3Value] = useState(strVal(initialSettings, 'sobre_stat_3_value'));
  const [sobreStat3Label, setSobreStat3Label] = useState(strVal(initialSettings, 'sobre_stat_3_label'));
  const [sobreStat4Value, setSobreStat4Value] = useState(strVal(initialSettings, 'sobre_stat_4_value'));
  const [sobreStat4Label, setSobreStat4Label] = useState(strVal(initialSettings, 'sobre_stat_4_label'));

  // ── Save state ──
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [saveError, setSaveError] = useState('');

  // ── Validation ──
  function validateTab(): string | null {
    if (activeTab === 'contato') {
      if (!whatsappNumber.trim()) return 'Número do WhatsApp é obrigatório.';
      if (!contactEmail.trim()) return 'E-mail de contato público é obrigatório.';
    }
    if (activeTab === 'seo') {
      if (!siteName.trim()) return 'Nome do site é obrigatório.';
    }
    return null;
  }

  // ── Build upsert rows for current tab ──
  function buildRows(): { key: string; value: unknown }[] {
    if (activeTab === 'contato') {
      const lat = parseFloat(coords.lat);
      const lng = parseFloat(coords.lng);
      return [
        { key: 'whatsapp_number', value: whatsappNumber.trim() },
        { key: 'whatsapp_default_message', value: whatsappMessage },
        { key: 'contact_email', value: contactEmail.trim() },
        { key: 'notification_email', value: notificationEmail.trim() },
        { key: 'address_full', value: addressFull },
        {
          key: 'address_coords',
          value: {
            lat: isNaN(lat) ? 0 : lat,
            lng: isNaN(lng) ? 0 : lng,
          },
        },
        { key: 'business_hours', value: businessHours },
      ];
    }
    if (activeTab === 'redes') {
      return [
        { key: 'instagram_handle', value: instagramHandle.replace(/^@/, '').trim() },
        { key: 'instagram_enabled', value: instagramEnabled },
        { key: 'linkedin_url', value: linkedinUrl.trim() },
      ];
    }
    if (activeTab === 'seo') {
      return [
        { key: 'site_name', value: siteName.trim() },
        { key: 'site_description', value: siteDescription },
        { key: 'og_default_image', value: ogImage.trim() },
        { key: 'favicon_url', value: faviconUrl.trim() },
      ];
    }
    if (activeTab === 'conteudo') {
      return [
        { key: 'cta_hero_title', value: heroTitle },
        { key: 'cta_hero_subtitle', value: heroSubtitle },
        { key: 'cta_contact_text', value: ctaContact },
        { key: 'cta_portfolio_text', value: ctaPortfolio },
        { key: 'logo_url', value: logoUrl.trim() },
        { key: 'featured_overlay_color', value: overlayColor },
        { key: 'featured_overlay_opacity', value: overlayOpacity },
      ];
    }
    if (activeTab === 'aparencia') {
      return [
        { key: 'brand_primary_color', value: brandPrimary },
        { key: 'brand_background_color', value: brandBackground },
      ];
    }
    if (activeTab === 'integracoes') {
      return [{ key: 'ga4_measurement_id', value: ga4Id.trim() }];
    }
    if (activeTab === 'perfil') {
      return [
        { key: 'sobre_photo_url', value: sobrePhotoUrl.trim() },
        { key: 'sobre_photo_focal_point', value: sobrePhotoFocalPoint },
        { key: 'sobre_name', value: sobreName.trim() },
        { key: 'sobre_tagline', value: sobreTagline.trim() },
        { key: 'sobre_bio_intro', value: sobreBioIntro },
        { key: 'sobre_bio_1', value: sobreBio1 },
        { key: 'sobre_bio_2', value: sobreBio2 },
        { key: 'sobre_bio_3', value: sobreBio3 },
        { key: 'sobre_bio_4', value: sobreBio4 },
        { key: 'sobre_philosophy_quote', value: sobrePhilosophyQuote },
        { key: 'sobre_years_experience', value: sobreYearsExperience.trim() },
        { key: 'sobre_projects_count', value: sobreProjectsCount.trim() },
        { key: 'sobre_stat_3_value', value: sobreStat3Value.trim() },
        { key: 'sobre_stat_3_label', value: sobreStat3Label.trim() },
        { key: 'sobre_stat_4_value', value: sobreStat4Value.trim() },
        { key: 'sobre_stat_4_label', value: sobreStat4Label.trim() },
      ];
    }
    return [];
  }

  async function handleSave() {
    setSaveError('');
    const validationError = validateTab();
    if (validationError) {
      setSaveError(validationError);
      return;
    }

    setSaving(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const rows = buildRows();
      const { error } = await supabase
        .from('site_settings')
        .upsert(rows, { onConflict: 'key' });

      if (error) {
        setSaveError(`Erro ao salvar: ${error.message}`);
        return;
      }

      // Bust ISR cache
      try {
        await fetch('/api/revalidate', { method: 'POST' });
      } catch {
        // revalidate endpoint may not exist in all envs; ignore
      }
      router.refresh();

      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setSaveError(`Erro ao salvar: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  // ── Generic image upload ──
  async function uploadImage(file: File, folder: string): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) return null;
    const result = await res.json();
    return result.url as string;
  }

  async function handleFaviconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFaviconUploading(true);
    const url = await uploadImage(file, 'settings');
    if (url) setFaviconUrl(url);
    setFaviconUploading(false);
  }

  async function handleOgImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setOgImageUploading(true);
    const url = await uploadImage(file, 'settings');
    if (url) setOgImage(url);
    setOgImageUploading(false);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    const url = await uploadImage(file, 'settings');
    if (url) setLogoUrl(url);
    setLogoUploading(false);
  }

  // ── Profile photo upload ──
  async function handleProfilePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePhotoUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'profile');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (res.ok) setSobrePhotoUrl(result.url);
    } catch {}
    setProfilePhotoUploading(false);
  }

  // ── Tab button style ──
  function tabStyle(id: TabId) {
    const isActive = activeTab === id;
    return [
      'px-4 py-2.5 text-sm font-medium whitespace-nowrap cursor-pointer bg-transparent border-none transition-colors',
      'border-b-2',
      isActive
        ? 'border-[#C49A6C] text-brand-graphite'
        : 'border-transparent text-brand-gray hover:text-brand-graphite hover:border-[#C49A6C]/40',
    ].join(' ');
  }

  return (
    <div className="max-w-2xl">
      {/* Tab bar */}
      <div className="flex border-b border-[#e5e7eb] mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={tabStyle(tab.id)}
            onClick={() => {
              setSaveError('');
              setSavedOk(false);
              setActiveTab(tab.id);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">

        {/* ─── Tab: Contato ───────────────────────────────────── */}
        {activeTab === 'contato' && (
          <div>
            <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3 mb-5">
              Contato
            </h2>

            <Field
              label="Número do WhatsApp"
              help="Número completo com DDI e DDD, sem espaços ou símbolos"
            >
              <input
                type="text"
                value={whatsappNumber}
                onChange={e => setWhatsappNumber(e.target.value)}
                className={inputClass}
                placeholder="Ex: 5511999999999"
              />
            </Field>

            <Field
              label="Mensagem padrão do WhatsApp"
              help="Mensagem exibida ao cliente ao clicar no botão flutuante"
            >
              <textarea
                value={whatsappMessage}
                onChange={e => setWhatsappMessage(e.target.value)}
                className={`${inputClass} min-h-[90px] resize-y`}
                rows={3}
              />
            </Field>

            <Field label="E-mail de contato público">
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field
              label="E-mail de notificação"
              help="E-mail que recebe os formulários de contato do site"
            >
              <input
                type="email"
                value={notificationEmail}
                onChange={e => setNotificationEmail(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field
              label="Endereço completo"
              help="Exibido na página de contato e no Google Maps embed"
            >
              <input
                type="text"
                value={addressFull}
                onChange={e => setAddressFull(e.target.value)}
                className={inputClass}
              />
            </Field>

            <div className={fieldClass}>
              <span className={labelClass}>Coordenadas do endereço</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-brand-gray mb-1">Latitude</label>
                  <input
                    type="text"
                    value={coords.lat}
                    onChange={e => setCoords(c => ({ ...c, lat: e.target.value }))}
                    className={inputClass}
                    placeholder="-18.918"
                  />
                </div>
                <div>
                  <label className="block text-xs text-brand-gray mb-1">Longitude</label>
                  <input
                    type="text"
                    value={coords.lng}
                    onChange={e => setCoords(c => ({ ...c, lng: e.target.value }))}
                    className={inputClass}
                    placeholder="-48.275"
                  />
                </div>
              </div>
            </div>

            <Field label="Horário de atendimento">
              <input
                type="text"
                value={businessHours}
                onChange={e => setBusinessHours(e.target.value)}
                className={inputClass}
                placeholder="Seg–Sex, 9h–18h"
              />
            </Field>
          </div>
        )}

        {/* ─── Tab: Redes Sociais ─────────────────────────────── */}
        {activeTab === 'redes' && (
          <div>
            <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3 mb-5">
              Redes Sociais
            </h2>

            <Field
              label="Handle do Instagram"
              help="Sem o @ no início"
            >
              <input
                type="text"
                value={instagramHandle}
                onChange={e => setInstagramHandle(e.target.value)}
                className={inputClass}
                placeholder="pavanelliarquitetura"
              />
            </Field>

            <div className={fieldClass}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={instagramEnabled}
                  onChange={e => setInstagramEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#C49A6C]"
                />
                <span className="text-sm text-brand-graphite">
                  Exibir seção do Instagram na home
                </span>
              </label>
            </div>

            <Field label="URL do LinkedIn">
              <input
                type="url"
                value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
                className={inputClass}
                placeholder="https://linkedin.com/company/pavanelli"
              />
            </Field>
          </div>
        )}

        {/* ─── Tab: SEO ────────────────────────────────────────── */}
        {activeTab === 'seo' && (
          <div>
            <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3 mb-5">
              SEO
            </h2>

            <Field label="Nome do site">
              <input
                type="text"
                value={siteName}
                onChange={e => setSiteName(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field
              label="Meta description padrão"
              help="Aparece nos resultados do Google. Máximo 160 caracteres."
            >
              <textarea
                value={siteDescription}
                onChange={e => setSiteDescription(e.target.value)}
                className={`${inputClass} min-h-[90px] resize-y`}
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-brand-gray/60 mt-1 text-right">
                {siteDescription.length}/160
              </p>
            </Field>

            <div className={fieldClass}>
              <label className={labelClass}>Imagem OpenGraph padrão</label>
              {ogImage && (
                <div className="relative w-full max-w-[320px] aspect-[1200/630] rounded overflow-hidden bg-gray-100 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ogImage} alt="OG preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setOgImage('')}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center cursor-pointer border-none"
                  >✕</button>
                </div>
              )}
              <label className="inline-block px-4 py-2 text-sm text-brand-terracotta border border-brand-terracotta rounded cursor-pointer hover:bg-brand-terracotta/5 transition-colors">
                <span className="flex items-center gap-1.5"><ImageUp size={14} strokeWidth={1.5} />{ogImageUploading ? 'Enviando...' : 'Upload imagem OG'}</span>
                <input type="file" accept="image/*" onChange={handleOgImageUpload} className="hidden" />
              </label>
              <p className={helpClass + ' mt-1'}>Proporção ideal: 1200×630px. JPG, PNG ou WebP.</p>
            </div>

            <div className={fieldClass}>
              <label className={labelClass}>Favicon</label>
              {faviconUrl && (
                <div className="flex items-center gap-3 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={faviconUrl} alt="Favicon" className="w-8 h-8 rounded object-contain border border-[#e5e7eb]" />
                  <button
                    type="button"
                    onClick={() => setFaviconUrl('')}
                    className="text-xs text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer"
                  >Remover</button>
                </div>
              )}
              <label className="inline-block px-4 py-2 text-sm text-brand-terracotta border border-brand-terracotta rounded cursor-pointer hover:bg-brand-terracotta/5 transition-colors">
                <span className="flex items-center gap-1.5"><Globe size={14} strokeWidth={1.5} />{faviconUploading ? 'Enviando...' : 'Upload favicon'}</span>
                <input type="file" accept="image/*,.ico" onChange={handleFaviconUpload} className="hidden" />
              </label>
              <p className={helpClass + ' mt-1'}>Recomendado: 32×32 ou 64×64px. PNG, ICO ou WebP.</p>
            </div>
          </div>
        )}

        {/* ─── Tab: Conteúdo ───────────────────────────────────── */}
        {activeTab === 'conteudo' && (
          <div>
            <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3 mb-5">
              Conteúdo
            </h2>

            <Field label="Título do Hero (home)">
              <input
                type="text"
                value={heroTitle}
                onChange={e => setHeroTitle(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Subtítulo do Hero (home)">
              <textarea
                value={heroSubtitle}
                onChange={e => setHeroSubtitle(e.target.value)}
                className={`${inputClass} min-h-[90px] resize-y`}
                rows={3}
              />
            </Field>

            <Field label="Texto do CTA de contato">
              <input
                type="text"
                value={ctaContact}
                onChange={e => setCtaContact(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Texto do botão 'Ver Portfólio'">
              <input
                type="text"
                value={ctaPortfolio}
                onChange={e => setCtaPortfolio(e.target.value)}
                className={inputClass}
              />
            </Field>

            <div className={fieldClass}>
              <label className={labelClass}>Logotipo</label>
              {logoUrl && (
                <div className="relative inline-flex items-center justify-center w-48 h-20 rounded bg-gray-100 border border-[#e5e7eb] mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain p-2" />
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center cursor-pointer border-none"
                  >✕</button>
                </div>
              )}
              <label className="inline-block px-4 py-2 text-sm text-brand-terracotta border border-brand-terracotta rounded cursor-pointer hover:bg-brand-terracotta/5 transition-colors">
                <span className="flex items-center gap-1.5"><ImageUp size={14} strokeWidth={1.5} />{logoUploading ? 'Enviando...' : 'Upload logotipo'}</span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
              <p className={helpClass + ' mt-1'}>PNG ou SVG com fundo transparente, altura mínima 60px.</p>
            </div>

            <div className={fieldClass}>
              <span className={labelClass}>Máscara de cor nos projetos em destaque</span>
              <p className="text-xs text-brand-gray mb-3">Tonalidade aplicada sobre as fotos na seção de destaque da home. Use opacidade 0 para desativar.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-brand-gray mb-1">Cor</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={overlayColor}
                      onChange={e => setOverlayColor(e.target.value)}
                      className="w-10 h-10 rounded border border-[#d1d5db] cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={overlayColor}
                      onChange={e => setOverlayColor(e.target.value)}
                      className={`${inputClass} font-mono text-sm`}
                      placeholder="#2A2A2A"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-brand-gray mb-1">Opacidade (0–1)</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={parseFloat(overlayOpacity) || 0}
                    onChange={e => setOverlayOpacity(e.target.value)}
                    className="w-full mt-2 accent-brand-terracotta"
                  />
                  <p className="text-xs text-brand-gray/60 mt-1 text-center">{overlayOpacity || '0'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Tab: Aparência ──────────────────────────────────── */}
        {activeTab === 'aparencia' && (
          <div>
            <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3 mb-5">
              Aparência
            </h2>
            <p className="text-sm text-brand-gray mb-5">As cores são aplicadas em todo o site após salvar.</p>

            <div className={fieldClass}>
              <label className={labelClass}>Cor principal (terracota)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brandPrimary}
                  onChange={e => setBrandPrimary(e.target.value)}
                  className="w-10 h-10 rounded border border-[#d1d5db] cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={brandPrimary}
                  onChange={e => setBrandPrimary(e.target.value)}
                  className={`${inputClass} font-mono text-sm`}
                  placeholder="#C49A6C"
                />
              </div>
              <p className={helpClass}>Usada em botões, destaques e links.</p>
            </div>

            <div className={fieldClass}>
              <label className={labelClass}>Cor de fundo</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brandBackground}
                  onChange={e => setBrandBackground(e.target.value)}
                  className="w-10 h-10 rounded border border-[#d1d5db] cursor-pointer p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={brandBackground}
                  onChange={e => setBrandBackground(e.target.value)}
                  className={`${inputClass} font-mono text-sm`}
                  placeholder="#F5F2EE"
                />
              </div>
              <p className={helpClass}>Fundo principal do site.</p>
            </div>

            <div className="mt-4 p-4 rounded-lg border border-[#e5e7eb] bg-gray-50">
              <p className="text-xs font-medium text-brand-gray mb-2">Prévia</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-[#d1d5db]" style={{ backgroundColor: brandPrimary }} />
                <div className="w-8 h-8 rounded border border-[#d1d5db]" style={{ backgroundColor: brandBackground }} />
                <span className="text-xs px-3 py-1.5 rounded text-white" style={{ backgroundColor: brandPrimary }}>Botão</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── Tab: Integrações ────────────────────────────────── */}
        {activeTab === 'integracoes' && (
          <div>
            <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3 mb-5">
              Integrações
            </h2>

            <Field label="Google Analytics 4 — Measurement ID">
              <input
                type="text"
                value={ga4Id}
                onChange={e => setGa4Id(e.target.value)}
                className={inputClass}
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-xs text-brand-gray/60 mt-1">
                Encontre seu Measurement ID no painel do Google Analytics → Administrador → Fluxos de dados.
              </p>
            </Field>
          </div>
        )}

        {/* ─── Tab: Perfil ─────────────────────────────────────── */}
        {activeTab === 'perfil' && (
          <div>
            <h2 className="text-sm font-semibold text-brand-graphite border-b border-[#e5e7eb] pb-3 mb-5">
              Perfil
            </h2>

            <div className={fieldClass}>
              <label className={labelClass}>Foto do Antônio</label>

              {sobrePhotoUrl ? (
                <>
                  <p className="text-xs text-brand-gray mb-2">Clique na imagem para ajustar o enquadramento</p>
                  <div
                    className="relative w-full max-w-[240px] aspect-[3/4] rounded overflow-hidden bg-gray-100 mb-3 cursor-crosshair select-none"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                      const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                      setSobrePhotoFocalPoint(`${x}% ${y}%`);
                    }}
                  >
                    <img
                      src={sobrePhotoUrl}
                      alt="Foto do perfil"
                      className="w-full h-full object-cover pointer-events-none"
                      style={{ objectPosition: sobrePhotoFocalPoint }}
                    />
                    {(() => {
                      const match = sobrePhotoFocalPoint.match(/^(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
                      const x = match ? parseFloat(match[1]) : 50;
                      const y = match ? parseFloat(match[2]) : 50;
                      return (
                        <div
                          className="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg pointer-events-none -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${x}%`, top: `${y}%`, background: 'rgba(194,80,56,0.85)' }}
                        />
                      );
                    })()}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSobrePhotoUrl(''); setSobrePhotoFocalPoint('50% 50%'); }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center cursor-pointer border-none hover:bg-red-600"
                    >✕</button>
                  </div>
                </>
              ) : null}

              <label className="inline-block px-4 py-2 text-sm text-brand-terracotta border border-brand-terracotta rounded cursor-pointer hover:bg-brand-terracotta/5 transition-colors">
                <span className="flex items-center gap-1.5"><Camera size={14} strokeWidth={1.5} />{profilePhotoUploading ? 'Enviando...' : 'Escolher foto'}</span>
                <input type="file" accept="image/*" onChange={handleProfilePhotoUpload} className="hidden" />
              </label>
              <p className={helpClass + ' mt-1'}>Recomendado: retrato, alta resolução. JPG, PNG ou WebP.</p>
            </div>

            <Field label="Nome completo">
              <input
                type="text"
                value={sobreName}
                onChange={e => setSobreName(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Tagline / subtítulo">
              <input
                type="text"
                value={sobreTagline}
                onChange={e => setSobreTagline(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Bio resumida (home)">
              <textarea
                value={sobreBioIntro}
                onChange={e => setSobreBioIntro(e.target.value)}
                className={`${inputClass} min-h-[90px] resize-y`}
                rows={3}
              />
            </Field>

            <Field label="Parágrafo 1">
              <textarea
                value={sobreBio1}
                onChange={e => setSobreBio1(e.target.value)}
                className={`${inputClass} min-h-[120px] resize-y`}
                rows={4}
              />
            </Field>

            <Field label="Parágrafo 2">
              <textarea
                value={sobreBio2}
                onChange={e => setSobreBio2(e.target.value)}
                className={`${inputClass} min-h-[120px] resize-y`}
                rows={4}
              />
            </Field>

            <Field label="Parágrafo 3">
              <textarea
                value={sobreBio3}
                onChange={e => setSobreBio3(e.target.value)}
                className={`${inputClass} min-h-[120px] resize-y`}
                rows={4}
              />
            </Field>

            <Field label="Parágrafo 4">
              <textarea
                value={sobreBio4}
                onChange={e => setSobreBio4(e.target.value)}
                className={`${inputClass} min-h-[120px] resize-y`}
                rows={4}
              />
            </Field>

            <Field label="Frase de filosofia">
              <textarea
                value={sobrePhilosophyQuote}
                onChange={e => setSobrePhilosophyQuote(e.target.value)}
                className={`${inputClass} min-h-[90px] resize-y`}
                rows={3}
              />
            </Field>

            <Field label="Anos de experiência (ex: 13+)">
              <input
                type="text"
                value={sobreYearsExperience}
                onChange={e => setSobreYearsExperience(e.target.value)}
                className={inputClass}
                placeholder="13+"
              />
            </Field>

            <Field label="Projetos entregues (ex: 50+)">
              <input
                type="text"
                value={sobreProjectsCount}
                onChange={e => setSobreProjectsCount(e.target.value)}
                className={inputClass}
                placeholder="50+"
              />
            </Field>

            <div className={fieldClass}>
              <span className={labelClass}>Stat 3: valor e legenda</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-brand-gray mb-1">Valor</label>
                  <input
                    type="text"
                    value={sobreStat3Value}
                    onChange={e => setSobreStat3Value(e.target.value)}
                    className={inputClass}
                    placeholder="BCN"
                  />
                </div>
                <div>
                  <label className="block text-xs text-brand-gray mb-1">Legenda</label>
                  <input
                    type="text"
                    value={sobreStat3Label}
                    onChange={e => setSobreStat3Label(e.target.value)}
                    className={inputClass}
                    placeholder="Pós em Barcelona"
                  />
                </div>
              </div>
            </div>

            <div className={fieldClass}>
              <span className={labelClass}>Stat 4: valor e legenda</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-brand-gray mb-1">Valor</label>
                  <input
                    type="text"
                    value={sobreStat4Value}
                    onChange={e => setSobreStat4Value(e.target.value)}
                    className={inputClass}
                    placeholder="BR"
                  />
                </div>
                <div>
                  <label className="block text-xs text-brand-gray mb-1">Legenda</label>
                  <input
                    type="text"
                    value={sobreStat4Label}
                    onChange={e => setSobreStat4Label(e.target.value)}
                    className={inputClass}
                    placeholder="Atuação em todo o Brasil"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save footer */}
      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 text-sm text-white bg-brand-terracotta border-none rounded cursor-pointer hover:bg-brand-terracotta-dark transition-colors disabled:opacity-60 font-medium"
        >
          {saving ? 'Salvando...' : 'Salvar configurações'}
        </button>
        {savedOk && (
          <span className="text-sm text-green-600">✓ Salvo com sucesso!</span>
        )}
        {saveError && (
          <span className="text-sm text-red-600">{saveError}</span>
        )}
      </div>
    </div>
  );
}
