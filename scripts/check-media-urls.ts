import { getPayload } from 'payload';
import config from '../payload.config';

async function checkUrls() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'media',
    limit: 30,
  });

  console.log('\n📊 Sample Media URLs:');
  result.docs.forEach((doc: any) => {
    console.log(`\n${doc.filename}:`);
    console.log(`  URL: ${doc.url || 'NO URL'}`);
  });

  process.exit(0);
}

checkUrls();
