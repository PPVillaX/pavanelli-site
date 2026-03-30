import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';
import sharp from 'sharp';

const MAX_WIDTH = 2400;
const QUALITY = 82;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const projectId = formData.get('projectId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Tipo de arquivo inválido. Envie apenas imagens.' }, { status: 400 });
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Process with sharp: resize + convert to WebP
    let processed = sharp(buffer);
    const metadata = await processed.metadata();

    if (metadata.width && metadata.width > MAX_WIDTH) {
      processed = processed.resize(MAX_WIDTH, undefined, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    const webpBuffer = await processed
      .webp({ quality: QUALITY })
      .toBuffer();

    // Generate filename
    const timestamp = Date.now();
    const cleanName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
    const filename = `${cleanName}-${timestamp}.webp`;
    const path = projectId ? `projects/${projectId}/${filename}` : `uploads/${filename}`;

    // Upload to Supabase Storage
    const supabase = createAdminClient();
    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(path, webpBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({ error: 'Erro ao fazer upload da imagem.' }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(path);

    return NextResponse.json({
      url: publicUrl,
      path,
      width: metadata.width ? Math.min(metadata.width, MAX_WIDTH) : null,
      height: metadata.height || null,
      size: webpBuffer.length,
      originalSize: buffer.length,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Erro interno ao processar imagem.' }, { status: 500 });
  }
}
