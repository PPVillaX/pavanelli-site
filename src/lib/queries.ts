import 'server-only';

// ─── Types ───────────────────────────────────────────────────────
// Types live in lib/types.ts (safe for client and server imports).
// Re-exported here for server-component convenience.
import type { ProjectWithImages, DbBlogPost } from './types';
export type { ProjectWithImages, DbBlogPost, DbContact, ProjectImage } from './types';

// ─── Raw PostgREST helper ─────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54331';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/** Cache durations */
const PUBLIC_REVALIDATE = 3600; // 1 hour — public content rarely changes
const ADMIN_REVALIDATE = 0;    // always fresh for admin

async function pgrest<T = unknown>(path: string, revalidate = PUBLIC_REVALIDATE): Promise<T> {
  try {
    const url = `${SUPABASE_URL}${path}`;
    const res = await fetch(url, {
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Accept': 'application/json',
      },
      next: { revalidate },
    });
    if (!res.ok) {
      console.error(`pgrest error ${res.status}: ${await res.text()}`);
      return [] as unknown as T;
    }
    return res.json();
  } catch (err) {
    console.error('pgrest fetch error:', err);
    return [] as unknown as T;
  }
}

// ─── Public Queries ───────────────────────────────────────────────

export async function getPublishedProjects(): Promise<ProjectWithImages[]> {
  return pgrest<ProjectWithImages[]>(
    '/rest/v1/projects?select=*,project_images(id,image_url,alt_text,display_order)&is_published=eq.true&order=display_order.asc'
  );
}

export async function getFeaturedProjectsFromDB(): Promise<ProjectWithImages[]> {
  return pgrest<ProjectWithImages[]>(
    '/rest/v1/projects?select=*,project_images(id,image_url,alt_text,display_order)&is_published=eq.true&is_featured=eq.true&order=display_order.asc'
  );
}

export async function getProjectBySlugFromDB(slug: string): Promise<ProjectWithImages | null> {
  const arr = await pgrest<ProjectWithImages[]>(
    `/rest/v1/projects?select=*,project_images(id,image_url,alt_text,display_order)&slug=eq.${encodeURIComponent(slug)}&is_published=eq.true`
  );
  return arr?.length ? arr[0] : null;
}

export async function getAdjacentProjectsFromDB(slug: string) {
  const all = await getPublishedProjects();
  const idx = all.findIndex(p => p.slug === slug);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

export async function getHeroSlides() {
  const featured = await getFeaturedProjectsFromDB();
  return featured.slice(0, 3).map(p => ({
    src: p.cover_image_url || '',
    alt: `${p.title} — Pavanelli Arquitetura`,
    slug: p.slug,
  }));
}

// ─── Admin Queries ────────────────────────────────────────────────

export async function getAllProjects(): Promise<ProjectWithImages[]> {
  return pgrest<ProjectWithImages[]>(
    '/rest/v1/projects?select=*,project_images(id,image_url,alt_text,display_order)&order=display_order.asc',
    ADMIN_REVALIDATE,
  );
}

export async function getProjectById(id: string): Promise<ProjectWithImages | null> {
  const arr = await pgrest<ProjectWithImages[]>(
    `/rest/v1/projects?select=*,project_images(id,image_url,alt_text,display_order)&id=eq.${encodeURIComponent(id)}`,
    ADMIN_REVALIDATE,
  );
  return arr?.length ? arr[0] : null;
}

// ─── Blog ─────────────────────────────────────────────────────────

export async function getPublishedPosts(): Promise<DbBlogPost[]> {
  return pgrest<DbBlogPost[]>(
    '/rest/v1/blog_posts?select=*,blog_categories(name,slug)&is_published=eq.true&order=published_at.desc',
    ADMIN_REVALIDATE,
  );
}

export async function getAllPosts(): Promise<DbBlogPost[]> {
  return pgrest<DbBlogPost[]>(
    '/rest/v1/blog_posts?select=*,blog_categories(name,slug)&order=created_at.desc',
    ADMIN_REVALIDATE,
  );
}

export async function getPostById(id: string): Promise<DbBlogPost | null> {
  const arr = await pgrest<DbBlogPost[]>(
    `/rest/v1/blog_posts?select=*,blog_categories(name,slug)&id=eq.${encodeURIComponent(id)}`,
    ADMIN_REVALIDATE,
  );
  return arr?.length ? arr[0] : null;
}

export async function getPostBySlug(slug: string): Promise<DbBlogPost | null> {
  const arr = await pgrest<DbBlogPost[]>(
    `/rest/v1/blog_posts?select=*,blog_categories(name,slug)&slug=eq.${encodeURIComponent(slug)}&is_published=eq.true`,
    ADMIN_REVALIDATE,
  );
  return arr?.length ? arr[0] : null;
}

// ─── Settings ─────────────────────────────────────────────────────

export async function getSetting(key: string) {
  const arr = await pgrest<{ value: unknown }[]>(
    `/rest/v1/site_settings?select=value&key=eq.${encodeURIComponent(key)}`
  );
  return arr?.length ? arr[0].value : null;
}

export async function getGA4Id(): Promise<string | null> {
  const val = await getSetting('ga4_measurement_id');
  return typeof val === 'string' ? val : null;
}

// ─── Blog Categories ──────────────────────────────────────────────

export async function getBlogCategories() {
  return pgrest<{ id: string; name: string; slug: string }[]>(
    '/rest/v1/blog_categories?select=id,name,slug&order=name.asc',
    ADMIN_REVALIDATE,
  );
}

export async function getProjectCategories() {
  return pgrest<{ id: string; name: string; slug: string }[]>(
    '/rest/v1/project_categories?select=id,name,slug&order=name.asc',
    ADMIN_REVALIDATE,
  );
}

// ─── Contacts / Messages ──────────────────────────────────────────

export async function getContacts() {
  return pgrest<Record<string, unknown>[]>(
    '/rest/v1/contacts?select=*&order=created_at.desc',
    ADMIN_REVALIDATE,
  );
}

// ─── Admin Stats ──────────────────────────────────────────────────

export async function getAdminStats() {
  const [projects, posts, contacts] = await Promise.all([
    pgrest<{ id: string }[]>('/rest/v1/projects?select=id', ADMIN_REVALIDATE),
    pgrest<{ id: string }[]>('/rest/v1/blog_posts?select=id', ADMIN_REVALIDATE),
    pgrest<{ id: string; is_read: boolean }[]>('/rest/v1/contacts?select=id,is_read', ADMIN_REVALIDATE),
  ]);

  return {
    totalProjects: projects?.length || 0,
    totalPosts: posts?.length || 0,
    totalContacts: contacts?.length || 0,
    unreadContacts: contacts?.filter(c => !c.is_read).length || 0,
  };
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export interface GalleryPhoto {
  id: string;
  url: string;
  storage_path: string;
  display_order: number;
  created_at: string;
}

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  return (await pgrest<GalleryPhoto[]>(
    '/rest/v1/gallery_photos?select=*&order=display_order.asc,created_at.desc',
    ADMIN_REVALIDATE
  )) ?? [];
}

export interface HeroPhoto {
  id: string;
  url: string;
  storage_path: string;
  display_order: number;
  created_at: string;
}

export async function getHeroPhotos(): Promise<HeroPhoto[]> {
  return (await pgrest<HeroPhoto[]>(
    '/rest/v1/hero_photos?select=*&order=display_order.asc,created_at.asc',
    ADMIN_REVALIDATE
  )) ?? [];
}
