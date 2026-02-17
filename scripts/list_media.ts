import { getPayload } from 'payload';
import configPromise from '../payload.config';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const listMedia = async () => {
    try {
        const payload = await getPayload({ config: configPromise });
        const media = await payload.find({
            collection: 'media',
            limit: 10,
        });

        console.log('Existing Media Samples:');
        media.docs.forEach(doc => {
            console.log(`ID: ${doc.id}, Filename: ${doc.filename}, Alt: ${doc.alt}`);
        });
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
listMedia();
