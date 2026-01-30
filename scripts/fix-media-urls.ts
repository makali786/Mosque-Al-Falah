/**
 * Fix Media URLs Script
 *
 * This script ensures that the URL field in media records matches the filename field.
 * Some URLs still point to old extensions (.jpg/.png) even though filenames were updated to .webp
 *
 * Usage:
 *   Dry run (preview changes): npx tsx scripts/fix-media-urls.ts --dry-run
 *   Apply changes:             npx tsx scripts/fix-media-urls.ts
 */

import { getPayload } from 'payload';
import config from '../payload.config';

interface MediaRecord {
  id: string;
  filename: string;
  url?: string;
}

const isDryRun = process.argv.includes('--dry-run');

async function fixMediaUrls() {
  console.log('🔧 Starting Media URL Fix Script');
  console.log(
    `Mode: ${isDryRun ? '🔍 DRY RUN (no changes will be made)' : '✅ APPLY CHANGES'}\n`
  );

  try {
    // Initialize Payload
    const payload = await getPayload({ config });
    console.log('✅ Connected to database\n');

    // Find all media records
    const result = await payload.find({
      collection: 'media',
      limit: 1000,
    });

    const allMedia = result.docs as unknown as MediaRecord[];
    console.log(`📊 Found ${allMedia.length} media records\n`);

    let updatedCount = 0;
    let mismatchCount = 0;

    for (const media of allMedia) {
      const expectedUrl = `/api/media/file/${encodeURIComponent(media.filename)}`;
      const currentUrl = media.url;

      // Check if URL matches the filename
      if (currentUrl !== expectedUrl) {
        mismatchCount++;

        if (!isDryRun) {
          try {
            await payload.update({
              collection: 'media',
              id: media.id,
              data: {
                url: expectedUrl,
              },
            });

            updatedCount++;
            console.log(`✅ Updated URL for: ${media.filename}`);
            console.log(`   Old: ${currentUrl}`);
            console.log(`   New: ${expectedUrl}\n`);
          } catch (error) {
            console.error(`❌ Error updating ${media.filename}:`, error);
          }
        } else {
          console.log(`[DRY RUN] Would update URL for: ${media.filename}`);
          console.log(`   Old: ${currentUrl}`);
          console.log(`   New: ${expectedUrl}\n`);
        }
      }
    }

    console.log('\n📝 Summary:');
    console.log(`   Total records checked: ${allMedia.length}`);
    console.log(`   Mismatches found: ${mismatchCount}`);

    if (isDryRun) {
      console.log(`   Would update ${mismatchCount} records`);
      console.log('\n💡 To apply these changes, run without --dry-run flag');
    } else {
      console.log(`   ✅ Successfully updated ${updatedCount} records`);
      console.log(
        `   ❌ Failed to update ${mismatchCount - updatedCount} records`
      );
    }

    console.log('\n✨ Script completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running script:', error);
    process.exit(1);
  }
}

fixMediaUrls();
