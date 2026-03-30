-- Seed data: 12 projects from projects.ts
-- Run via: npx supabase db reset (applies migrations + seed)

INSERT INTO projects (title, slug, category, location, description, cover_image_url, is_featured, is_published, display_order)
VALUES
  ('Casa da Oliveira', 'casa-da-oliveira', 'residencial', 'Uberlândia, MG', 'Brasilidade, simplicidade e charme se encontram neste projeto residencial que celebra a essência da arquitetura contemporânea brasileira. A Casa da Oliveira é um exercício de equilíbrio entre o sólido e o sensível, onde cada espaço foi pensado para dialogar com a paisagem e a vida cotidiana dos moradores.', '/images/projects/casa-da-oliveira/IG_PA_OE-1.jpg', true, true, 1),
  ('Fazenda Porto', 'fazenda-porto', 'fazenda', 'Uberlândia, MG', 'Modernidade, ousadia e integração plena com a mata. A Fazenda Porto representa o encontro entre a arquitetura contemporânea e o cenário rural do Triângulo Mineiro, criando espaços que respiram natureza sem abrir mão do conforto e da sofisticação.', '/images/projects/fazenda-porto/FAZENDA PORTO-1.jpg', true, true, 2),
  ('Trash Vinhedos', 'trash-vinhedos', 'comercial', 'Uberlândia, MG', 'Espaço comercial com personalidade marcante que une gastronomia e design. O projeto Trash Vinhedos traduz o espírito despojado e sofisticado do empreendimento em uma arquitetura que convida à experiência.', '/images/projects/trash-vinhedos/trash-1.jpg', true, true, 3),
  ('Thássia e Artur', 'thassia-e-artur', 'residencial', 'Uberlândia, MG', 'Residência que reflete a personalidade e o estilo de vida do casal. Cada ambiente foi desenhado com atenção aos detalhes, criando uma harmonia entre funcionalidade e beleza que torna o dia a dia mais especial.', '/images/projects/thassia-e-artur/img_3920 - arquitetura pavanelli - 25 de junho de 2021.jpg', true, true, 4),
  ('Casa 70', 'casa-70', 'residencial', 'Uberlândia, MG', 'Projeto residencial que celebra a contemporaneidade com linhas limpas e volumes marcantes. A Casa 70 é um exemplo de como a boa arquitetura pode transformar o modo de habitar, criando espaços generosos e iluminados.', '/images/projects/casa-70/pavanelli-1.JPEG', true, true, 5),
  ('Bottega', 'bottega', 'comercial', 'Uberlândia, MG', 'Espaço comercial que transforma a experiência gastronômica em uma jornada sensorial. O projeto Bottega combina materiais nobres com uma atmosfera acolhedora, equilibrando rusticidade e refinamento.', '/images/projects/bottega/BOTTEGA-17.jpg', true, true, 6),
  ('Alessandra Tannus', 'alessandra-tannus', 'residencial', 'Uberlândia, MG', 'Residência que une elegância e funcionalidade em cada detalhe. O projeto para Alessandra Tannus é um testemunho de como a arquitetura pode criar ambientes que acolhem e inspiram, com atenção especial à luz natural e fluidez entre os espaços.', '/images/projects/alessandra-tannus/casa villa dos ipes-1.jpeg', false, true, 7),
  ('Casa Carlo Roberto', 'casa-carlo-roberto', 'residencial', 'Uberlândia, MG', 'Projeto residencial com volumetria marcante e integração generosa entre interior e exterior. A Casa Carlo Roberto explora a relação entre cheios e vazios, criando ritmo e movimento através da arquitetura.', '/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-1.jpg', false, true, 8),
  ('Ícaro Design', 'icaro-design', 'comercial', 'Uberlândia, MG', 'Espaço comercial projetado para refletir a identidade e a criatividade da marca. O projeto para a Ícaro Design combina funcionalidade com uma estética contemporânea, criando um ambiente que inspira colaboração e inovação.', '/images/projects/icaro-design/IG_PA_ICR-1.jpg', false, true, 9),
  ('Point', 'point', 'comercial', 'Uberlândia, MG', 'Projeto comercial que redefine a experiência do espaço urbano. O Point é um convite à convivência, com uma arquitetura que equilibra abertura e intimidade, criando ambientes versáteis e convidativos.', '/images/projects/point/point-1.jpg', false, true, 10),
  ('Takka', 'takka', 'comercial', 'Uberlândia, MG', 'Espaço comercial com identidade forte e atmosfera envolvente. O Takka é um projeto que une gastronomia e design em uma experiência única, com materialidade rica e iluminação cuidadosamente planejada.', '/images/projects/takka/TAKKA-1.jpg', false, true, 11),
  ('Trash 01', 'trash-01', 'comercial', 'Uberlândia, MG', 'A primeira unidade do Trash traz uma proposta irreverente para a cena gastronômica de Uberlândia. O projeto arquitetônico traduz a energia e a identidade da marca em um espaço vibrante e autêntico.', '/images/projects/trash-01/IMG_4377.JPG', false, true, 12);

