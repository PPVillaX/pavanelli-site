import 'server-only';

// ─── Types ────────────────────────────────────────────────────────

export interface ContactSettings {
  whatsapp_number: string;
  whatsapp_default_message: string;
  contact_email: string;
  notification_email: string;
  address_full: string;
  address_coords: { lat: number; lng: number };
  business_hours: string;
}

export interface SocialSettings {
  instagram_handle: string;
  instagram_shortcodes: string[];
  instagram_enabled: boolean;
  linkedin_url: string;
}

export interface SeoSettings {
  site_name: string;
  site_description: string;
  og_default_image: string;
  favicon_url: string;
}

export interface ContentSettings {
  cta_hero_title: string;
  cta_hero_subtitle: string;
  cta_contact_text: string;
  cta_portfolio_text: string;
  logo_url: string;
  featured_overlay_color: string;
  featured_overlay_opacity: string;
}

export interface AppearanceSettings {
  brand_primary_color: string;
  brand_primary_dark_color: string;
  brand_background_color: string;
  brand_graphite_color: string;
}

export interface ProfileSettings {
  sobre_name: string;
  sobre_tagline: string;
  sobre_photo_url: string;
  sobre_photo_focal_point: string;
  sobre_bio_intro: string;
  sobre_bio_1: string;
  sobre_bio_2: string;
  sobre_bio_3: string;
  sobre_bio_4: string;
  sobre_philosophy_quote: string;
  sobre_years_experience: string;
  sobre_projects_count: string;
  sobre_stat_3_value: string;
  sobre_stat_3_label: string;
  sobre_stat_4_value: string;
  sobre_stat_4_label: string;
}

// ─── Internal helpers ─────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54331';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// In dev, revalidate immediately. In production, use on-demand revalidation
// via /api/revalidate (called after admin saves) with a 60s fallback TTL.
const SETTINGS_REVALIDATE = process.env.NODE_ENV === 'development' ? 0 : 60;

async function fetchSettings(keys: string[]): Promise<Record<string, unknown>> {
  const keyList = keys.join(',');
  const url = `${SUPABASE_URL}/rest/v1/site_settings?key=in.(${keyList})&select=key,value`;
  const res = await fetch(url, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Accept': 'application/json',
    },
    next: { revalidate: SETTINGS_REVALIDATE },
  });
  if (!res.ok) {
    console.error(`settings fetch error ${res.status}: ${await res.text()}`);
    return {};
  }
  const rows: { key: string; value: unknown }[] = await res.json();
  const map: Record<string, unknown> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

function str(map: Record<string, unknown>, key: string): string {
  const v = map[key];
  return typeof v === 'string' ? v : '';
}

// ─── Public Functions ─────────────────────────────────────────────

export async function getContactSettings(): Promise<ContactSettings> {
  const keys = [
    'whatsapp_number',
    'whatsapp_default_message',
    'contact_email',
    'notification_email',
    'address_full',
    'address_coords',
    'business_hours',
  ];
  const map = await fetchSettings(keys);

  const rawCoords = map['address_coords'];
  let address_coords: { lat: number; lng: number } = { lat: 0, lng: 0 };
  if (
    rawCoords !== null &&
    typeof rawCoords === 'object' &&
    !Array.isArray(rawCoords) &&
    typeof (rawCoords as Record<string, unknown>).lat === 'number' &&
    typeof (rawCoords as Record<string, unknown>).lng === 'number'
  ) {
    address_coords = rawCoords as { lat: number; lng: number };
  }

  return {
    whatsapp_number: str(map, 'whatsapp_number'),
    whatsapp_default_message: str(map, 'whatsapp_default_message'),
    contact_email: str(map, 'contact_email'),
    notification_email: str(map, 'notification_email'),
    address_full: str(map, 'address_full'),
    address_coords,
    business_hours: str(map, 'business_hours'),
  };
}

