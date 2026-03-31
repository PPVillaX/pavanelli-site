'use client';

import { useState, useMemo } from 'react';
import type { ProjectWithImages } from '@/lib/types';
import ProjectCard from '@/components/ProjectCard';
import ScrollReveal from '@/components/ScrollReveal';

interface PortfolioClientProps {
  initialProjects: ProjectWithImages[];
}

export default function PortfolioClient({ initialProjects }: PortfolioClientProps) {
  const [activeFilter, setActiveFilter] = useState('todos');

  const filterCategories = useMemo(() => {
    const seen = new Set<string>();
    initialProjects.forEach(p => { if (p.category) seen.add(p.category); });
    return [
      { value: 'todos', label: 'Todos' },
      ...Array.from(seen).sort().map(c => ({
        value: c,
        label: c.charAt(0).toUpperCase() + c.slice(1),
      })),
    ];
  }, [initialProjects]);

  const filtered = activeFilter === 'todos'
    ? initialProjects
    : initialProjects.filter(p => p.category === activeFilter);

  return (
    <section className="px-6 md:px-[60px] py-20 md:py-[120px]">
      <ScrollReveal>
        <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-brand-terracotta mb-4">
          Portfólio
        </div>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <h1 className="font-display text-[32px] md:text-[48px] font-bold text-brand-graphite leading-[1.1] mb-6 tracking-tight">
          Projetos selecionados
        </h1>
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <p className="text-[17px] text-brand-gray max-w-[600px] leading-relaxed font-light">
          Cada projeto carrega uma identidade única — sólida, contemporânea e com a brasilidade que define o nosso trabalho.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={300}>
        <div className="flex gap-6 mt-10 flex-wrap">
          {filterCategories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveFilter(cat.value)}
              className={`bg-transparent border-none font-sans text-[13px] font-medium tracking-[0.08em] uppercase cursor-pointer pb-1 border-b-2 transition-all duration-300 ${
                activeFilter === cat.value
                  ? 'text-brand-graphite border-b-brand-terracotta'
                  : 'text-brand-gray border-b-transparent hover:text-brand-graphite'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-[60px]">
        {filtered.map((project, i) => (
          <div
            key={project.slug}
            className="transition-all duration-500"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-brand-gray">
          <p className="text-lg">Nenhum projeto encontrado nesta categoria.</p>
        </div>
      )}
    </section>
  );
}
