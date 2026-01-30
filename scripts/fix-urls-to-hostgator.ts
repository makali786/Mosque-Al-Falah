/**
 * Fix Media URLs to point to HostGator
 *
 * Updates all media records to use direct HostGator URLs instead of /api/media/file/
 *
 * Usage: npx tsx scripts/fix-urls-to-hostgator.ts
 */

import { getPayload } from 'payload';
import config from '../payload.config';

const HOSTGATOR_BASE_URL = 'https://masjid-alfalah.org.uk/uploads/media';

async function fixUrls() {
  console.log('🔧 Fixing Media URLs to point to HostGator\n');

  try {
    const payload = await getPayload({ config });
    console.log('✅ Connected to database\n');

    // Find all media records
    const result = await payload.find({
      collection: 'media',
      limit: 1000,
    });

    const allMedia = result.docs as any[];
    console.log(`📊 Found ${allMedia.length} media records\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const media of allMedia) {
      const filename = media.filename;
      const currentUrl = media.url;

      // Check if already using HostGator URL
      if (currentUrl && currentUrl.startsWith(HOSTGATOR_BASE_URL)) {
        console.log(`⏭️  ${filename}: Already using HostGator URL`);
        skippedCount++;
        continue;
      }

      // Create new HostGator URL
      const newUrl = `${HOSTGATOR_BASE_URL}/${encodeURIComponent(filename)}`;

      console.log(`📝 ${filename}:`);
      console.log(`   Old: ${currentUrl}`);
      console.log(`   New: ${newUrl}`);

      // Update database
      await payload.update({
        collection: 'media',
        id: media.id,
        data: {
          url: newUrl,
        },
      });

      console.log(`   ✅ Updated\n`);
      updatedCount++;
    }

    console.log('\n📝 Summary:');
    console.log(`   Total records: ${allMedia.length}`);
    console.log(`   ✅ Updated: ${updatedCount}`);
    console.log(`   ⏭️  Skipped (already correct): ${skippedCount}`);

    console.log('\n✨ URLs updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixUrls();
