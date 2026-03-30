'use client';

import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Do not render on touch devices
    if (navigator.maxTouchPoints > 0) return;

    setMounted(true);
    document.body.classList.add('custom-cursor-active');

    let rafId: number;

    function onMouseMove(e: MouseEvent) {
      rafId = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
      });
    }

    function onMouseOver(e: MouseEvent) {
      const target = e.target as Element;
      if (target.closest('a, button')) {
        setExpanded(true);
      }
    }

    function onMouseOut(e: MouseEvent) {
      const target = e.target as Element;
      if (target.closest('a, button')) {
        setExpanded(false);
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mouseout', onMouseOut, { passive: true });

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!mounted) return null;

  const size = expanded ? 48 : 32;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: size,
        height: size,
        borderRadius: '50%',
        border: '2px solid currentColor',
        background: 'transparent',
        opacity: 0.6,
        mixBlendMode: 'difference',
        color: 'white',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: `translate(${pos.x - size / 2}px, ${pos.y - size / 2}px)`,
        transition: 'width 150ms ease, height 150ms ease, transform 50ms linear',
        willChange: 'transform',
      }}
    />
  );
}
