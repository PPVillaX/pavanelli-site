-- Tabela de localizações (bairros e empreendimentos) para páginas SEO locais.
-- URL pública: /uberlandia/[slug]
--
-- Tipos:
--   - 'bairro': bairro/região (ex: Karaíba, Morada da Colina, Jardim Sul, Gávea)
--   - 'empreendimento': desenvolvimento específico, com subtype livre
--     (ex: Reserva do Vale, Solares da Gávea, Pátio Vinhedos, empreendimentos Cyrela)
--
-- Hierarquia opcional via parent_location_id (ex: Reserva do Vale → Morada da Colina)
-- Mostra-se apenas em breadcrumb; URL permanece flat.
--
-- Match de projetos: array `match_keys` é comparado contra `project.location` (case insensitive,
-- match parcial). Exemplo: location com match_keys = ['Morada da Colina', 'morada-colina']
-- lista todos os projetos cujo `location` contenha qualquer dessas strings.

CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bairro', 'empreendimento')),
  subtype TEXT,
  city TEXT NOT NULL DEFAULT 'Uberlândia',
  intro TEXT,
  content TEXT,
  match_keys TEXT[] NOT NULL DEFAULT '{}',
  parent_location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  cover_image_url TEXT,
  cover_image_focal_point TEXT DEFAULT '50% 50%',
  meta_title TEXT,
  meta_description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS locations_slug_idx ON locations(slug);
CREATE INDEX IF NOT EXISTS locations_type_published_idx ON locations(type, is_published, display_order);
CREATE INDEX IF NOT EXISTS locations_parent_idx ON locations(parent_location_id);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "locations_public_read" ON locations
  FOR SELECT USING (is_published = true);

CREATE POLICY "locations_service_role_full" ON locations
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "locations_authenticated_full" ON locations
  FOR ALL USING (auth.role() = 'authenticated');

COMMENT ON COLUMN locations.match_keys IS
  'Array de strings comparadas contra project.location (case insensitive, partial match) para listar projetos da Pavanelli na localização.';
COMMENT ON COLUMN locations.parent_location_id IS
  'Hierarquia opcional. Empreendimentos podem apontar para um bairro pai. URL permanece flat.';
