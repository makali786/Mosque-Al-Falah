import { getPayload } from 'payload';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Explicitly set credentials from user request
process.env.CLOUDINARY_CLOUD_NAME = 'dzoatqo2u';
process.env.CLOUDINARY_API_KEY = '292672151373435';
process.env.CLOUDINARY_API_SECRET = '7XlZXSEuQgWhhKpOyXskm85qoMY';
process.env.CLOUDINARY_URL = 'cloudinary://292672151373435:7XlZXSEuQgWhhKpOyXskm85qoMY@dzoatqo2u';

import configPromise from '../payload.config';
import fs from 'fs';

const log = (msg: string) => {
    console.log(msg);
    fs.appendFileSync('import_log.txt', msg + '\n');
};

const importMedia = async () => {
    try {
        fs.writeFileSync('import_log.txt', 'Starting Import Log\n');
        log(`Cloudinary Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
        log('Starting Media Import...');
        const payload = await getPayload({ config: configPromise });

        // 1. Read video_data.json
        const jsonPath = path.join(process.cwd(), 'video_data.json');
        const rawData = fs.readFileSync(jsonPath, 'utf-8');
        const videoData = JSON.parse(rawData);

        log(`Found ${videoData.length} items to import.`);

        // 2. Delete existing MediaItems
        log('Deleting existing MediaItems...');
        const existingMediaItems = await payload.find({
            collection: 'media-items',
            limit: 1000,
        });

        if (existingMediaItems.totalDocs > 0) {
            for (const item of existingMediaItems.docs) {
                await payload.delete({
                    collection: 'media-items',
                    id: item.id,
                });
            }
            log(`Deleted ${existingMediaItems.totalDocs} MediaItems.`);
        }

        // 3. Delete existing Media (Images) - SKIPPED as per user request
        log('Skipping Media (Images) deletion...');

        // 4. Import new items
        log('Importing new items...');
        for (const item of videoData) {
            try {
                // a. Find Existing Image
                const imagePath = item.image_path;
                const fileName = path.basename(imagePath);

                // Find media by filename
                const validMedia = await payload.find({
                    collection: 'media',
                    where: {
                        filename: {
                            equals: fileName
                        }
                    },
                    limit: 1,
                });

                let mediaId = null;

                if (validMedia.totalDocs > 0) {
                    mediaId = validMedia.docs[0].id;
                    log(`Found existing media for ${fileName}: ${mediaId}`);
                } else {
                    log(`WARNING: Media not found for ${fileName}. Skipping import of this item...`);
                    continue;
                }

                // b. Create MediaItem
                const slug = item.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');

                await payload.create({
                    collection: 'media-items',
                    data: {
                        title: item.title,
                        slug: slug,
                        description: item.description.substring(0, 200), // Enforce max length
                        fullDescription: {
                            root: {
                                type: 'root',
                                children: [
                                    {
                                        type: 'paragraph',
                                        children: [
                                            {
                                                type: 'text',
                                                version: 1,
                                                text: item.description
                                            }
                                        ],
                                        version: 1
                                    }
                                ],
                                direction: 'ltr',
                                format: '',
                                indent: 0,
                                version: 1
                            }
                        },
                        mediaType: 'video',
                        mediaContent: {
                            videoUrl: item.video_url,
                        },
                        thumbnail: mediaId,
                        category: 'lectures', // Default category
                        publishedDate: new Date().toISOString(),
                        isActive: true,
                    },
                });

                log(`Imported MediaItem: ${item.title}`);

            } catch (error) {
                log(`Failed to import item: ${item.title}. Error: ${error}`);
            }
        }

        log('Import completed successfully.');
        process.exit(0);

    } catch (error) {
        log(`Fatal error during import: ${error}`);
        process.exit(1);
    }
};

importMedia();
