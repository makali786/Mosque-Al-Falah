/**
 * Test HostGator FTP Connection
 *
 * Quick script to test if FTP connection to HostGator works
 *
 * Usage: npx tsx scripts/test-ftp-connection.ts
 */

import { testFTPConnection } from '../lib/uploadToHostGator';

async function main() {
  console.log('🔧 Testing HostGator FTP Connection...\n');

  const success = await testFTPConnection();

  if (success) {
    console.log('\n✨ FTP connection test passed!');
    process.exit(0);
  } else {
    console.log('\n❌ FTP connection test failed!');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
