'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Slide {
  src: string;
  alt: string;
  slug: string;
}

interface HeroSlideshowProps {
  slides: Slide[];
  title: string;
  subtitle: string;
}

export default function HeroSlideshow({ slides, title, subtitle }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (slides.length === 0) return null;

  return (
    <section className="relative h-screen overflow-hidden" id="home">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`hero-slide ${i === current ? 'active' : ''}`}
        >
          <div
            key={i === current ? `kb-active-${current}` : `kb-${i}`}
            className="hero-kb"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(42,42,42,0.1)] via-[rgba(42,42,42,0.3)] to-[rgba(42,42,42,0.7)]" />
        </div>
      ))}

      <div className="absolute bottom-16 md:bottom-[100px] left-6 md:left-[60px] right-6 md:right-[60px] text-white z-10">
        <h1 className="font-display text-[32px] md:text-[56px] font-bold leading-[1.1] mb-4 tracking-tight">
          {title}
        </h1>
        <p className="text-base md:text-lg font-light opacity-85 max-w-[500px] leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="absolute bottom-10 left-6 md:left-[60px] text-white/60 text-[11px] tracking-[0.15em] uppercase items-center gap-2.5 hidden md:flex z-10">
        <span className="block w-10 h-px bg-white/40" />
        Rolar para explorar
      </div>

      <div className="absolute bottom-10 right-6 md:right-[60px] flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`w-2.5 h-2.5 rounded-full border-none cursor-pointer transition-all duration-300 ${
              i === current
                ? 'bg-white scale-120'
                : 'bg-white/40 hover:bg-white/70'
            }`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
