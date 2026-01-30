/**
 * Migration Script: Fix Image Extensions
 *
 * This script updates media records in the database that have .jpg, .png, or .jpeg extensions
 * to use .webp extension instead, matching the actual files stored in Vercel Blob storage.
 *
 * Usage:
 *   Dry run (preview changes): npx tsx scripts/fix-image-extensions.ts --dry-run
 *   Apply changes:             npx tsx scripts/fix-image-extensions.ts
 */

import { getPayload } from 'payload';
import config from '../payload.config';

interface MediaRecord {
  id: string;
  filename: string;
  url?: string;
}

const isDryRun = process.argv.includes('--dry-run');

async function fixImageExtensions() {
  console.log('🔧 Starting Image Extension Migration Script');
  console.log(
    `Mode: ${isDryRun ? '🔍 DRY RUN (no changes will be made)' : '✅ APPLY CHANGES'}\n`
  );

  try {
    // Initialize Payload
    const payload = await getPayload({ config });
    console.log('✅ Connected to database\n');

    // Find all media records with .jpg, .png, or .jpeg extensions
    const result = await payload.find({
      collection: 'media',
      where: {
        filename: {
          contains: '.jpg',
        },
      },
      limit: 1000,
    });

    const jpgMedia = result.docs as unknown as MediaRecord[];

    const pngResult = await payload.find({
      collection: 'media',
      where: {
        filename: {
          contains: '.png',
        },
      },
      limit: 1000,
    });

    const pngMedia = pngResult.docs as unknown as MediaRecord[];

    const jpegResult = await payload.find({
      collection: 'media',
      where: {
        filename: {
          contains: '.jpeg',
        },
      },
      limit: 1000,
    });

    const jpegMedia = jpegResult.docs as unknown as MediaRecord[];

    const allMedia = [...jpgMedia, ...pngMedia, ...jpegMedia];

    console.log(`📊 Found ${allMedia.length} media records to update:`);
    console.log(`   - .jpg files: ${jpgMedia.length}`);
    console.log(`   - .png files: ${pngMedia.length}`);
    console.log(`   - .jpeg files: ${jpegMedia.length}\n`);

    if (allMedia.length === 0) {
      console.log('✨ No records to update. All done!');
      process.exit(0);
    }

    let updatedCount = 0;
    const updates: Array<{
      id: string;
      oldFilename: string;
      newFilename: string;
      oldUrl?: string;
      newUrl?: string;
    }> = [];

    for (const media of allMedia) {
      const oldFilename = media.filename;
      const newFilename = oldFilename
        .replace(/\.jpg$/i, '.webp')
        .replace(/\.png$/i, '.webp')
        .replace(/\.jpeg$/i, '.webp');

      let oldUrl = media.url;
      let newUrl = oldUrl;

      // Update URL if it references the old filename
      if (oldUrl && oldUrl.includes(oldFilename)) {
        newUrl = oldUrl.replace(oldFilename, newFilename);
      }

      updates.push({
        id: media.id,
        oldFilename,
        newFilename,
        oldUrl,
        newUrl,
      });

      if (!isDryRun) {
        try {
          const updateData: any = {
            filename: newFilename,
          };

          if (newUrl !== oldUrl) {
            updateData.url = newUrl;
          }

          await payload.update({
            collection: 'media',
            id: media.id,
            data: updateData,
          });

          updatedCount++;
          console.log(`✅ Updated: ${oldFilename} → ${newFilename}`);
        } catch (error) {
          console.error(`❌ Error updating ${oldFilename}:`, error);
        }
      } else {
        console.log(`[DRY RUN] Would update: ${oldFilename} → ${newFilename}`);
      }
    }

    console.log('\n📝 Summary:');
    if (isDryRun) {
      console.log(`   Would update ${updates.length} records`);
      console.log('\n💡 To apply these changes, run without --dry-run flag');
    } else {
      console.log(`   ✅ Successfully updated ${updatedCount} records`);
      console.log(
        `   ❌ Failed to update ${allMedia.length - updatedCount} records`
      );
    }

    console.log('\n✨ Migration script completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running migration:', error);
    process.exit(1);
  }
}

fixImageExtensions();
