import { getPayload } from 'payload';
import config from '../payload.config';

async function checkOneUrl() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: 'media',
    where: {
      filename: {
        equals: 'bannar.webp',
      },
    },
  });

  if (result.docs.length > 0) {
    const media = result.docs[0];
    console.log('\n📄 bannar.webp:');
    console.log('   URL:', media.url);
    console.log('   Filename:', media.filename);
  } else {
    console.log('❌ bannar.webp not found');
  }

  process.exit(0);
}

checkOneUrl();
