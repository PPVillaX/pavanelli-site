'use client';

import { createBrowserSupabaseClient } from '@/lib/supabase-browser';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface Props {
  contacts: Record<string, unknown>[];
}

export default function MessagesClient({ contacts: initialContacts }: Props) {
  const contacts = initialContacts as unknown as Contact[];

  const handleMarkRead = async (id: string) => {
    const supabase = createBrowserSupabaseClient();
    await supabase.from('contacts').update({ is_read: true }).eq('id', id);
    window.location.reload();
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-brand-graphite mb-6">
        Mensagens
      </h1>

      <div className="space-y-4">
        {contacts.length === 0 && (
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-8 text-center text-sm text-brand-gray">
            Nenhuma mensagem recebida ainda.
          </div>
        )}
        {contacts.map(contact => (
          <div
            key={contact.id}
            className={`bg-white rounded-xl border p-5 ${
              contact.is_read ? 'border-[#e5e7eb]' : 'border-brand-terracotta/30 bg-brand-terracotta/5'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-medium text-sm text-brand-graphite flex items-center gap-2">
                  {contact.name}
                  {!contact.is_read && (
                    <span className="w-2 h-2 rounded-full bg-brand-terracotta inline-block" />
                  )}
                </div>
                <div className="text-xs text-brand-gray">
                  {contact.email} {contact.phone && `• ${contact.phone}`}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-brand-gray">
                  {new Date(contact.created_at).toLocaleDateString('pt-BR')}
                </span>
                {!contact.is_read && (
                  <button
                    onClick={() => handleMarkRead(contact.id)}
                    className="text-xs text-brand-terracotta hover:underline cursor-pointer bg-transparent border-none"
                  >
                    Marcar como lida
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-brand-gray leading-relaxed whitespace-pre-wrap">
              {contact.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
