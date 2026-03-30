'use client';

import { useState } from 'react';

interface InstagramEmbedProps {
  shortcode: string;
}

export function InstagramEmbed({ shortcode }: InstagramEmbedProps) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <div style={{ position: 'relative', paddingBottom: '100%', height: 0, overflow: 'hidden' }}>
      <iframe
        src={`https://www.instagram.com/p/${shortcode}/embed`}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
        loading="lazy"
        scrolling="no"
        frameBorder="0"
        allowTransparency={true}
        onError={() => setFailed(true)}
        title={`Instagram post ${shortcode}`}
      />
    </div>
  );
}
