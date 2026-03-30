import { getHeroPhotos } from '@/lib/queries';
import HeroAdmin from './HeroAdmin';

export default async function HeroAdminPage() {
  const photos = await getHeroPhotos();

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-brand-graphite mb-2">Hero</h1>
      <p className="text-brand-gray text-sm mb-8">
        Fotos que aparecem no slideshow da página inicial. Recomendado: formato panorâmico (16:9 ou maior), alta resolução.
      </p>
      <HeroAdmin initialPhotos={photos} />
    </div>
  );
}
