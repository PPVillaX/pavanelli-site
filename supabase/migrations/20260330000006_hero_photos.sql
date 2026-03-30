CREATE TABLE IF NOT EXISTS hero_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE hero_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hero_photos_public_read" ON hero_photos
  FOR SELECT USING (true);

CREATE POLICY "hero_photos_auth_write" ON hero_photos
  FOR ALL USING (auth.role() = 'authenticated');
