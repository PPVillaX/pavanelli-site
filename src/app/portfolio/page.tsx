import type { Metadata } from 'next';
import { getPublishedProjects } from '@/lib/queries';
import PortfolioClient from './portfolio-client';

export const metadata: Metadata = {
  title: 'Portfólio de Projetos em Uberlândia',
  description: 'Portfólio da Pavanelli Arquitetura: projetos residenciais, comerciais e fazendas em Uberlândia e em todo o Brasil.',
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: 'Portfólio de Projetos em Uberlândia | Pavanelli Arquitetura',
    description: 'Portfólio da Pavanelli Arquitetura: projetos residenciais, comerciais e fazendas em Uberlândia e em todo o Brasil.',
    url: '/portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfólio de Projetos em Uberlândia | Pavanelli Arquitetura',
    description: 'Portfólio da Pavanelli Arquitetura: projetos residenciais, comerciais e fazendas em Uberlândia e em todo o Brasil.',
  },
};

export default async function PortfolioPage() {
  const projects = await getPublishedProjects();
  return <PortfolioClient initialProjects={projects} />;
}
