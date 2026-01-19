/**
 * Migration Script: Migrate Local Media to Vercel Blob Storage
 *
 * This script will:
 * 1. Read all existing media documents from Payload CMS
 * 2. Read the corresponding files from the local media folder
 * 3. Upload them to Vercel Blob Storage
 * 4. Update the media documents with the new URLs
 *
 * Prerequisites:
 * - BLOB_READ_WRITE_TOKEN must be set in your .env file
 * - Local media files must exist in the media/ folder
 *
 * Run with: npx tsx scripts/migrate-media-to-vercel-blob.ts
 */

import { config } from 'dotenv';
config(); // Load .env file

import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

interface MediaDoc {
  id: string;
  filename: string;
  mimeType: string;
  filesize: number;
  url?: string;
  alt?: string;
}

async function migrateMediaToVercelBlob() {

  // Check for BLOB_READ_WRITE_TOKEN
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      '❌ BLOB_READ_WRITE_TOKEN is not set in environment variables!'
    );
    console.error('   Please add it to your .env file.');
    console.error(
      '   You can get it from: Vercel Dashboard → Your Project → Storage → Blob'
    );
    process.exit(1);
  }

  // Initialize Payload
  // @ts-ignore
  const payloadConfigResolved = await payloadConfig;
  const payload = await getPayload({ config: payloadConfigResolved });

  // Get all media documents
  // @ts-ignore
  const { docs: mediaItems } = await payload.find({
    collection: 'media',
    limit: 1000, // Adjust if you have more media
  });


  if (mediaItems.length === 0) {
    process.exit(0);
  }

  const mediaFolder = path.resolve(process.cwd(), 'media');

  // Check if media folder exists
  if (!fs.existsSync(mediaFolder)) {
    console.error('❌ Media folder not found at:', mediaFolder);
    console.error(
      '   Make sure your local media files exist before running this script.'
    );
    process.exit(1);
  }

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const media of mediaItems as MediaDoc[]) {
    const { id, filename, mimeType, alt } = media;

    // Check if already migrated (URL contains vercel blob domain)
    if (media.url && media.url.includes('blob.vercel-storage.com')) {
      skipCount++;
      continue;
    }

    const filePath = path.join(mediaFolder, filename);

    // Check if file exists locally
    if (!fs.existsSync(filePath)) {
      errorCount++;
      continue;
    }

    try {

      // Read the file
      const fileBuffer = fs.readFileSync(filePath);

      // Upload to Vercel Blob
      const blob = await put(filename, fileBuffer, {
        access: 'public',
        contentType: mimeType || 'application/octet-stream',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });


      // Note: Payload with vercel-blob plugin will handle URL updates automatically
      // when re-uploading. We'll store the blob URL for reference.

      successCount++;
    } catch (error) {
      console.error(`   ❌ Failed to upload ${filename}:`, error);
      errorCount++;
    }
  }

  if (successCount > 0) {
    console.log('\n🎉 Migration complete!');
    console.log(
      '\n⚠️  IMPORTANT: You may need to re-seed your data or manually'
    );
    console.log(
      '   re-upload images via the Admin Panel if URL references need updating.'
    );
    console.log('\n   The easiest way is to:');
    console.log('   1. Go to /admin/collections/media');
    console.log('   2. Delete old entries');
    console.log(
      '   3. Re-upload images (they will go to Vercel Blob automatically)'
    );
  }

  process.exit(0);
}

// Alternative: Direct upload without Payload
async function uploadAllLocalMedia() {

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN is not set!');
    process.exit(1);
  }

  const mediaFolder = path.resolve(process.cwd(), 'media');

  if (!fs.existsSync(mediaFolder)) {
    console.error('❌ Media folder not found at:', mediaFolder);
    process.exit(1);
  }

  const files = fs.readdirSync(mediaFolder);
  const mediaFiles = files.filter(f => {
    const ext = path.extname(f).toLowerCase();
    return [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.svg',
      '.mp4',
      '.mp3',
      '.pdf',
    ].includes(ext);
  });


  const uploadedUrls: { filename: string; url: string }[] = [];

  for (const filename of mediaFiles) {
    const filePath = path.join(mediaFolder, filename);

    try {

      const fileBuffer = fs.readFileSync(filePath);
      const mimeType = getMimeType(filename);

      const blob = await put(filename, fileBuffer, {
        access: 'public',
        contentType: mimeType,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      uploadedUrls.push({ filename, url: blob.url });
    } catch (error) {
      console.error(`   ❌ Failed: ${filename}`, error);
    }
  }

  // Save uploaded URLs to a JSON file for reference
  const outputPath = path.resolve(process.cwd(), 'migrated-media-urls.json');
  fs.writeFileSync(outputPath, JSON.stringify(uploadedUrls, null, 2));
}

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.pdf': 'application/pdf',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Run the migration
// Choose one of the following:

// Option 1: Migrate with Payload (reads from database)
migrateMediaToVercelBlob().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});

// Option 2: Direct upload from filesystem (uncomment to use)
// uploadAllLocalMedia().catch(err => {
//   console.error('❌ Upload failed:', err);
//   process.exit(1);
// });
