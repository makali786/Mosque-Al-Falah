/**
 * Check HostGator FTP Directory Structure
 *
 * This script lists the directory structure to verify where files should be uploaded
 */

import { Client } from 'basic-ftp';

const FTP_CONFIG = {
  host: process.env.HOSTGATOR_FTP_HOST || 'ftp.blusynergygroup.com',
  user: process.env.HOSTGATOR_FTP_USER || 'masjidapp@masjid-alfalah.org.uk',
  password: process.env.HOSTGATOR_FTP_PASSWORD || 'm@sjid786',
  port: parseInt(process.env.HOSTGATOR_FTP_PORT || '21'),
};

async function checkDirectory() {
  const client = new Client();

  try {
    await client.access(FTP_CONFIG);
    console.log('✅ Connected to FTP\n');

    // List root directory
    console.log('📁 Root directory:');
    const rootList = await client.list();
    rootList.forEach(item => {
      console.log(`   ${item.type === 2 ? '📁' : '📄'} ${item.name}`);
    });

    // Check if public_html exists
    console.log('\n📁 Checking /public_html:');
    try {
      await client.cd('/public_html');
      const publicHtmlList = await client.list();
      publicHtmlList.forEach(item => {
        console.log(`   ${item.type === 2 ? '📁' : '📄'} ${item.name}`);
      });

      // Check if media folder exists
      console.log('\n📁 Checking /public_html/media:');
      try {
        await client.cd('/public_html/media');
        const mediaList = await client.list();
        console.log(`Found ${mediaList.length} files in /public_html/media`);
        mediaList.slice(0, 10).forEach(item => {
          console.log(
            `   ${item.type === 2 ? '📁' : '📄'} ${item.name} (${item.size} bytes)`
          );
        });
      } catch (error) {
        console.log('   ❌ /public_html/media does not exist');
      }
    } catch (error) {
      console.log('   ❌ /public_html does not exist');
    }

    client.close();
  } catch (error) {
    console.error('❌ Error:', error);
    client.close();
    process.exit(1);
  }
}

checkDirectory();
