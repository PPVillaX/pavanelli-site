'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import {
  LayoutDashboard,
  Blocks,
  FileText,
  Mail,
  TrendingUp,
  Images,
  Clapperboard,
  Tag,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const navItems: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/projetos', label: 'Projetos', Icon: Blocks },
  { href: '/admin/posts', label: 'Blog', Icon: FileText },
  { href: '/admin/mensagens', label: 'Mensagens', Icon: Mail },
  { href: '/admin/analytics', label: 'Analytics', Icon: TrendingUp },
  { href: '/admin/galeria', label: 'Galeria', Icon: Images },
  { href: '/admin/hero', label: 'Hero', Icon: Clapperboard },
  { href: '/admin/categorias', label: 'Categorias', Icon: Tag },
  { href: '/admin/configuracoes', label: 'Configurações', Icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Skip auth check on login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      setAuthenticated(true); // Show login page without auth
      return;
    }

    const checkAuth = async () => {
      const supabase = createBrowserSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/admin/login');
      } else {
        setAuthenticated(true);
      }
      setChecking(false);
    };
    checkAuth();
  }, [pathname, isLoginPage, router]);

  // Login page renders without chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-brand-terracotta border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authenticated) return null;

  const handleLogout = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#e5e7eb] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-display text-lg font-bold text-brand-graphite no-underline tracking-tight">
            pavanelli <span className="text-brand-terracotta font-light text-sm">admin</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 text-[13px] rounded-md no-underline transition-colors ${
                  pathname === href
                    ? 'bg-brand-terracotta/10 text-brand-terracotta font-medium'
                    : 'text-brand-gray hover:text-brand-graphite hover:bg-gray-50'
                }`}
              >
                <Icon size={15} strokeWidth={1.5} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs text-brand-gray no-underline hover:text-brand-graphite" target="_blank">
            Ver site →
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-brand-gray hover:text-red-500 cursor-pointer bg-transparent border-none transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