-- Insert project images
-- Casa da Oliveira
INSERT INTO project_images (project_id, image_url, display_order)
SELECT p.id, img.url, img.ord FROM projects p,
(VALUES
  ('/images/projects/casa-da-oliveira/IG_PA_OE-1.jpg', 1),
  ('/images/projects/casa-da-oliveira/IG_PA_OE-2.jpg', 2),
  ('/images/projects/casa-da-oliveira/IG_PA_OE-3.jpg', 3),
  ('/images/projects/casa-da-oliveira/IG_PA_OE-4.jpg', 4),
  ('/images/projects/casa-da-oliveira/IG_PA_OE-5.jpg', 5),
  ('/images/projects/casa-da-oliveira/IG_PA_OE-6.jpg', 6),
  ('/images/projects/casa-da-oliveira/IG_PA_OE-7.jpg', 7),
  ('/images/projects/casa-da-oliveira/IG_PA_OE-8.jpg', 8),
  ('/images/projects/casa-da-oliveira/IG_PA_OE-9.jpg', 9),
  ('/images/projects/casa-da-oliveira/IG_PA_OE-10.jpg', 10)
) AS img(url, ord)
WHERE p.slug = 'casa-da-oliveira';

-- Fazenda Porto
INSERT INTO project_images (project_id, image_url, display_order)
SELECT p.id, img.url, img.ord FROM projects p,
(VALUES
  ('/images/projects/fazenda-porto/FAZENDA PORTO-1.jpg', 1),
  ('/images/projects/fazenda-porto/FAZENDA PORTO-2.jpg', 2),
  ('/images/projects/fazenda-porto/FAZENDA PORTO-3.jpg', 3),
  ('/images/projects/fazenda-porto/FAZENDA PORTO-4.jpg', 4),
  ('/images/projects/fazenda-porto/FAZENDA PORTO-5.jpg', 5),
  ('/images/projects/fazenda-porto/FAZENDA PORTO-6.jpg', 6),
  ('/images/projects/fazenda-porto/FAZENDA PORTO-7.jpg', 7),
  ('/images/projects/fazenda-porto/FAZENDA PORTO-8.jpg', 8),
  ('/images/projects/fazenda-porto/FAZENDA PORTO-9.jpg', 9),
  ('/images/projects/fazenda-porto/FAZENDA PORTO-10.jpg', 10)
) AS img(url, ord)
WHERE p.slug = 'fazenda-porto';

-- Trash Vinhedos
INSERT INTO project_images (project_id, image_url, display_order)
SELECT p.id, img.url, img.ord FROM projects p,
(VALUES
  ('/images/projects/trash-vinhedos/trash-1.jpg', 1),
  ('/images/projects/trash-vinhedos/trash-2.jpg', 2),
  ('/images/projects/trash-vinhedos/trash-3.jpg', 3),
  ('/images/projects/trash-vinhedos/trash-4.jpg', 4),
  ('/images/projects/trash-vinhedos/trash-5.jpg', 5),
  ('/images/projects/trash-vinhedos/trash-6.jpg', 6),
  ('/images/projects/trash-vinhedos/trash-7.jpg', 7),
  ('/images/projects/trash-vinhedos/trash-8.jpg', 8),
  ('/images/projects/trash-vinhedos/trash-9.jpg', 9),
  ('/images/projects/trash-vinhedos/trash-10.jpg', 10)
) AS img(url, ord)
WHERE p.slug = 'trash-vinhedos';

