import 'server-only';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54331';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

interface AnalyticsEvent {
  event_type: string;
  project_slug: string | null;
  session_id: string;
}

async function queryEvents(eventType: string, sinceIso: string): Promise<AnalyticsEvent[]> {
  const url =
    `${SUPABASE_URL}/rest/v1/analytics_events` +
    `?select=event_type,project_slug,session_id` +
    `&event_type=eq.${encodeURIComponent(eventType)}` +
    `&created_at=gte.${encodeURIComponent(sinceIso)}`;

  const res = await fetch(url, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Accept': 'application/json',
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    console.error(`analytics query error ${res.status}: ${await res.text()}`);
    return [];
  }

  return res.json();
}

function sinceIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export async function getAnalyticsSummary(days: number): Promise<{
  whatsapp_clicks: number;
  project_views: number;
  contact_submits: number;
  conversion_rate: number;
}> {
  const since = sinceIso(days);

  const [waClicks, projectViews, contactSubmits] = await Promise.all([
    queryEvents('whatsapp_click', since),
    queryEvents('project_view', since),
    queryEvents('contact_submit', since),
  ]);

  const whatsapp_clicks = waClicks.length;
  const project_views = projectViews.length;
  const contact_submits = contactSubmits.length;
  const conversion_rate = project_views > 0
    ? Math.round((whatsapp_clicks / project_views) * 10000) / 100
    : 0;

  return { whatsapp_clicks, project_views, contact_submits, conversion_rate };
}

export async function getProjectEngagement(days: number): Promise<Array<{
  project_slug: string;
  whatsapp_clicks: number;
  views: number;
  lightbox_opens: number;
  conversion_rate: number;
}>> {
  const since = sinceIso(days);

  const [waClicks, projectViews, lightboxOpens] = await Promise.all([
    queryEvents('whatsapp_click', since),
    queryEvents('project_view', since),
    queryEvents('lightbox_open', since),
  ]);

  const slugMap = new Map<string, { whatsapp_clicks: number; views: number; lightbox_opens: number }>();

  const ensure = (slug: string) => {
    if (!slugMap.has(slug)) {
      slugMap.set(slug, { whatsapp_clicks: 0, views: 0, lightbox_opens: 0 });
    }
    return slugMap.get(slug)!;
  };

  for (const e of projectViews) {
    if (e.project_slug) ensure(e.project_slug).views++;
  }
  for (const e of waClicks) {
    if (e.project_slug) ensure(e.project_slug).whatsapp_clicks++;
  }
  for (const e of lightboxOpens) {
    if (e.project_slug) ensure(e.project_slug).lightbox_opens++;
  }

  return Array.from(slugMap.entries()).map(([project_slug, counts]) => ({
    project_slug,
    ...counts,
    conversion_rate: counts.views > 0
      ? Math.round((counts.whatsapp_clicks / counts.views) * 10000) / 100
      : 0,
  }));
}

export async function getConversionFunnel(days: number): Promise<{
  unique_sessions: number;
  project_views: number;
  whatsapp_clicks: number;
}> {
  const since = sinceIso(days);

  const [projectViews, waClicks] = await Promise.all([
    queryEvents('project_view', since),
    queryEvents('whatsapp_click', since),
  ]);

  // Count unique sessions across both event types
  const allSessions = new Set<string>();
  for (const e of projectViews) allSessions.add(e.session_id);
  for (const e of waClicks) allSessions.add(e.session_id);

  return {
    unique_sessions: allSessions.size,
    project_views: projectViews.length,
    whatsapp_clicks: waClicks.length,
  };
}
