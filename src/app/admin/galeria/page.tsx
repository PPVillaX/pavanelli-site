import { createAdminClient } from '@/lib/supabase-server';
import type { GalleryPhoto } from '@/lib/queries';
import GalleryAdmin from './GalleryAdmin';

export default async function GaleriaPage() {
  const supabase = createAdminClient();
  const { data: photos } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-brand-graphite">Galeria</h1>
        <p className="text-sm text-brand-gray">
          Fotos exibidas na home. Arraste para reordenar ou use as setas.
        </p>
      </div>
      <GalleryAdmin initialPhotos={(photos as GalleryPhoto[]) ?? []} />
    </div>
  );
}
