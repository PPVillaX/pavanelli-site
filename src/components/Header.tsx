'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/portfolio', label: 'Portfólio' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/blog', label: 'Blog' },
  { href: '/contato', label: 'Contato' },
];

interface HeaderProps {
  instagramHandle?: string;
}

export default function Header({ instagramHandle }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 border-b border-brand-cream px-6 md:px-[60px] flex justify-between items-center h-16 md:h-20 transition-all duration-300 ${
          scrolled
            ? 'bg-brand-offwhite/95 backdrop-blur-md shadow-sm'
            : 'bg-brand-offwhite'
        }`}
      >
        <Link href="/" className="no-underline">
          <div className="font-display font-bold text-xl md:text-[22px] text-brand-graphite leading-[1.1] tracking-tight">
            pavanelli
            <span className="block text-[9px] font-normal tracking-[0.35em] text-brand-gray mt-0.5 font-sans">
              ARQUITETURA + INTERIORES
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex gap-10 list-none items-center">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`no-underline text-[13px] font-medium tracking-[0.08em] uppercase transition-colors duration-300 ${
                  (link.href === '/' ? pathname === '/' : pathname.startsWith(link.href))
                    ? 'text-brand-graphite'
                    : 'text-brand-gray hover:text-brand-graphite'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {instagramHandle && (
            <li>
              <Link
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-gray hover:text-brand-graphite transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile hamburger — visible only on mobile (BottomNav handles primary nav, this opens overlay with extra links) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex md:hidden flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-brand-graphite transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-brand-graphite transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-brand-graphite transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`mobile-menu fixed inset-0 z-40 bg-brand-offwhite pt-24 px-8 md:hidden ${
          menuOpen ? 'open' : ''
        }`}
      >
        <ul className="list-none flex flex-col gap-8">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`no-underline text-2xl font-display font-semibold transition-colors ${
                  pathname.startsWith(link.href)
                    ? 'text-brand-terracotta'
                    : 'text-brand-graphite'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {instagramHandle && (
            <li>
              <Link
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="no-underline text-2xl font-display font-semibold text-brand-graphite transition-colors flex items-center gap-3"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
