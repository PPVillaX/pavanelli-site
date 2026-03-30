// ─── Shared Types ────────────────────────────────────────────────
// This file is safe to import from both server and client components.
// Keep server-only logic in queries.ts.

export interface ProjectImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
}

export interface ProjectWithImages {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  year: number | null;
  area_m2: number | null;
  category: string;
  cover_image_url: string | null;
  cover_image_focal_point: string | null;
  photographer: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  project_images: ProjectImage[];
}

export interface DbBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category_id: string | null;
  tags: string[] | null;
  meta_title: string | null;
  meta_description: string | null;
  cover_image_focal_point: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  blog_categories: { name: string; slug: string } | null;
}

export interface DbContact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
}