export async function getSocialSettings(): Promise<SocialSettings> {
  const keys = [
    'instagram_handle',
    'instagram_shortcodes',
    'instagram_enabled',
    'linkedin_url',
  ];
  const map = await fetchSettings(keys);

  const rawShortcodes = map['instagram_shortcodes'];
  const instagram_shortcodes = Array.isArray(rawShortcodes)
    ? (rawShortcodes as unknown[]).filter((v): v is string => typeof v === 'string')
    : [];

  const rawEnabled = map['instagram_enabled'];
  const instagram_enabled = typeof rawEnabled === 'boolean' ? rawEnabled : true;

  return {
    instagram_handle: str(map, 'instagram_handle'),
    instagram_shortcodes,
    instagram_enabled,
    linkedin_url: str(map, 'linkedin_url'),
  };
}

export async function getSeoSettings(): Promise<SeoSettings> {
  const keys = ['site_name', 'site_description', 'og_default_image', 'favicon_url'];
  const map = await fetchSettings(keys);

  return {
    site_name: str(map, 'site_name'),
    site_description: str(map, 'site_description'),
    og_default_image: str(map, 'og_default_image'),
    favicon_url: str(map, 'favicon_url'),
  };
}

export async function getContentSettings(): Promise<ContentSettings> {
  const keys = [
    'cta_hero_title',
    'cta_hero_subtitle',
    'cta_contact_text',
    'cta_portfolio_text',
    'logo_url',
    'featured_overlay_color',
    'featured_overlay_opacity',
  ];
  const map = await fetchSettings(keys);

  return {
    cta_hero_title: str(map, 'cta_hero_title'),
    cta_hero_subtitle: str(map, 'cta_hero_subtitle'),
    cta_contact_text: str(map, 'cta_contact_text'),
    cta_portfolio_text: str(map, 'cta_portfolio_text'),
    logo_url: str(map, 'logo_url'),
    featured_overlay_color: str(map, 'featured_overlay_color') || '#2A2A2A',
    featured_overlay_opacity: str(map, 'featured_overlay_opacity') || '0',
  };
}

export async function getAppearanceSettings(): Promise<AppearanceSettings> {
  const keys = ['brand_primary_color', 'brand_primary_dark_color', 'brand_background_color', 'brand_graphite_color'];
  const map = await fetchSettings(keys);
  return {
    brand_primary_color: str(map, 'brand_primary_color') || '#C49A6C',
    brand_primary_dark_color: str(map, 'brand_primary_dark_color') || '#b08a5e',
    brand_background_color: str(map, 'brand_background_color') || '#F5F2EE',
    brand_graphite_color: str(map, 'brand_graphite_color') || '#3D3D3D',
  };
}

export async function getProfileSettings(): Promise<ProfileSettings> {
  const keys = [
    'sobre_name',
    'sobre_tagline',
    'sobre_photo_url',
    'sobre_photo_focal_point',
    'sobre_bio_intro',
    'sobre_bio_1',
    'sobre_bio_2',
    'sobre_bio_3',
    'sobre_bio_4',
    'sobre_philosophy_quote',
    'sobre_years_experience',
    'sobre_projects_count',
    'sobre_stat_3_value',
    'sobre_stat_3_label',
    'sobre_stat_4_value',
    'sobre_stat_4_label',
  ];
  const map = await fetchSettings(keys);

  return {
    sobre_name: str(map, 'sobre_name'),
    sobre_tagline: str(map, 'sobre_tagline'),
    sobre_photo_url: str(map, 'sobre_photo_url'),
    sobre_photo_focal_point: str(map, 'sobre_photo_focal_point') || '50% 50%',
    sobre_bio_intro: str(map, 'sobre_bio_intro'),
    sobre_bio_1: str(map, 'sobre_bio_1'),
    sobre_bio_2: str(map, 'sobre_bio_2'),
    sobre_bio_3: str(map, 'sobre_bio_3'),
    sobre_bio_4: str(map, 'sobre_bio_4'),
    sobre_philosophy_quote: str(map, 'sobre_philosophy_quote'),
    sobre_years_experience: str(map, 'sobre_years_experience'),
    sobre_projects_count: str(map, 'sobre_projects_count'),
    sobre_stat_3_value: str(map, 'sobre_stat_3_value'),
    sobre_stat_3_label: str(map, 'sobre_stat_3_label'),
    sobre_stat_4_value: str(map, 'sobre_stat_4_value'),
    sobre_stat_4_label: str(map, 'sobre_stat_4_label'),
  };
}
