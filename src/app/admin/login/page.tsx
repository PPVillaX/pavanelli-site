'use client';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createBrowserSupabaseClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('E-mail ou senha incorretos.');
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-brand-offwhite flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="font-display text-2xl font-bold text-brand-graphite tracking-tight">
            pavanelli
          </div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-brand-gray mt-1">
            ADMIN
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-brand-gray uppercase tracking-[0.1em] mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-brand-cream rounded text-brand-graphite text-[15px] outline-none transition-colors focus:border-brand-terracotta bg-white"
            />
          </div>
          <div>
            <label className="block text-xs text-brand-gray uppercase tracking-[0.1em] mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-brand-cream rounded text-brand-graphite text-[15px] outline-none transition-colors focus:border-brand-terracotta bg-white"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-terracotta text-white py-3.5 text-[13px] font-semibold tracking-[0.1em] uppercase border-none rounded cursor-pointer transition-all hover:bg-brand-terracotta-dark disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-xs text-brand-gray mt-8">
          Acesso restrito à equipe Pavanelli Arquitetura.
        </p>
      </div>
    </div>
  );
}
