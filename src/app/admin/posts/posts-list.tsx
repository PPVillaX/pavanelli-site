'use client';

import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  is_published: boolean;
  blog_categories: { name: string; slug: string } | null;
}

interface Props {
  posts: Post[];
}

export default function AdminPostsList({ posts }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-brand-graphite">
          Blog
        </h1>
        <Link
          href="/admin/posts/novo"
          className="px-5 py-2.5 text-sm text-white bg-brand-terracotta border-none rounded no-underline hover:bg-brand-terracotta-dark transition-colors font-medium"
        >
          + Novo post
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
        {posts && posts.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-[#e5e7eb]">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-[0.08em]">Post</th>
                <th className="px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-[0.08em] hidden md:table-cell">Categoria</th>
                <th className="px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-[0.08em] hidden md:table-cell">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-[0.08em]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-sm text-brand-graphite">{post.title}</div>
                    <div className="text-xs text-brand-gray mt-0.5">{post.excerpt?.slice(0, 80) || '—'}</div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs text-brand-gray bg-gray-100 px-2 py-1 rounded">
                      {post.blog_categories?.name || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                      post.is_published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${post.is_published ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {post.is_published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/posts/${post.id}`} className="text-xs text-brand-terracotta hover:underline no-underline font-medium">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-sm text-brand-gray">
            Nenhum post criado ainda. Clique em &quot;+ Novo post&quot; para começar.
          </div>
        )}
      </div>
    </div>
  );
}
