-- Adiciona campo alt_text para acessibilidade e SEO das fotos do hero.
-- O alt_text descreve a imagem para leitores de tela e para o Googlebot,
-- substituindo o alt genérico "Portfólio Pavanelli – foto X de Y".
--
-- Convenção sugerida ao preencher no admin:
-- - "{Projeto}, {tipologia} em {cidade}" (ex: "Casa 70, residência contemporânea em Uberlândia")
-- - Manter abaixo de 125 caracteres
-- - Evitar começar com "Foto de..." ou "Imagem de..." (redundante)

ALTER TABLE hero_photos
  ADD COLUMN IF NOT EXISTS alt_text TEXT;

COMMENT ON COLUMN hero_photos.alt_text IS
  'Texto alternativo para acessibilidade e SEO. Descreva o projeto retratado.';
