import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54331';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const VALID_EVENT_TYPES = [
  'whatsapp_click',
  'project_view',
  'lightbox_open',
  'contact_submit',
  'portfolio_cta_click',
] as const;

// Simple in-memory rate limit store: session_id -> { count, windowStart }
const sessionEventCounts = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds

function isSessionRateLimited(sessionId: string): boolean {
  const now = Date.now();
  const entry = sessionEventCounts.get(sessionId);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    sessionEventCounts.set(sessionId, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_type, project_slug, page, session_id, metadata } = body;

    // Validate required fields
    if (!event_type || !page || !session_id) {
      return NextResponse.json(
        { error: 'Missing required fields: event_type, page, session_id' },
        { status: 400 }
      );
    }

    // Validate event_type
    if (!VALID_EVENT_TYPES.includes(event_type)) {
      return NextResponse.json(
        { error: `Invalid event_type. Must be one of: ${VALID_EVENT_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Rate limit by session
    if (isSessionRateLimited(session_id)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Too many events in the last 60 seconds.' },
        { status: 429 }
      );
    }

    // Insert via PostgREST
    const url = `${SUPABASE_URL}/rest/v1/analytics_events`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        event_type,
        project_slug: project_slug ?? null,
        page,
        session_id,
        metadata: metadata ?? null,
      }),
    });

    if (!res.ok) {
      console.error(`analytics insert error ${res.status}: ${await res.text()}`);
      return NextResponse.json({ error: 'Failed to record event.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json({ error: 'Internal error.' }, { status: 500 });
  }
}
