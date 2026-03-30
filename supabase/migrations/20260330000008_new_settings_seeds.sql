INSERT INTO site_settings (key, value) VALUES
  ('featured_overlay_color', '"#2A2A2A"'),
  ('featured_overlay_opacity', '"0"'),
  ('brand_primary_color', '"#C49A6C"'),
  ('brand_background_color', '"#F5F2EE"'),
  ('favicon_url', '""')
ON CONFLICT (key) DO NOTHING;
