
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getPayload } from 'payload';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Hardcode credentials as requested by user to bypass .env issues
process.env.CLOUDINARY_CLOUD_NAME = 'dzoatqo2u';
process.env.CLOUDINARY_API_KEY = '292672151373435';
process.env.CLOUDINARY_API_SECRET = '7XlZXSEuQgWhhKpOyXskm85qoMY';
process.env.CLOUDINARY_URL = 'cloudinary://292672151373435:7XlZXSEuQgWhhKpOyXskm85qoMY@dzoatqo2u';

// Define types for our data.json structure
interface VideoData {
    youtube_link: string;
    speaker_name: string;
    image_local_path: string;
    youtube_description: string;
}

const DATA_FILE_PATH = path.resolve(dirname, '../data.json');
const VIDEO_FRAMES_DIR = path.resolve(dirname, '../video_frames');

const importMedia = async () => {
    try {
        // Dynamic import to ensure process.env is set BEFORE config matches
        const { default: config } = await import('../payload.config');
        const payload = await getPayload({ config });
        console.log('Payload initialized...');

        // Read data.json
        if (!fs.existsSync(DATA_FILE_PATH)) {
            console.error(`Data file not found at ${DATA_FILE_PATH}`);
            process.exit(1);
        }

        const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
        const videos: VideoData[] = JSON.parse(rawData);

        console.log(`Found ${videos.length} videos to process.`);

        // Find or Create Speaker
        const speakerName = "Dr. Hafidh Muhammad Abid Yusuf (Qari Adil)";
        let speakerId: string | null = null;

        const existingSpeaker = await payload.find({
            collection: 'imams',
            where: {
                name: {
                    equals: speakerName,
                },
            },
            limit: 1,
        });

        if (existingSpeaker.docs.length > 0) {
            speakerId = existingSpeaker.docs[0].id;
            console.log(`Found existing speaker: ${speakerName} (${speakerId})`);
        } else {
            console.log(`Speaker not found: ${speakerName}. Creating new...`);

            if (videos.length > 0) {
                const firstVideoFrame = path.basename(videos[0].image_local_path);
                const framePath = path.join(VIDEO_FRAMES_DIR, firstVideoFrame);

                if (fs.existsSync(framePath)) {
                    const fileBuffer = fs.readFileSync(framePath);
                    const uploadedImage = await payload.create({
                        collection: 'media',
                        data: {
                            alt: `Profile photo for ${speakerName}`,
                        },
                        file: {
                            data: fileBuffer,
                            name: `speaker-${firstVideoFrame}`,
                            mimetype: 'image/jpeg',
                            size: fileBuffer.length,
                        }
                    });

                    const newSpeaker = await payload.create({
                        collection: 'imams',
                        data: {
                            name: speakerName,
                            title: 'Imam & Qari',
                            image: uploadedImage.id,
                            biography: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', version: 1, text: 'Biography imported from video data.' }] }], direction: 'ltr', format: '', indent: 0, version: 1 } } as any,
                            order: 1,
                            isActive: true,
                        }
                    });
                    speakerId = newSpeaker.id;
                    console.log(`Created new speaker: ${speakerName} (${speakerId})`);
                }
            }
        }

        if (!speakerId) {
            console.error('Could not obtain a speaker ID. Aborting.');
            process.exit(1);
        }


        for (const video of videos) {
            console.log(`Processing: ${video.youtube_link}`);

            // Check if already exists
            const existingMedia = await payload.find({
                collection: 'media-items',
                where: {
                    'mediaContent.videoUrl': {
                        equals: video.youtube_link,
                    }
                }
            });

            if (existingMedia.docs.length > 0) {
                console.log(`Skipping existing video: ${video.youtube_link}`);
                continue;
            }

            // Prepare Fields
            let title = 'Untitled Video';
            let description = video.youtube_description || '';

            if (description) {
                const lines = description.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                if (lines.length > 0) {
                    const titleLine = lines.find(l => !l.toLowerCase().includes('assalaamu') && l.length < 100 && l.length > 5);
                    if (titleLine) {
                        title = titleLine;
                    } else {
                        title = lines[0].substring(0, 99);
                    }
                }
            } else {
                title = `Video ${video.youtube_link}`;
            }

            let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            if (baseSlug.length === 0) baseSlug = `video-${Date.now()}`;

            // 2. Thumbnail
            let thumbnailId = null;
            const frameFileName = path.basename(video.image_local_path);
            const localFramePath = path.join(VIDEO_FRAMES_DIR, frameFileName);

            if (fs.existsSync(localFramePath)) {
                // Check if we already uploaded this image?
                // For simplicity, verify upload by name
                const existingImage = await payload.find({
                    collection: 'media',
                    where: {
                        alt: { equals: `Thumbnail for ${title}` }
                    },
                    limit: 1
                });

                if (existingImage.docs.length > 0) {
                    thumbnailId = existingImage.docs[0].id;
                } else {
                    const fileBuffer = fs.readFileSync(localFramePath);
                    const uploadedThumb = await payload.create({
                        collection: 'media',
                        data: {
                            alt: `Thumbnail for ${title}`,
                        },
                        file: {
                            data: fileBuffer,
                            name: frameFileName,
                            mimetype: 'image/jpeg',
                            size: fileBuffer.length,
                        }
                    });
                    thumbnailId = uploadedThumb.id;
                    console.log(`Uploaded thumbnail: ${frameFileName}`);
                }
            } else {
                console.warn(`Thumbnail file not found: ${localFramePath}`);
                console.warn('Skipping video due to missing thumbnail.');
                continue;
            }

            // 3. Create Media Item
            try {
                await payload.create({
                    collection: 'media-items',
                    data: {
                        title: title,
                        slug: baseSlug + '-' + Math.floor(Math.random() * 1000),
                        description: description.substring(0, 199),
                        fullDescription: { root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', version: 1, text: description }] }], direction: 'ltr', format: '', indent: 0, version: 1 } } as any,
                        mediaType: 'video',
                        mediaContent: {
                            videoUrl: video.youtube_link,
                        },
                        thumbnail: thumbnailId,
                        category: 'lectures',
                        speaker: speakerId,
                        publishedDate: new Date().toISOString(),
                        isActive: true,
                    }
                });
                console.log(`Imported: ${title}`);
            } catch (err) {
                console.error(`Failed to import ${title}:`, err);
            }
        }

        console.log('Import process finished.');
        process.exit(0);

    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
};

importMedia();
