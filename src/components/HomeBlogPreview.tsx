import Link from 'next/link';
import { getPublishedPosts } from '@/lib/queries';

export async function HomeBlogPreview() {
  const allPosts = await getPublishedPosts();
  const posts = allPosts.slice(0, 3);

  return (
    <section className="px-6 md:px-[60px] py-20 md:py-[120px]">
      <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta mb-4">
        Blog
      </div>
      <h2 className="font-display text-[28px] md:text-[36px] font-bold text-brand-graphite mb-6 tracking-tight leading-[1.1]">
        Ideias e referências
      </h2>
      <p className="text-[17px] text-brand-gray max-w-[600px] leading-relaxed font-light mb-10">
        Reflexões sobre arquitetura, materiais e processo criativo.
      </p>

      {posts.length === 0 ? (
        <div className="bg-brand-white rounded-lg p-8 border border-brand-cream text-center">
          <span className="text-brand-terracotta text-2xl block mb-4">✦</span>
          <p className="text-brand-graphite text-[15px]">
            O blog está em preparação. Em breve, artigos sobre arquitetura, design e processo criativo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="border border-brand-cream rounded-lg overflow-hidden flex flex-col no-underline group transition-shadow hover:shadow-md"
            >
              {/* Cover image */}
              <div className="w-full aspect-[16/9] overflow-hidden bg-brand-cream">
                {post.cover_image_url ? (
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: post.cover_image_focal_point ?? 'center' }}
                  />
                ) : (
                  <div className="w-full h-full bg-brand-terracotta/10 flex items-center justify-center">
                    <span className="text-brand-terracotta text-3xl">✦</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                {post.blog_categories && (
                  <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-brand-terracotta mb-2">
                    {post.blog_categories.name}
                  </span>
                )}
                <h3 className="font-display text-[17px] font-bold text-brand-graphite mb-2 leading-snug group-hover:text-brand-terracotta transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-[14px] text-brand-gray leading-relaxed font-light flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-cream">
                  {post.published_at && (
                    <time className="text-[12px] text-brand-gray">
                      {new Date(post.published_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  )}
                  <span className="text-[13px] font-semibold text-brand-terracotta">
                    Ler mais →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
