'use client';

import { useRef, useState, useEffect } from 'react';

export function ParallaxHero({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    function checkEnabled() {
      const isMobile = window.innerWidth < 768;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setEnabled(!isMobile && !prefersReduced);
    }

    checkEnabled();
    window.addEventListener('resize', checkEnabled, { passive: true });
    return () => window.removeEventListener('resize', checkEnabled);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setOffset(0);
      return;
    }

    let rafId: number;

    function onScroll() {
      rafId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const progress = -rect.top / (rect.height || 1);
        setOffset(progress * rect.height * 0.3);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} style={{ '--parallax-offset': `${offset}px`, overflow: 'hidden', position: 'relative' } as React.CSSProperties}>
      <div style={{ transform: `translateY(var(--parallax-offset, 0px))` }}>
        {children}
      </div>
    </div>
  );
}
