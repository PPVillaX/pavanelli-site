import Link from 'next/link';
import { getAdminStats } from '@/lib/queries';
import { Blocks, FileText, Mail, BellDot, Settings } from 'lucide-react';

const cards = [
  { label: 'Projetos', key: 'totalProjects', href: '/admin/projetos', Icon: Blocks },
  { label: 'Posts', key: 'totalPosts', href: '/admin/posts', Icon: FileText },
  { label: 'Mensagens', key: 'totalContacts', href: '/admin/mensagens', Icon: Mail },
  { label: 'Não lidas', key: 'unreadContacts', href: '/admin/mensagens', Icon: BellDot },
] as const;

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-brand-graphite mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, key, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-xl border border-[#e5e7eb] p-5 no-underline hover:border-brand-terracotta/30 transition-colors"
          >
            <div className="mb-2 text-brand-terracotta">
              <Icon size={22} strokeWidth={1.5} />
            </div>
            <div className="text-3xl font-bold text-brand-graphite">{stats[key]}</div>
            <div className="text-xs text-brand-gray uppercase tracking-[0.08em] mt-1">{label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h2 className="text-sm font-semibold text-brand-graphite mb-4">Ações rápidas</h2>
          <div className="space-y-2">
            <Link href="/admin/projetos/novo" className="block text-sm text-brand-terracotta no-underline hover:underline">
              + Criar novo projeto
            </Link>
            <Link href="/admin/posts/novo" className="block text-sm text-brand-terracotta no-underline hover:underline">
              + Criar novo post
            </Link>
            <Link href="/admin/configuracoes" className="flex items-center gap-1.5 text-sm text-brand-terracotta no-underline hover:underline">
              <Settings size={14} strokeWidth={1.5} />
              Configurações
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
          <h2 className="text-sm font-semibold text-brand-graphite mb-4">Links úteis</h2>
          <div className="space-y-2">
            <a href="http://127.0.0.1:54333" target="_blank" className="block text-sm text-brand-gray no-underline hover:text-brand-graphite">
              Supabase Studio ↗
            </a>
            <Link href="/" target="_blank" className="block text-sm text-brand-gray no-underline hover:text-brand-graphite">
              Ver site ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
