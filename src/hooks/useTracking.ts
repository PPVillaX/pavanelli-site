'use client';

import { useRef } from 'react';

function getSessionId(): string {
  try {
    const key = 'pav_sid';
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

type GtagFn = (...args: unknown[]) => void;

function fireGtag(
  event_type: string,
  options?: { project_slug?: string; page?: string; metadata?: Record<string, unknown> }
) {
  if (typeof window === 'undefined') return;
  const gtag = (window as Window & { gtag?: GtagFn }).gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', event_type, {
    page_path: options?.page ?? window.location.pathname,
    ...(options?.project_slug ? { project_slug: options.project_slug } : {}),
    ...(options?.metadata ?? {}),
  });
}

export function useTracking() {
  const sessionIdRef = useRef<string | null>(null);

  function track(
    event_type: string,
    options?: {
      project_slug?: string;
      page?: string;
      metadata?: Record<string, unknown>;
    }
  ) {
    if (!sessionIdRef.current) {
      sessionIdRef.current = getSessionId();
    }

    const session_id = sessionIdRef.current;
    const page = options?.page ?? (typeof window !== 'undefined' ? window.location.pathname : '/');

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type,
        session_id,
        page,
        project_slug: options?.project_slug,
        metadata: options?.metadata,
      }),
    }).catch(() => {});

    fireGtag(event_type, options);
  }

  return { track };
}
