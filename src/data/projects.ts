export interface Project {
  title: string;
  slug: string;
  category: 'residencial' | 'comercial' | 'fazenda';
  location: string;
  year?: number;
  area?: string;
  description: string;
  coverImage: string;
  images: string[];
  isFeatured: boolean;
}

export const projects: Project[] = [
  {
    title: 'Casa da Oliveira',
    slug: 'casa-da-oliveira',
    category: 'residencial',
    location: 'Uberlândia, MG',
    description: 'Brasilidade, simplicidade e charme se encontram neste projeto residencial que celebra a essência da arquitetura contemporânea brasileira. A Casa da Oliveira é um exercício de equilíbrio entre o sólido e o sensível, onde cada espaço foi pensado para dialogar com a paisagem e a vida cotidiana dos moradores.',
    coverImage: '/images/projects/casa-da-oliveira/IG_PA_OE-1.jpg',
    images: [
      '/images/projects/casa-da-oliveira/IG_PA_OE-1.jpg',
      '/images/projects/casa-da-oliveira/IG_PA_OE-2.jpg',
      '/images/projects/casa-da-oliveira/IG_PA_OE-3.jpg',
      '/images/projects/casa-da-oliveira/IG_PA_OE-4.jpg',
      '/images/projects/casa-da-oliveira/IG_PA_OE-5.jpg',
      '/images/projects/casa-da-oliveira/IG_PA_OE-6.jpg',
      '/images/projects/casa-da-oliveira/IG_PA_OE-7.jpg',
      '/images/projects/casa-da-oliveira/IG_PA_OE-8.jpg',
      '/images/projects/casa-da-oliveira/IG_PA_OE-9.jpg',
      '/images/projects/casa-da-oliveira/IG_PA_OE-10.jpg',
    ],
    isFeatured: true,
  },
  {
    title: 'Fazenda Porto',
    slug: 'fazenda-porto',
    category: 'fazenda',
    location: 'Uberlândia, MG',
    description: 'Modernidade, ousadia e integração plena com a mata. A Fazenda Porto representa o encontro entre a arquitetura contemporânea e o cenário rural do Triângulo Mineiro, criando espaços que respiram natureza sem abrir mão do conforto e da sofisticação.',
    coverImage: '/images/projects/fazenda-porto/FAZENDA PORTO-1.jpg',
    images: [
      '/images/projects/fazenda-porto/FAZENDA PORTO-1.jpg',
      '/images/projects/fazenda-porto/FAZENDA PORTO-2.jpg',
      '/images/projects/fazenda-porto/FAZENDA PORTO-3.jpg',
      '/images/projects/fazenda-porto/FAZENDA PORTO-4.jpg',
      '/images/projects/fazenda-porto/FAZENDA PORTO-5.jpg',
      '/images/projects/fazenda-porto/FAZENDA PORTO-6.jpg',
      '/images/projects/fazenda-porto/FAZENDA PORTO-7.jpg',
      '/images/projects/fazenda-porto/FAZENDA PORTO-8.jpg',
      '/images/projects/fazenda-porto/FAZENDA PORTO-9.jpg',
      '/images/projects/fazenda-porto/FAZENDA PORTO-10.jpg',
    ],
    isFeatured: true,
  },
  {
    title: 'Trash Vinhedos',
    slug: 'trash-vinhedos',
    category: 'comercial',
    location: 'Uberlândia, MG',
    description: 'Espaço comercial com personalidade marcante que une gastronomia e design. O projeto Trash Vinhedos traduz o espírito despojado e sofisticado do empreendimento em uma arquitetura que convida à experiência.',
    coverImage: '/images/projects/trash-vinhedos/trash-1.jpg',
    images: [
      '/images/projects/trash-vinhedos/trash-1.jpg',
      '/images/projects/trash-vinhedos/trash-2.jpg',
      '/images/projects/trash-vinhedos/trash-3.jpg',
      '/images/projects/trash-vinhedos/trash-4.jpg',
      '/images/projects/trash-vinhedos/trash-5.jpg',
      '/images/projects/trash-vinhedos/trash-6.jpg',
      '/images/projects/trash-vinhedos/trash-7.jpg',
      '/images/projects/trash-vinhedos/trash-8.jpg',
      '/images/projects/trash-vinhedos/trash-9.jpg',
      '/images/projects/trash-vinhedos/trash-10.jpg',
    ],
    isFeatured: true,
  },
  {
    title: 'Thássia e Artur',
    slug: 'thassia-e-artur',
    category: 'residencial',
    location: 'Uberlândia, MG',
    description: 'Residência que reflete a personalidade e o estilo de vida do casal. Cada ambiente foi desenhado com atenção aos detalhes, criando uma harmonia entre funcionalidade e beleza que torna o dia a dia mais especial.',
    coverImage: '/images/projects/thassia-e-artur/img_3920 - arquitetura pavanelli - 25 de junho de 2021.jpg',
    images: [
      '/images/projects/thassia-e-artur/img_3920 - arquitetura pavanelli - 25 de junho de 2021.jpg',
      '/images/projects/thassia-e-artur/img_4012 - arquitetura pavanelli - 25 de junho de 2021.jpg',
      '/images/projects/thassia-e-artur/img_4031 - arquitetura pavanelli - 25 de junho de 2021.jpg',
      '/images/projects/thassia-e-artur/img_4040 - arquitetura pavanelli - 25 de junho de 2021.jpg',
      '/images/projects/thassia-e-artur/img_4041 - arquitetura pavanelli - 25 de junho de 2021.jpg',
      '/images/projects/thassia-e-artur/img_4042 - arquitetura pavanelli - 25 de junho de 2021.jpg',
      '/images/projects/thassia-e-artur/img_4043 - arquitetura pavanelli - 25 de junho de 2021.jpg',
      '/images/projects/thassia-e-artur/img_4044 - arquitetura pavanelli - 25 de junho de 2021.jpg',
      '/images/projects/thassia-e-artur/img_4046 - arquitetura pavanelli - 25 de junho de 2021.jpg',
      '/images/projects/thassia-e-artur/img_4047 - arquitetura pavanelli - 25 de junho de 2021.jpg',
    ],
    isFeatured: true,
  },
  {
    title: 'Casa 70',
    slug: 'casa-70',
    category: 'residencial',
    location: 'Uberlândia, MG',
    description: 'Projeto residencial que celebra a contemporaneidade com linhas limpas e volumes marcantes. A Casa 70 é um exemplo de como a boa arquitetura pode transformar o modo de habitar, criando espaços generosos e iluminados.',
    coverImage: '/images/projects/casa-70/pavanelli-1.JPEG',
    images: [
      '/images/projects/casa-70/pavanelli-1.JPEG',
      '/images/projects/casa-70/pavanelli-2.JPEG',
      '/images/projects/casa-70/pavanelli-3.JPEG',
      '/images/projects/casa-70/pavanelli-4.JPEG',
      '/images/projects/casa-70/pavanelli-5.jpg',
      '/images/projects/casa-70/pavanelli-6.jpg',
      '/images/projects/casa-70/pavanelli-7.JPEG',
      '/images/projects/casa-70/pavanelli-8.jpg',
      '/images/projects/casa-70/pavanelli-9.jpg',
      '/images/projects/casa-70/pavanelli-10.JPEG',
    ],
    isFeatured: true,
  },
  {
    title: 'Bottega',
    slug: 'bottega',
    category: 'comercial',
    location: 'Uberlândia, MG',
    description: 'Espaço comercial que transforma a experiência gastronômica em uma jornada sensorial. O projeto Bottega combina materiais nobres com uma atmosfera acolhedora, equilibrando rusticidade e refinamento.',
    coverImage: '/images/projects/bottega/BOTTEGA-17.jpg',
    images: [
      '/images/projects/bottega/BOTTEGA-17.jpg',
      '/images/projects/bottega/BOTTEGA-18.JPEG',
      '/images/projects/bottega/BOTTEGA-21.JPEG',
      '/images/projects/bottega/BOTTEGA-27.JPEG',
      '/images/projects/bottega/BOTTEGA-29.jpg',
      '/images/projects/bottega/BOTTEGA-34.JPEG',
      '/images/projects/bottega/BOTTEGA-38.JPEG',
      '/images/projects/bottega/BOTTEGA-40.jpg',
      '/images/projects/bottega/BOTTEGA-52.jpg',
    ],
    isFeatured: true,
  },
  {
    title: 'Alessandra Tannus',
    slug: 'alessandra-tannus',
    category: 'residencial',
    location: 'Uberlândia, MG',
    description: 'Residência que une elegância e funcionalidade em cada detalhe. O projeto para Alessandra Tannus é um testemunho de como a arquitetura pode criar ambientes que acolhem e inspiram, com atenção especial à luz natural e fluidez entre os espaços.',
    coverImage: '/images/projects/alessandra-tannus/casa villa dos ipes-1.jpeg',
    images: [
      '/images/projects/alessandra-tannus/casa villa dos ipes-1.jpeg',
      '/images/projects/alessandra-tannus/casa villa dos ipes-2.jpeg',
      '/images/projects/alessandra-tannus/casa villa dos ipes-3.jpeg',
      '/images/projects/alessandra-tannus/casa villa dos ipes-4.jpeg',
      '/images/projects/alessandra-tannus/casa villa dos ipes-5.jpeg',
      '/images/projects/alessandra-tannus/casa villa dos ipes-6.jpeg',
      '/images/projects/alessandra-tannus/casa villa dos ipes-7.jpeg',
      '/images/projects/alessandra-tannus/casa villa dos ipes-8.jpeg',
      '/images/projects/alessandra-tannus/casa villa dos ipes-9.jpeg',
      '/images/projects/alessandra-tannus/casa villa dos ipes-10.jpeg',
    ],
    isFeatured: false,
  },
  {
    title: 'Casa Carlo Roberto',
    slug: 'casa-carlo-roberto',
    category: 'residencial',
    location: 'Uberlândia, MG',
    description: 'Projeto residencial com volumetria marcante e integração generosa entre interior e exterior. A Casa Carlo Roberto explora a relação entre cheios e vazios, criando ritmo e movimento através da arquitetura.',
    coverImage: '/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-1.jpg',
    images: [
      '/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-1.jpg',
      '/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-2.jpg',
      '/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-3.jpg',
      '/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-4.jpg',
      '/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-5.jpg',
      '/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-6.jpg',
      '/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-7.jpg',
      '/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-8.jpg',
      '/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-9.jpg',
      '/images/projects/casa-carlo-roberto/IG_PA_CASA VAO-10.jpg',
    ],
    isFeatured: false,
  },
  {
    title: 'Ícaro Design',
    slug: 'icaro-design',
    category: 'comercial',
    location: 'Uberlândia, MG',
    description: 'Espaço comercial projetado para refletir a identidade e a criatividade da marca. O projeto para a Ícaro Design combina funcionalidade com uma estética contemporânea, criando um ambiente que inspira colaboração e inovação.',
    coverImage: '/images/projects/icaro-design/IG_PA_ICR-1.jpg',
    images: [
      '/images/projects/icaro-design/IG_PA_ICR-1.jpg',
      '/images/projects/icaro-design/IG_PA_ICR-2.jpg',
      '/images/projects/icaro-design/IG_PA_ICR-3.jpg',
      '/images/projects/icaro-design/IG_PA_ICR-4.jpg',
      '/images/projects/icaro-design/IG_PA_ICR-5.jpg',
      '/images/projects/icaro-design/IG_PA_ICR-6.jpg',
      '/images/projects/icaro-design/IG_PA_ICR-7.jpg',
      '/images/projects/icaro-design/IG_PA_ICR-8.jpg',
      '/images/projects/icaro-design/IG_PA_ICR-9.jpg',
      '/images/projects/icaro-design/IG_PA_ICR-10.jpg',
    ],
    isFeatured: false,
  },
  {
    title: 'Point',
    slug: 'point',
    category: 'comercial',
    location: 'Uberlândia, MG',
    description: 'Projeto comercial que redefine a experiência do espaço urbano. O Point é um convite à convivência, com uma arquitetura que equilibra abertura e intimidade, criando ambientes versáteis e convidativos.',
    coverImage: '/images/projects/point/point-1.jpg',
    images: [
      '/images/projects/point/point-1.jpg',
      '/images/projects/point/point-2.jpg',
      '/images/projects/point/point-3.jpg',
      '/images/projects/point/point-4.jpg',
      '/images/projects/point/point-5.jpg',
      '/images/projects/point/point-6.jpg',
      '/images/projects/point/point-7.jpg',
      '/images/projects/point/point-8.jpg',
      '/images/projects/point/point-9 (1).jpg',
      '/images/projects/point/point-10.jpg',
    ],
    isFeatured: false,
  },
  {
    title: 'Takka',
    slug: 'takka',
    category: 'comercial',
    location: 'Uberlândia, MG',
    description: 'Espaço comercial com identidade forte e atmosfera envolvente. O Takka é um projeto que une gastronomia e design em uma experiência única, com materialidade rica e iluminação cuidadosamente planejada.',
    coverImage: '/images/projects/takka/TAKKA-1.jpg',
    images: [
      '/images/projects/takka/TAKKA-1.jpg',
      '/images/projects/takka/TAKKA-2.jpg',
      '/images/projects/takka/TAKKA-3.jpg',
      '/images/projects/takka/TAKKA-4.jpg',
      '/images/projects/takka/TAKKA-5.jpg',
      '/images/projects/takka/TAKKA-6.jpg',
      '/images/projects/takka/TAKKA-7.jpg',
      '/images/projects/takka/TAKKA-8.jpg',
      '/images/projects/takka/TAKKA-9.jpg',
      '/images/projects/takka/TAKKA-10.jpg',
    ],
    isFeatured: false,
  },
  {
    title: 'Trash 01',
    slug: 'trash-01',
    category: 'comercial',
    location: 'Uberlândia, MG',
    description: 'A primeira unidade do Trash traz uma proposta irreverente para a cena gastronômica de Uberlândia. O projeto arquitetônico traduz a energia e a identidade da marca em um espaço vibrante e autêntico.',
    coverImage: '/images/projects/trash-01/IMG_4377.JPG',
    images: [
      '/images/projects/trash-01/IMG_4377.JPG',
      '/images/projects/trash-01/IMG_4378.JPG',
      '/images/projects/trash-01/IMG_4379.JPG',
      '/images/projects/trash-01/IMG_4380.JPG',
      '/images/projects/trash-01/IMG_4381.JPG',
      '/images/projects/trash-01/IMG_4382.JPG',
      '/images/projects/trash-01/IMG_4383.JPG',
      '/images/projects/trash-01/IMG_4384.JPG',
      '/images/projects/trash-01/IMG_4385.JPG',
      '/images/projects/trash-01/IMG_4386.JPG',
    ],
    isFeatured: false,
  },
];

export const categories = [
  { value: 'todos', label: 'Todos' },
  { value: 'residencial', label: 'Residencial' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'fazenda', label: 'Fazenda' },
] as const;

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(p => p.isFeatured);
}

export function getProjectsByCategory(category: string): Project[] {
  if (category === 'todos') return projects;
  return projects.filter(p => p.category === category);
}

export function getAdjacentProjects(slug: string): { prev: Project | null; next: Project | null } {
  const index = projects.findIndex(p => p.slug === slug);
  return {
    prev: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}
