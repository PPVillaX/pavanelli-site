import { createAdminClient } from '@/lib/supabase-server';
import SettingsForm from './SettingsForm';

export default async function ConfiguracoesPage() {
  const supabase = createAdminClient();
  const { data: rows } = await supabase
    .from('site_settings')
    .select('key, value');

  const settings: Record<string, unknown> = {};
  if (rows) {
    for (const row of rows) {
      settings[row.key] = row.value;
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-brand-graphite mb-6">
        Configurações
      </h1>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
