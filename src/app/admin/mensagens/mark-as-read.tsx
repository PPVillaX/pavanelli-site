'use client';

import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';

export default function MarkAsRead({ contactId }: { contactId: string }) {
  const router = useRouter();

  const handleMarkRead = async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase
      .from('contacts')
      .update({ is_read: true })
      .eq('id', contactId);
    router.refresh();
  };

  return (
    <button
      onClick={handleMarkRead}
      className="text-[11px] text-brand-gray mt-1 bg-transparent border-none cursor-pointer hover:text-brand-graphite transition-colors"
    >
      Marcar como lida
    </button>
  );
}
