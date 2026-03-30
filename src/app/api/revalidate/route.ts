import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST() {
  // Only authenticated admin users can trigger revalidation
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Revalidate all pages that consume site_settings
  revalidatePath('/', 'layout');
  revalidatePath('/contato');
  revalidatePath('/sobre');
  revalidatePath('/portfolio');
  revalidatePath('/blog');

  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
