ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS cover_image_focal_point TEXT DEFAULT 'center';
