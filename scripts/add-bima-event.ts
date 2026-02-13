import { config } from 'dotenv';
config();

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';
import fs from 'fs';
import path from 'path';

async function addBimaEvent() {
    // @ts-ignore
    const payloadConfigNew = await payloadConfig;
    const payload = await getPayload({ config: payloadConfigNew });

    console.log('🌱 Starting BIMA event addition...');

    // 1. Find or Upload the Image
    // We'll try to find an existing image first, or upload logo-2.png if possible
    // Since we can't easily upload from a script without a File object in some environments (though Payload local API supports file paths),
    // we will try to find a suitable image. 'logo-2.png' in public/assets/common is a good candidate.

    let mediaId: string | number | null = null;

    // Check for existing media
    const existingMedia = await payload.find({
        collection: 'media',
        where: {
            alt: {
                contains: 'logo',
            },
        },
        limit: 1,
    });

    if (existingMedia.docs.length > 0) {
        mediaId = existingMedia.docs[0].id;
        console.log(`✅ Found existing media: ${mediaId}`);
    } else {
        // If not found, try to upload one (assuming we are running locally and can access the file)
        const filePath = path.resolve(process.cwd(), 'public/assets/common/logo-2.png');
        if (fs.existsSync(filePath)) {
            try {
                const fileData = fs.readFileSync(filePath);
                const media = await payload.create({
                    collection: 'media',
                    data: {
                        alt: 'Masjid Al Falah Logo',
                    },
                    file: {
                        data: fileData,
                        name: 'logo-2.png',
                        mimetype: 'image/png',
                        size: fileData.length,
                    }
                });
                mediaId = media.id;
                console.log(`✅ Uploaded new media: ${mediaId}`);
            } catch (e) {
                console.error('⚠️ Failed to upload media:', e);
            }
        } else {
            console.warn('⚠️ Could not find public/assets/common/logo-2.png');
        }
    }

    // Fallback to ANY media if specific one fails
    if (!mediaId) {
        const anyMedia = await payload.find({ collection: 'media', limit: 1 });
        if (anyMedia.docs.length > 0) {
            mediaId = anyMedia.docs[0].id;
            console.log(`⚠️ using fallback media: ${mediaId}`);
        }
    }

    if (!mediaId) {
        console.error('❌ Could not find or create any media for the event image. Aborting.');
        process.exit(1);
    }

    // 2. Prepare Event Data
    // Date: Saturday, September 27th 2025.
    // Time: 14:00 - 15:30 London Time.
    // In September, London is in BST (UTC+1).
    // 14:00 BST = 13:00 UTC.
    // 15:30 BST = 14:30 UTC.

    const startDateTime = new Date('2025-09-27T13:00:00Z');
    const endDateTime = new Date('2025-09-27T14:30:00Z');

    const eventData = {
        title: 'BIMA Lifesavers: Basic Life Support Course',
        slug: 'bima-lifesavers-bls-2025', // Using specific slug to avoid collision
        subtitle: 'Learn CPR and essential life-saving skills',
        timing: {
            startDate: startDateTime.toISOString(),
            endDate: endDateTime.toISOString(),
            timezone: 'Europe/London',
        }, platforms: [{ platform: 'in-person' }],
        venue: {
            name: 'Masjid Al Falah',
            fullAddress: 'Masjid Al Falah, Ilford IG1 3EN\nSisters Entrance: 170 Wanstead Park Road\nBrothers Entrance: 97 Kensington Gardens',
        },
        description: {
            root: {
                type: 'root',
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'We are excited to announce our involvement in this year\'s global BIMA Lifesavers initiative for the 4th time, marking our continued commitment to this important event.',
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'This provides a valuable opportunity for individuals to enroll in a Basic Life Support course at no cost. Participants can acquire essential skills that include:',
                            },
                        ],
                    },
                    {
                        type: 'list',
                        listType: 'number',
                        children: [
                            {
                                type: 'listitem',
                                children: [
                                    {
                                        type: 'text',
                                        text: 'Cardiopulmonary Resuscitation (CPR)',
                                    },
                                ],
                            },
                            {
                                type: 'listitem',
                                children: [
                                    {
                                        type: 'text',
                                        text: 'Proper positioning for recovery',
                                    },
                                ],
                            },
                            {
                                type: 'listitem',
                                children: [
                                    {
                                        type: 'text',
                                        text: 'Effective techniques for managing choking incidents',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                text: 'Registration is not essential but would be very helpful to ensure sufficient capacity. Please use the form below.',
                            },
                        ],
                    },
                ],
            },
        },
        shortDescription: 'Free Basic Life Support course covering CPR, recovery position, and choking management.',
        media: {
            featuredImage: mediaId,
        },
        registration: {
            enableRegistration: true,
            registrationType: 'free',
            externalBookingUrl: 'https://forms.gle/v1aBtEKwo5A93n8z8',
            buttonText: 'Register Now',
        },
        category: 'community',
        isPublished: true,
        isFeatured: true,
    };

    // 3. Create Event
    try {
        // Check if slug exists to update instead of fail (optional, but good practice for scripts)
        const existing = await payload.find({
            collection: 'events',
            where: {
                slug: {
                    equals: eventData.slug,
                },
            },
        });

        if (existing.totalDocs > 0) {
            console.log(`ℹ️ Event with slug '${eventData.slug}' already exists. Updating...`);
            const updated = await payload.update({
                collection: 'events',
                id: existing.docs[0].id,
                data: eventData,
            });
            console.log(`✅ Successfully updated event: "${updated.title}"`);
        } else {
            const created = await payload.create({
                collection: 'events',
                data: eventData,
            });
            console.log(`✅ Successfully created event: "${created.title}"`);
        }

    } catch (error) {
        console.error('❌ Error creating/updating event:', error);
        process.exit(1);
    }

    process.exit(0);
}

addBimaEvent();
