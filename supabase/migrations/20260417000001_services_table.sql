-- Services table for /servicos pages
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  content TEXT,
  cover_image_url TEXT,
  cover_image_focal_point TEXT DEFAULT '50% 50%',
  category_filter TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS services_slug_idx ON services(slug);
CREATE INDEX IF NOT EXISTS services_active_order_idx ON services(is_active, display_order);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active services"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role full access"
  ON services
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
