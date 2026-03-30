import { ImageResponse } from 'next/og';
import { getSeoSettings } from '@/lib/settings';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default async function Icon() {
  const seo = await getSeoSettings();

  if (seo.favicon_url) {
    const res = await fetch(seo.favicon_url);
    if (res.ok) {
      const buffer = await res.arrayBuffer();
      return new Response(buffer, {
        headers: { 'Content-Type': res.headers.get('Content-Type') || 'image/png' },
      });
    }
  }

  // Fallback: generate a "P" letter favicon
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#3D3D3D',
          borderRadius: 6,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 300,
            color: '#C49A6C',
            lineHeight: 1,
          }}
        >
          +
        </div>
      </div>
    ),
    { ...size }
  );
}
