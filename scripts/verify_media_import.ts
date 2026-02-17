import { getPayload } from 'payload';
import configPromise from '../payload.config';

const verifyImport = async () => {
    try {
        const payload = await getPayload({ config: configPromise });

        const mediaItems = await payload.find({
            collection: 'media-items',
            limit: 1,
        });

        const media = await payload.find({
            collection: 'media',
            limit: 1,
            where: {
                mimeType: {
                    contains: 'image'
                }
            }
        });

        console.log(`Verification Results:`);
        console.log(`MediaItems Count: ${mediaItems.totalDocs}`);
        console.log(`Media (Images) Count: ${media.totalDocs}`);

        if (mediaItems.totalDocs > 0) {
            console.log(`Sample Item: ${mediaItems.docs[0].title}`);
        }

        process.exit(0);

    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
};

verifyImport();
