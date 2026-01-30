/**
 * Migrate Images from Vercel Blob to HostGator
 *
 * This script downloads all images from the database and uploads them to HostGator via FTP.
 *
 * Usage:
 *   Dry run (preview): npx tsx scripts/migrate-images-to-hostgator.ts --dry-run
 *   Execute migration: npx tsx scripts/migrate-images-to-hostgator.ts
 */

import * as fs from 'fs';
import http from 'http';
import https from 'https';
import * as path from 'path';
import { getPayload } from 'payload';
import { uploadToHostGator } from '../lib/uploadToHostGator';
import config from '../payload.config';

interface MediaRecord {
  id: string;
  filename: string;
  url?: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

const isDryRun = process.argv.includes('--dry-run');
const DOWNLOAD_DIR = path.join(process.cwd(), 'temp-images');

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client
      .get(url, response => {
        if (response.statusCode === 200) {
          const fileStream = fs.createWriteStream(filepath);
          response.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve();
          });
        } else if (response.statusCode === 301 || response.statusCode === 302) {
          // Handle redirect
          if (response.headers.location) {
            downloadImage(response.headers.location, filepath)
              .then(resolve)
              .catch(reject);
          } else {
            reject(
              new Error(`Redirect without location: ${response.statusCode}`)
            );
          }
        } else {
          reject(new Error(`Failed to download: ${response.statusCode}`));
        }
      })
      .on('error', reject);
  });
}

async function migrateImages() {
  console.log('🔧 Starting Image Migration to HostGator');
  console.log(
    `Mode: ${isDryRun ? '🔍 DRY RUN (preview only)' : '✅ MIGRATE IMAGES'}\n`
  );

  try {
    // Initialize Payload
    const payload = await getPayload({ config });
    console.log('✅ Connected to database\n');

    // Create temp download directory
    if (!isDryRun && !fs.existsSync(DOWNLOAD_DIR)) {
      fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
      console.log(`✅ Created temp directory: ${DOWNLOAD_DIR}\n`);
    }

    // Find all media records with .webp extension
    const result = await payload.find({
      collection: 'media',
      where: {
        filename: {
          contains: '.webp',
        },
      },
      limit: 1000,
    });

    const allMedia = result.docs as unknown as MediaRecord[];
    console.log(`📊 Found ${allMedia.length} media records to migrate\n`);

    let successCount = 0;
    let failCount = 0;
    let skippedCount = 0;

    for (const media of allMedia) {
      const filename = media.filename;

      console.log(`\n📄 Processing: ${filename}`);

      // Check if already migrated (URL starts with https://masjid-alfalah.org.uk)
      if (
        media.url &&
        media.url.startsWith('https://masjid-alfalah.org.uk/media')
      ) {
        console.log(`   ⏭️  Already migrated, skipping...`);
        skippedCount++;
        continue;
      }

      if (isDryRun) {
        console.log(
          `   [DRY RUN] Would migrate to: https://masjid-alfalah.org.uk/media/${encodeURIComponent(filename)}`
        );
        successCount++;
        continue;
      }

      try {
        // Check for file in local media folder
        const possibleFilenames = [
          filename,
          filename.replace(/ /g, '_'), // Replace spaces with underscores
          filename.replace(/%20/g, '_'),
          filename.replace(/ /g, '-'), // Replace spaces with hyphens
        ];

        let localFilePath: string | null = null;
        const mediaDir = path.join(process.cwd(), 'media');

        for (const possibleFilename of possibleFilenames) {
          const testPath = path.join(mediaDir, possibleFilename);
          if (fs.existsSync(testPath)) {
            localFilePath = testPath;
            console.log(`   📁 Found: ${possibleFilename}`);
            break;
          }
        }

        if (!localFilePath) {
          console.log(`   ⚠️  File not found in media folder, skipping...`);
          failCount++;
          continue;
        }

        // Upload to HostGator
        console.log(`   ⬆️  Uploading to HostGator...`);
        const uploadResult = await uploadToHostGator(localFilePath, filename);

        if (uploadResult.success) {
          console.log(`   ✅ Uploaded successfully!`);
          console.log(`   🔗 URL: ${uploadResult.url}`);

          // Update database with new URL
          await payload.update({
            collection: 'media',
            id: media.id,
            data: {
              url: uploadResult.url,
            },
          });

          console.log(`   ✅ Database updated`);
          successCount++;
        } else {
          console.log(`   ❌ Upload failed: ${uploadResult.error}`);
          failCount++;
        }
      } catch (error) {
        console.error(`   ❌ Error processing ${filename}:`, error);
        failCount++;
      }
    }

    // Clean up temp directory
    if (!isDryRun && fs.existsSync(DOWNLOAD_DIR)) {
      fs.rmSync(DOWNLOAD_DIR, { recursive: true });
      console.log(`\n🗑️  Cleaned up temp directory`);
    }

    console.log('\n📝 Migration Summary:');
    console.log(`   Total records: ${allMedia.length}`);
    console.log(`   ✅ Successfully migrated: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   ⏭️  Skipped (already migrated): ${skippedCount}`);

    if (isDryRun) {
      console.log('\n💡 To execute migration, run without --dry-run flag');
    }

    console.log('\n✨ Migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateImages();