-- Thássia e Artur
INSERT INTO project_images (project_id, image_url, display_order)
SELECT p.id, img.url, img.ord FROM projects p,
(VALUES
  ('/images/projects/thassia-e-artur/img_3920 - arquitetura pavanelli - 25 de junho de 2021.jpg', 1),
  ('/images/projects/thassia-e-artur/img_4012 - arquitetura pavanelli - 25 de junho de 2021.jpg', 2),
  ('/images/projects/thassia-e-artur/img_4031 - arquitetura pavanelli - 25 de junho de 2021.jpg', 3),
  ('/images/projects/thassia-e-artur/img_4040 - arquitetura pavanelli - 25 de junho de 2021.jpg', 4),
  ('/images/projects/thassia-e-artur/img_4041 - arquitetura pavanelli - 25 de junho de 2021.jpg', 5),
  ('/images/projects/thassia-e-artur/img_4042 - arquitetura pavanelli - 25 de junho de 2021.jpg', 6),
  ('/images/projects/thassia-e-artur/img_4043 - arquitetura pavanelli - 25 de junho de 2021.jpg', 7),
  ('/images/projects/thassia-e-artur/img_4044 - arquitetura pavanelli - 25 de junho de 2021.jpg', 8),
  ('/images/projects/thassia-e-artur/img_4046 - arquitetura pavanelli - 25 de junho de 2021.jpg', 9),
  ('/images/projects/thassia-e-artur/img_4047 - arquitetura pavanelli - 25 de junho de 2021.jpg', 10)
) AS img(url, ord)
WHERE p.slug = 'thassia-e-artur';

-- Casa 70
INSERT INTO project_images (project_id, image_url, display_order)
SELECT p.id, img.url, img.ord FROM projects p,
(VALUES
  ('/images/projects/casa-70/pavanelli-1.JPEG', 1),
  ('/images/projects/casa-70/pavanelli-2.JPEG', 2),
  ('/images/projects/casa-70/pavanelli-3.JPEG', 3),
  ('/images/projects/casa-70/pavanelli-4.JPEG', 4),
  ('/images/projects/casa-70/pavanelli-5.jpg', 5),
  ('/images/projects/casa-70/pavanelli-6.jpg', 6),
  ('/images/projects/casa-70/pavanelli-7.JPEG', 7),
  ('/images/projects/casa-70/pavanelli-8.jpg', 8),
  ('/images/projects/casa-70/pavanelli-9.jpg', 9),
  ('/images/projects/casa-70/pavanelli-10.JPEG', 10)
) AS img(url, ord)
WHERE p.slug = 'casa-70';

-- Bottega
INSERT INTO project_images (project_id, image_url, display_order)
SELECT p.id, img.url, img.ord FROM projects p,
(VALUES
  ('/images/projects/bottega/BOTTEGA-17.jpg', 1),
  ('/images/projects/bottega/BOTTEGA-18.JPEG', 2),
  ('/images/projects/bottega/BOTTEGA-21.JPEG', 3),
  ('/images/projects/bottega/BOTTEGA-27.JPEG', 4),
  ('/images/projects/bottega/BOTTEGA-29.jpg', 5),
  ('/images/projects/bottega/BOTTEGA-34.JPEG', 6),
  ('/images/projects/bottega/BOTTEGA-38.JPEG', 7),
  ('/images/projects/bottega/BOTTEGA-40.jpg', 8),
  ('/images/projects/bottega/BOTTEGA-52.jpg', 9)
) AS img(url, ord)
WHERE p.slug = 'bottega';

-- Alessandra Tannus
INSERT INTO project_images (project_id, image_url, display_order)
SELECT p.id, img.url, img.ord FROM projects p,
(VALUES
  ('/images/projects/alessandra-tannus/casa villa dos ipes-1.jpeg', 1),
  ('/images/projects/alessandra-tannus/casa villa dos ipes-2.jpeg', 2),
  ('/images/projects/alessandra-tannus/casa villa dos ipes-3.jpeg', 3),
  ('/images/projects/alessandra-tannus/casa villa dos ipes-4.jpeg', 4),
  ('/images/projects/alessandra-tannus/casa villa dos ipes-5.jpeg', 5),
  ('/images/projects/alessandra-tannus/casa villa dos ipes-6.jpeg', 6),
  ('/images/projects/alessandra-tannus/casa villa dos ipes-7.jpeg', 7),
  ('/images/projects/alessandra-tannus/casa villa dos ipes-8.jpeg', 8),
  ('/images/projects/alessandra-tannus/casa villa dos ipes-9.jpeg', 9),
  ('/images/projects/alessandra-tannus/casa villa dos ipes-10.jpeg', 10)
) AS img(url, ord)
WHERE p.slug = 'alessandra-tannus';

