#!/usr/bin/env npx tsx
/**
 * migrate-images.ts
 * 
 * Reads photos from "Fotos de Projetos/", optimizes with Sharp,
 * uploads to Supabase Storage bucket "project-images",
 * and updates URLs in the database (projects.cover_image_url + project_images).
 *
 * Usage:
 *   npx tsx scripts/migrate-images.ts
 *
 * Environment:
 *   NEXT_PUBLIC_SUPABASE_URL  (default: http://127.0.0.1:54331)
 *   SUPABASE_SERVICE_ROLE_KEY (required)
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// ─── Config ───────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54331';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

const BUCKET = 'project-images';
const MAX_WIDTH = 2400;
const WEBP_QUALITY = 82;

// Root of the project (one level up from /site/)
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const PHOTOS_DIR = path.join(PROJECT_ROOT, 'Fotos de Projetos');

// ─── Folder → Slug mapping ───────────────────────────────────────

const FOLDER_TO_SLUG: Record<string, string> = {
  'CASA DA OLIVEIRA - FINAIS': 'casa-da-oliveira',
  'FAZENDA PORTO - OFICIAIS': 'fazenda-porto',
  'TRASH VINHEDOS - FINAIS': 'trash-vinhedos',
  'THÁSSIA E ARTUR': 'thassia-e-artur',
  'CASA 70 - OFICIAIS': 'casa-70',
  'BOTTEGA - Oficiais': 'bottega',
  'ALESSANDRA TANNUS - oficiais': 'alessandra-tannus',
  'CASA CARLO ROBERTO - FINAIS': 'casa-carlo-roberto',
  'ÍCARO DESIGN - Oficiais': 'icaro-design',
  'POINT  - FINAIS': 'point',
  'TAKKA - FINAIS': 'takka',
  'TRASH 01 - Oficiais': 'trash-01',
};

// ─── Helpers ──────────────────────────────────────────────────────

async function supabaseRest(method: string, path: string, body?: unknown) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: {
      'apikey': SERVICE_KEY!,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'PATCH' ? 'return=minimal' : 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`REST ${method} ${path} → ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function uploadToStorage(filePath: string, storagePath: string, buffer: Buffer) {
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePath}`,
    {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY!,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'image/webp',
        'x-upsert': 'true',
      },
      body: new Uint8Array(buffer),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload ${storagePath} → ${res.status}: ${text}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}

async function optimizeImage(inputPath: string): Promise<Buffer> {
  return sharp(inputPath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, '') // remove extension
    .replace(/[^a-z0-9-_]/g, '-') // replace special chars
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-|-$/g, '') // trim dashes
    + '.webp';
}

function getImageFiles(dir: string): string[] {
  return fs.readdirSync(dir)
    .filter(f => /\.(jpe?g|png|webp|tiff?)$/i.test(f))
    .sort((a, b) => {
      // Natural sort: extract trailing number
      const numA = parseInt(a.match(/(\d+)\.[^.]+$/)?.[1] || '0');
      const numB = parseInt(b.match(/(\d+)\.[^.]+$/)?.[1] || '0');
      return numA - numB;
    });
}

// ─── Main ─────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Pavanelli Image Migration');
  console.log(`   Supabase: ${SUPABASE_URL}`);
  console.log(`   Photos:   ${PHOTOS_DIR}`);
  console.log('');

  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error(`❌ Photos directory not found: ${PHOTOS_DIR}`);
    process.exit(1);
  }

  const folders = fs.readdirSync(PHOTOS_DIR).filter(f =>
    fs.statSync(path.join(PHOTOS_DIR, f)).isDirectory()
  );

  let totalUploaded = 0;
  let totalSkipped = 0;

  for (const folder of folders) {
    const slug = FOLDER_TO_SLUG[folder];
    if (!slug) {
      console.log(`⏭️  Skipping unknown folder: ${folder}`);
      totalSkipped++;
      continue;
    }

    console.log(`\n📁 ${folder} → ${slug}`);

    // Get project from DB
    const projects = await supabaseRest(
      'GET',
      `/rest/v1/projects?slug=eq.${encodeURIComponent(slug)}&select=id,slug,cover_image_url`
    );

    if (!projects?.length) {
      console.log(`   ⚠️  Project "${slug}" not found in DB — skipping`);
      totalSkipped++;
      continue;
    }

    const project = projects[0];
    const folderPath = path.join(PHOTOS_DIR, folder);
    const imageFiles = getImageFiles(folderPath);

    console.log(`   Found ${imageFiles.length} images`);

    // Delete existing project_images entries
    await supabaseRest(
      'DELETE',
      `/rest/v1/project_images?project_id=eq.${project.id}`
    ).catch(() => { /* ignore if none exist */ });

    let coverUrl = '';

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const inputPath = path.join(folderPath, file);
      const storageName = sanitizeFilename(file);
      const storagePath = `${slug}/${storageName}`;

      try {
        process.stdout.write(`   [${i + 1}/${imageFiles.length}] ${file} → ${storageName}...`);

        const buffer = await optimizeImage(inputPath);
        const publicUrl = await uploadToStorage(inputPath, storagePath, buffer);

        // First image is cover
        if (i === 0) {
          coverUrl = publicUrl;
        }

        // Insert into project_images
        await supabaseRest('POST', '/rest/v1/project_images', {
          project_id: project.id,
          image_url: publicUrl,
          alt_text: `${slug} — foto ${i + 1}`,
          display_order: i,
        });

        const sizeMB = (buffer.length / 1024 / 1024).toFixed(1);
        console.log(` ✅ (${sizeMB} MB)`);
        totalUploaded++;
      } catch (err) {
        console.log(` ❌ ${(err as Error).message}`);
      }
    }

    // Update project cover
    if (coverUrl) {
      await supabaseRest(
        'PATCH',
        `/rest/v1/projects?id=eq.${project.id}`,
        { cover_image_url: coverUrl }
      );
      console.log(`   🖼️  Cover updated: ${coverUrl.split('/').pop()}`);
    }
  }

  console.log('\n────────────────────────────────────────');
  console.log(`✅ Done! Uploaded: ${totalUploaded} | Skipped: ${totalSkipped}`);
}

main().catch(err => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
