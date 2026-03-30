import { NextResponse } from 'next/server';
import { getPublishedProjects, getFeaturedProjectsFromDB, getProjectBySlugFromDB, getHeroSlides } from '@/lib/queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'all';
  const slug = searchParams.get('slug');

  try {
    if (mode === 'featured') {
      const data = await getFeaturedProjectsFromDB();
      return NextResponse.json(data);
    }

    if (mode === 'hero') {
      const data = await getHeroSlides();
      return NextResponse.json(data);
    }

    if (mode === 'detail' && slug) {
      const data = await getProjectBySlugFromDB(slug);
      if (!data) return NextResponse.json(null, { status: 404 });
      return NextResponse.json(data);
    }

    const data = await getPublishedProjects();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Projects API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
