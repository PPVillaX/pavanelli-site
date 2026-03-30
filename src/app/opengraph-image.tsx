import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Pavanelli Arquitetura + Interiores';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #2A2A2A 0%, #3D3D3D 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Terracotta accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: '#C49A6C',
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#FAFAF8',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          pavanelli
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: '#A0A0A0',
            letterSpacing: '0.35em',
            marginTop: 8,
          }}
        >
          ARQUITETURA + INTERIORES
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 300,
            color: '#C49A6C',
            marginTop: 40,
            letterSpacing: '0.02em',
          }}
        >
          Arquitetura com identidade e alma
        </div>

        {/* Location */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 14,
            color: '#A0A0A0',
            letterSpacing: '0.1em',
          }}
        >
          Uberlândia · MG · Brasil
        </div>
      </div>
    ),
    { ...size }
  );
}
