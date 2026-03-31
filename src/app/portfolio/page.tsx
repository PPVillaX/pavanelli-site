import type { Metadata } from 'next';
import { getPublishedProjects } from '@/lib/queries';
import PortfolioClient from './portfolio-client';

export const metadata: Metadata = {
  title: 'Portfólio',
  description: 'Portfólio completo da Pavanelli Arquitetura — projetos residenciais, comerciais e fazendas em Uberlândia e todo o Brasil.',
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: 'Portfólio | Pavanelli Arquitetura',
    description: 'Portfólio completo da Pavanelli Arquitetura — projetos residenciais, comerciais e fazendas em Uberlândia e todo o Brasil.',
    url: '/portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfólio | Pavanelli Arquitetura',
    description: 'Portfólio completo da Pavanelli Arquitetura — projetos residenciais, comerciais e fazendas em Uberlândia e todo o Brasil.',
  },
};

export default async function PortfolioPage() {
  const projects = await getPublishedProjects();
  return <PortfolioClient initialProjects={projects} />;
}
