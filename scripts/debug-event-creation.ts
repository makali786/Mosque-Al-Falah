import { config } from 'dotenv';
config();

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

async function debugEventCreation() {
    // @ts-ignore
    const payloadConfigNew = await payloadConfig;
    const payload = await getPayload({ config: payloadConfigNew });

    console.log('🐞 Debugging Event Creation...');

    // Find a media ID
    const anyMedia = await payload.find({ collection: 'media', limit: 1 });
    if (anyMedia.totalDocs === 0) {
        console.error('❌ No media found to test with.');
        process.exit(1);
    }
    const mediaId = anyMedia.docs[0].id;
    console.log(`ℹ️ Using Media ID: ${mediaId}`);

    const eventData = {
        title: 'DEBUG EVENT',
        slug: 'debug-event-1',
        subtitle: 'Debug subtitle',
        timing: {
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            timezone: 'Europe/London',
        },
        platforms: [{ platform: 'in-person' }],
        venue: {
            name: 'Masjid Al Falah',
            fullAddress: 'Masjid Al Falah, Ilford IG1 3EN',
        },
        description: {
            root: {
                type: 'root',
                format: '',
                indent: 0,
                version: 1,
                children: [
                    {
                        type: 'paragraph',
                        format: '',
                        indent: 0,
                        version: 1,
                        children: [{
                            mode: 'normal',
                            text: 'Debug description',
                            type: 'text',
                            style: '',
                            detail: 0,
                            format: 0,
                            version: 1,
                        }]
                    }
                ],
                direction: 'ltr', // Try adding direction
            }
        },
        shortDescription: 'Debug short description',
        media: {
            featuredImage: mediaId,
        },
        category: 'other',
        isPublished: true,
    };

    try {
        await payload.create({
            collection: 'events',
            // @ts-ignore
            data: eventData,
        });
        console.log('✅ Event created successfully!');
    } catch (e) {
        console.error('❌ Failed to create event.');
        // Print deep error
        console.error(JSON.stringify(e, null, 2));
    }

    process.exit(0);
}

debugEventCreation();
