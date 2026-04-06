/**
 * Backup Script for Donation Data
 * 
 * This script creates a backup of:
 * - All donations
 * - All donation appeals
 * - All donors
 * 
 * Usage: npx tsx scripts/backup-donation-data.ts
 */

import configPromise from '@payload-config';
import { getPayload } from 'payload';
import fs from 'fs';
import path from 'path';

async function createBackup() {
  console.log('🔧 Starting backup process...\n');

  try {
    const payload = await getPayload({ config: configPromise });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups');
    
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log(`📁 Created backup directory: ${backupDir}`);
    }

    const backupPath = path.join(backupDir, `donation-backup-${timestamp}.json`);

    // Fetch all donations
    console.log('📥 Fetching all donations...');
    const donations = await payload.find({
      collection: 'donations',
      limit: 10000,
      depth: 2,
    });
    console.log(`   ✓ Found ${donations.docs.length} donations`);

    // Fetch all appeals
    console.log('📥 Fetching all donation appeals...');
    const appeals = await payload.find({
      collection: 'donation-appeals',
      limit: 10000,
    });
    console.log(`   ✓ Found ${appeals.docs.length} appeals`);

    // Fetch all donors
    console.log('📥 Fetching all donors...');
    const donors = await payload.find({
      collection: 'donors',
      limit: 10000,
    });
    console.log(`   ✓ Found ${donors.docs.length} donors`);

    // Create backup object
    const backup = {
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        collections: ['donations', 'donation-appeals', 'donors'],
        counts: {
          donations: donations.docs.length,
          appeals: appeals.docs.length,
          donors: donors.docs.length,
        },
      },
      data: {
        donations: donations.docs,
        appeals: appeals.docs,
        donors: donors.docs,
      },
    };

    // Write backup file
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    
    const fileSize = (fs.statSync(backupPath).size / 1024 / 1024).toFixed(2);
    
    console.log('\n✅ Backup completed successfully!');
    console.log(`📁 File: ${backupPath}`);
    console.log(`📊 Size: ${fileSize} MB`);
    console.log(`📅 Timestamp: ${backup.metadata.timestamp}`);
    console.log('\nBackup Contents:');
    console.log(`   • ${donations.docs.length} donations`);
    console.log(`   • ${appeals.docs.length} appeals`);
    console.log(`   • ${donors.docs.length} donors`);

    return {
      success: true,
      backupPath,
      counts: backup.metadata.counts,
    };

  } catch (error) {
    console.error('\n❌ Backup failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Run backup
createBackup()
  .then((result) => {
    if (result.success) {
      console.log('\n🎉 Backup process completed!');
      process.exit(0);
    } else {
      console.error('\n💥 Backup process failed!');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
  });