-- Casa Carlo Roberto
INSERT INTO project_images (project_id, image_url, display_order)
SELECT p.id, img.url, img.ord FROM projects p,
(VALUES
  ('/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-1.jpg', 1),
  ('/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-2.jpg', 2),
  ('/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-3.jpg', 3),
  ('/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-4.jpg', 4),
  ('/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-5.jpg', 5),
  ('/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-6.jpg', 6),
  ('/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-7.jpg', 7),
  ('/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-8.jpg', 8),
  ('/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-9.jpg', 9),
  ('/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-10.jpg', 10)
) AS img(url, ord)
WHERE p.slug = 'casa-carlo-roberto';

-- Ícaro Design
INSERT INTO project_images (project_id, image_url, display_order)
SELECT p.id, img.url, img.ord FROM projects p,
(VALUES
  ('/images/projects/icaro-design/IG_PA_ICR-1.jpg', 1),
  ('/images/projects/icaro-design/IG_PA_ICR-2.jpg', 2),
  ('/images/projects/icaro-design/IG_PA_ICR-3.jpg', 3),
  ('/images/projects/icaro-design/IG_PA_ICR-4.jpg', 4),
  ('/images/projects/icaro-design/IG_PA_ICR-5.jpg', 5),
  ('/images/projects/icaro-design/IG_PA_ICR-6.jpg', 6),
  ('/images/projects/icaro-design/IG_PA_ICR-7.jpg', 7),
  ('/images/projects/icaro-design/IG_PA_ICR-8.jpg', 8),
  ('/images/projects/icaro-design/IG_PA_ICR-9.jpg', 9),
  ('/images/projects/icaro-design/IG_PA_ICR-10.jpg', 10)
) AS img(url, ord)
WHERE p.slug = 'icaro-design';

-- Point
INSERT INTO project_images (project_id, image_url, display_order)
SELECT p.id, img.url, img.ord FROM projects p,
(VALUES
  ('/images/projects/point/point-1.jpg', 1),
  ('/images/projects/point/point-2.jpg', 2),
  ('/images/projects/point/point-3.jpg', 3),
  ('/images/projects/point/point-4.jpg', 4),
  ('/images/projects/point/point-5.jpg', 5),
  ('/images/projects/point/point-6.jpg', 6),
  ('/images/projects/point/point-7.jpg', 7),
  ('/images/projects/point/point-8.jpg', 8),
  ('/images/projects/point/point-9 (1).jpg', 9),
  ('/images/projects/point/point-10.jpg', 10)
) AS img(url, ord)
WHERE p.slug = 'point';

-- Takka
INSERT INTO project_images (project_id, image_url, display_order)
SELECT p.id, img.url, img.ord FROM projects p,
(VALUES
  ('/images/projects/takka/TAKKA-1.jpg', 1),
  ('/images/projects/takka/TAKKA-2.jpg', 2),
  ('/images/projects/takka/TAKKA-3.jpg', 3),
  ('/images/projects/takka/TAKKA-4.jpg', 4),
  ('/images/projects/takka/TAKKA-5.jpg', 5),
  ('/images/projects/takka/TAKKA-6.jpg', 6),
  ('/images/projects/takka/TAKKA-7.jpg', 7),
  ('/images/projects/takka/TAKKA-8.jpg', 8),
  ('/images/projects/takka/TAKKA-9.jpg', 9),
  ('/images/projects/takka/TAKKA-10.jpg', 10)
) AS img(url, ord)
WHERE p.slug = 'takka';

-- Trash 01
INSERT INTO project_images (project_id, image_url, display_order)
SELECT p.id, img.url, img.ord FROM projects p,
(VALUES
  ('/images/projects/trash-01/IMG_4377.JPG', 1),
  ('/images/projects/trash-01/IMG_4378.JPG', 2),
  ('/images/projects/trash-01/IMG_4379.JPG', 3),
  ('/images/projects/trash-01/IMG_4380.JPG', 4),
  ('/images/projects/trash-01/IMG_4381.JPG', 5),
  ('/images/projects/trash-01/IMG_4382.JPG', 6),
  ('/images/projects/trash-01/IMG_4383.JPG', 7),
  ('/images/projects/trash-01/IMG_4384.JPG', 8),
  ('/images/projects/trash-01/IMG_4385.JPG', 9),
  ('/images/projects/trash-01/IMG_4386.JPG', 10)
) AS img(url, ord)
WHERE p.slug = 'trash-01';

-- Seed blog categories
INSERT INTO blog_categories (name, slug) VALUES
  ('Materiais', 'materiais'),
  ('Processo', 'processo'),
  ('Referências', 'referencias'),
  ('Tendências', 'tendencias'),
  ('Sustentabilidade', 'sustentabilidade'),
  ('Cases', 'cases');
