import Image from 'next/image';
import Link from 'next/link';
import type { ProjectWithImages } from '@/lib/types';

interface ProjectCardProps {
  project: ProjectWithImages;
  overlayColor?: string;
  overlayOpacity?: number;
}

const categoryLabels: Record<string, string> = {
  residencial: 'Residencial',
  comercial: 'Comercial',
  fazenda: 'Fazenda',
  reforma: 'Reforma',
  interiores: 'Interiores',
};

export default function ProjectCard({ project, overlayColor, overlayOpacity }: ProjectCardProps) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group relative overflow-hidden rounded cursor-pointer block no-underline aspect-[4/3]"
    >
      <Image
        src={project.cover_image_url || '/placeholder.jpg'}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105"
        style={{ objectPosition: (project as { cover_image_focal_point?: string | null }).cover_image_focal_point || 'center' }}
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      {overlayColor && overlayOpacity !== undefined && overlayOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
            mixBlendMode: 'multiply',
          }}
        />
      )}
      <div className="absolute bottom-0 left-0 right-0 p-6 pt-8 bg-gradient-to-t from-[rgba(42,42,42,0.85)] to-transparent text-white transition-all duration-400 md:translate-y-2.5 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
        <h3 className="font-display text-xl font-semibold mb-1">{project.title}</h3>
        <span className="text-xs tracking-[0.1em] uppercase opacity-70">
          {categoryLabels[project.category] || project.category} · {project.location?.split(',')[0]}
        </span>
      </div>
    </Link>
  );
}
