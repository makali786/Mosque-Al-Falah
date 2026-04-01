/**
 * Backup all Cloudinary media to local storage
 * Run: npx tsx scripts/backup-cloudinary.ts
 */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dzoatqo2u',
  api_key: process.env.CLOUDINARY_API_KEY || '292672151373435',
  api_secret: process.env.CLOUDINARY_API_SECRET || '7XlZXSEuQgWhhKpOyXskm85qoMY',
  secure: true,
});

const BACKUP_DIR = path.resolve(__dirname, '../cloudinary-backup');

async function backupCloudinary() {
  console.log('🚀 Starting Cloudinary backup...\n');

  // Create backup directory
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  try {
    // Get all resources
    console.log('📥 Fetching resource list...');
    const result = await cloudinary.api.resources({
      max_results: 500, // Adjust if you have more
      type: 'upload',
    });

    console.log(`📊 Found ${result.resources.length} resources\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const resource of result.resources) {
      try {
        // Create folder structure based on public_id
        const publicIdParts = resource.public_id.split('/');
        const filename = publicIdParts.pop() + '.' + resource.format;
        const folderPath = path.join(BACKUP_DIR, ...publicIdParts);

        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        const filePath = path.join(folderPath, filename);

        // Check if already downloaded
        if (fs.existsSync(filePath)) {
          console.log(`⏭️  Skipping (exists): ${resource.public_id}`);
          continue;
        }

        // Download the file
        const response = await fetch(resource.secure_url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        successCount++;
        console.log(`✅ Downloaded: ${resource.public_id}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed: ${resource.public_id}`, error);
      }
    }

    console.log(`\n🎉 Backup complete!`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`\n📁 Backup location: ${BACKUP_DIR}`);

    // Save metadata
    const metadataPath = path.join(BACKUP_DIR, 'metadata.json');
    fs.writeFileSync(
      metadataPath,
      JSON.stringify(
        {
          backupDate: new Date().toISOString(),
          totalResources: result.resources.length,
          resources: result.resources.map((r: Record<string, unknown>) => ({
            public_id: r.public_id,
            format: r.format,
            url: r.secure_url,
            created_at: r.created_at,
          })),
        },
        null,
        2
      )
    );
    console.log(`📝 Metadata saved: ${metadataPath}`);

  } catch (error) {
    console.error('\n❌ Backup failed:', error);
    console.error('\n💡 If your account is disabled, you may need to:');
    console.error('   1. Contact Cloudinary support for temporary reactivation');
    console.error('   2. Or temporarily upgrade to a paid plan');
    process.exit(1);
  }
}

backupCloudinary();
