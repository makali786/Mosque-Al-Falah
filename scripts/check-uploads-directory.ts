/**
 * Check /uploads directory structure on HostGator
 */

import { Client } from 'basic-ftp';

const FTP_CONFIG = {
  host: 'ftp.blusynergygroup.com',
  user: 'masjidapp@masjid-alfalah.org.uk',
  password: 'm@sjid786',
  port: 21,
};

async function checkUploadsDirectory() {
  const client = new Client();

  try {
    await client.access(FTP_CONFIG);
    console.log('✅ Connected to FTP\n');

    // Check /public_html/uploads
    console.log('📁 Checking /public_html/uploads:');
    await client.cd('/public_html/uploads');
    const uploadsList = await client.list();

    uploadsList.forEach(item => {
      console.log(`   ${item.type === 2 ? '📁' : '📄'} ${item.name}`);
    });

    // Check if our webp files are there
    const webpFiles = uploadsList.filter(f => f.name.endsWith('.webp'));
    console.log(`\n✅ Found ${webpFiles.length} .webp files in /uploads`);

    // List first few
    console.log('\nSample files:');
    webpFiles.slice(0, 5).forEach(f => {
      console.log(`   📄 ${f.name}`);
    });

    client.close();
  } catch (error) {
    console.error('❌ Error:', error);
    client.close();
  }
}

checkUploadsDirectory();
