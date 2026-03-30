-- Fase 6: Gallery photos table

CREATE TABLE gallery_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  display_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view gallery photos"
  ON gallery_photos FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage gallery photos"
  ON gallery_photos FOR ALL USING (auth.role() = 'authenticated');

CREATE INDEX idx_gallery_photos_order ON gallery_photos (display_order ASC, created_at DESC);
