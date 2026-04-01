/**
 * Extract all media URLs from MongoDB database
 * This helps you identify what media needs to be backed up
 * Run: npx tsx scripts/extract-media-urls.ts
 */

import { config } from 'dotenv';
config();

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function extractMediaUrls() {
  console.log('🔍 Extracting media URLs from database...\n');

  // @ts-ignore
  const payloadConfigResolved = await payloadConfig;
  const payload = await getPayload({ config: payloadConfigResolved });

  // Get all media documents
  // @ts-ignore
  const { docs: mediaItems } = await payload.find({
    collection: 'media',
    limit: 1000,
  });

  console.log(`📊 Found ${mediaItems.length} media items\n`);

  const mediaData = mediaItems.map((item: Record<string, unknown>) => ({
    id: item.id,
    filename: item.filename,
    url: item.url,
    mimeType: item.mimeType,
    filesize: item.filesize,
    alt: item.alt,
  }));

  // Save to file
  const outputPath = path.resolve(__dirname, '../media-urls-export.json');
  fs.writeFileSync(outputPath, JSON.stringify(mediaData, null, 2));

  console.log('📝 Media URLs exported to:', outputPath);
  console.log('\n📋 Sample URLs:');
  mediaData.slice(0, 5).forEach((item: Record<string, unknown>, i: number) => {
    console.log(`   ${i + 1}. ${item.filename}`);
    console.log(`      ${item.url}`);
  });

  if (mediaData.length > 5) {
    console.log(`   ... and ${mediaData.length - 5} more`);
  }

  // Generate wget/curl commands for backup
  const backupScriptPath = path.resolve(__dirname, '../download-media.sh');
  const wgetCommands = mediaData
    .filter((item: Record<string, unknown>) => item.url)
    .map((item: Record<string, unknown>) => {
      const filename = item.filename as string;
      const url = item.url as string;
      return `wget -O "cloudinary-backup/${filename}" "${url}" 2>/dev/null && echo "Downloaded: ${filename}" || echo "Failed: ${filename}"`;
    });

  const scriptContent = `#!/bin/bash
# Auto-generated media download script
# Run: bash download-media.sh

mkdir -p cloudinary-backup

${wgetCommands.join('\n')}

echo "Download complete!"
`;

  fs.writeFileSync(backupScriptPath, scriptContent);
  console.log(`\n📝 Download script created: ${backupScriptPath}`);
  console.log('   Run: bash download-media.sh');

  process.exit(0);
}

extractMediaUrls().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
