'use client';

import { useState } from 'react';
import { useTracking } from '@/hooks/useTracking';

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function ContactForm() {
  const { track } = useTracking();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar mensagem.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      track('contact_submit', { page: typeof window !== 'undefined' ? window.location.pathname : '/' });
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'contact_submit', { event_category: 'conversion' });
      }
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Erro ao enviar mensagem.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const inputClass = 'bg-white/[0.08] border border-white/[0.12] rounded px-5 py-4 text-white font-sans text-[15px] outline-none transition-colors placeholder:text-white/35 focus:border-brand-terracotta';

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Seu nome"
        required
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        className={inputClass}
        disabled={status === 'sending'}
      />
      <input
        type="email"
        placeholder="Seu e-mail"
        required
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
        className={inputClass}
        disabled={status === 'sending'}
      />
      <input
        type="tel"
        placeholder="(XX) XXXXX-XXXX"
        value={formData.phone}
        onChange={e => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
        className={inputClass}
        disabled={status === 'sending'}
        maxLength={15}
      />
      <textarea
        placeholder="Conte sobre o seu projeto..."
        required
        value={formData.message}
        onChange={e => setFormData({ ...formData, message: e.target.value })}
        className={`${inputClass} min-h-[120px] resize-y`}
        disabled={status === 'sending'}
      />

      {status === 'error' && (
        <p className="text-red-400 text-sm">{errorMessage}</p>
      )}

      {status === 'success' && (
        <div className="flex items-center gap-3 bg-green-500/15 border border-green-500/30 rounded px-5 py-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-green-400">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-green-300 text-sm font-medium">
            Mensagem enviada com sucesso! Responderemos em breve.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-brand-terracotta text-white border-none px-10 py-4 font-sans text-[13px] font-semibold tracking-[0.1em] uppercase cursor-pointer rounded transition-all duration-300 self-start hover:bg-brand-terracotta-dark hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'sending' && 'Enviando...'}
        {status === 'success' && '✓ Mensagem enviada!'}
        {status === 'error' && 'Tentar novamente'}
        {status === 'idle' && 'Enviar mensagem'}
      </button>
    </form>
  );
}
