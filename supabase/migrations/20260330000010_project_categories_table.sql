-- Standalone project categories table (no FK on projects.category — keeps free-text compat).
CREATE TABLE IF NOT EXISTS project_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read project categories"
  ON project_categories FOR SELECT
  USING (true);

CREATE POLICY "authenticated can manage project categories"
  ON project_categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed default categories
INSERT INTO project_categories (name, slug) VALUES
  ('Residencial', 'residencial'),
  ('Comercial', 'comercial'),
  ('Fazenda', 'fazenda'),
  ('Reforma', 'reforma'),
  ('Interiores', 'interiores')
ON CONFLICT (slug) DO NOTHING;
