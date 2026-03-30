-- Pavanelli Arquitetura — Site Settings Seed
-- Fase 4: Populate site_settings with all hardcoded values

INSERT INTO site_settings (key, value) VALUES
  ('whatsapp_number',          '"5534991358161"'),
  ('whatsapp_default_message', '"Olá! Gostaria de saber mais sobre os serviços da Pavanelli Arquitetura."'),
  ('contact_email',            '"antonio@pavanelliguimaraes.com.br"'),
  ('notification_email',       '"antonio@pavanelliguimaraes.com.br"'),
  ('address_full',             '"Av. Nicomedes Alves dos Santos, 3600 — sala 330, Gávea Business, Uberlândia — MG, CEP 38408-144"'),
  ('address_coords',           '{"lat": -18.9186, "lng": -48.2756}'),
  ('business_hours',           '"Segunda a Sexta, 9h às 18h"'),
  ('instagram_handle',         '"pavanelliarquitetura"'),
  ('instagram_shortcodes',     '[]'),
  ('linkedin_url',             '""'),
  ('site_name',                '"Pavanelli Arquitetura + Interiores"'),
  ('site_description',         '"Escritório de arquitetura e interiores em Uberlândia, MG. Projetos residenciais, comerciais e fazendas com identidade única."'),
  ('og_default_image',         '""'),
  ('cta_hero_title',           '"Arquitetura que conta a sua história"'),
  ('cta_hero_subtitle',        '"Projetos residenciais, comerciais e fazendas com identidade única em Uberlândia e região"'),
  ('cta_contact_text',         '"Vamos conversar sobre o seu projeto"'),
  ('cta_portfolio_text',       '"Ver portfólio completo"'),
  ('logo_url',                 '""'),
  ('instagram_enabled',        'true')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
