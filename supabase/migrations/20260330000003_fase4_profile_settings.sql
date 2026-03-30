-- Pavanelli Arquitetura — Profile Settings Seed
-- Fase 4: Sobre/profile page configurable settings

INSERT INTO site_settings (key, value) VALUES
  ('sobre_name', '"Antônio Loyola Pavanelli"'),
  ('sobre_tagline', '"Arquiteto e urbanista. Sólido, brasileiro, contemporâneo."'),
  ('sobre_photo_url', '""'),
  ('sobre_bio_intro', '"Arquiteto formado em Uberlândia com pós-graduação em Barcelona, Antônio une a brasilidade e a contemporaneidade em cada projeto."'),
  ('sobre_bio_1', '"Formado em Arquitetura e Urbanismo pelo Centro Universitário do Triângulo (Uberlândia), Antônio Pavanelli começou sua trajetória profissional em 2013, em Sacramento-MG. Logo nos primeiros anos, já era evidente a busca por uma arquitetura que fosse além da funcionalidade — uma arquitetura com alma."'),
  ('sobre_bio_2', '"Em 2015, mudou-se para Barcelona para cursar a pós-graduação em Arquitetura Sustentável e Eficiência Energética pela Ramon Llull — La Salle. A vivência europeia ampliou o olhar para a maturidade arquitetônica de quem sabe o valor da história, da preservação e dos novos estilos que surgem na contemporaneidade."'),
  ('sobre_bio_3', '"De volta ao Brasil, trouxe essa bagagem para um trabalho que valoriza a brasilidade, a personalidade e a autenticidade — sem modismos, sem tendências vazias. Após uma sociedade de 3 anos em Uberlândia, consolidou o Pavanelli Arquitetura como escritório independente, com uma equipe enxuta e dedicada."'),
  ('sobre_bio_4', '"O escritório atua em projetos residenciais, comerciais, fazendas e reformas, sempre com um serviço pessoal, próximo e personalizado. Cada projeto é tratado como único — porque é."'),
  ('sobre_philosophy_quote', '"Acredito em uma arquitetura sólida, com identidade brasileira e mescla contemporânea. Cada projeto deve ter personalidade própria — não seguir fórmulas."'),
  ('sobre_years_experience', '"13+"'),
  ('sobre_projects_count', '"50+"'),
  ('sobre_stat_3_value', '"BCN"'),
  ('sobre_stat_3_label', '"Pós em Barcelona"'),
  ('sobre_stat_4_value', '"BR"'),
  ('sobre_stat_4_label', '"Atuação em todo o Brasil"')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
