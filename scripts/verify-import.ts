
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getPayload } from 'payload';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Hardcode credentials
process.env.CLOUDINARY_CLOUD_NAME = 'dzoatqo2u';
process.env.CLOUDINARY_API_KEY = '292672151373435';
process.env.CLOUDINARY_API_SECRET = '7XlZXSEuQgWhhKpOyXskm85qoMY';
process.env.CLOUDINARY_URL = 'cloudinary://292672151373435:7XlZXSEuQgWhhKpOyXskm85qoMY@dzoatqo2u';

const verify = async () => {
    try {
        const { default: config } = await import('../payload.config');
        const payload = await getPayload({ config });

        const mediaItems = await payload.find({
            collection: 'media-items',
            limit: 10,
            sort: '-createdAt',
        });

        console.log(`Total MediaItems: ${mediaItems.totalDocs}`);

        if (mediaItems.docs.length > 0) {
            console.log('Sample Item:');
            console.log(JSON.stringify(mediaItems.docs[0], null, 2));
        }

        const imams = await payload.find({
            collection: 'imams',
            where: { name: { contains: 'Qari Adil' } }
        });
        console.log(`Found Imam: ${imams.totalDocs > 0 ? imams.docs[0].name : 'None'}`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
verify();
