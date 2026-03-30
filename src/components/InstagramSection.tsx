import { getSocialSettings } from '@/lib/settings';
import { InstagramEmbed } from './InstagramEmbed';

export async function InstagramSection() {
  const social = await getSocialSettings();

  if (!social.instagram_enabled || !social.instagram_shortcodes.length) {
    return null;
  }

  const shortcodes = social.instagram_shortcodes.slice(0, 6);

  return (
    <section className="px-6 md:px-[60px] py-16 md:py-24">
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-display text-[28px] md:text-[36px] font-bold text-brand-graphite tracking-tight">
          Instagram
        </h2>
        {social.instagram_handle && (
          <a
            href={`https://instagram.com/${social.instagram_handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-gray hover:text-brand-terracotta transition-colors"
          >
            @{social.instagram_handle} →
          </a>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {shortcodes.map(code => (
          <InstagramEmbed key={code} shortcode={code} />
        ))}
      </div>
    </section>
  );
}
