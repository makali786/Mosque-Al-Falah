import { config } from 'dotenv';
config();

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

async function debugWhatsappEvent() {
    // @ts-ignore
    const payloadConfigNew = await payloadConfig;
    const payload = await getPayload({ config: payloadConfigNew });

    console.log('🐞 Debugging Specific WhatsApp Event...');

    // Find fallback media
    const anyMedia = await payload.find({ collection: 'media', limit: 1 });
    const mediaId = anyMedia.docs[0].id;
    console.log(`ℹ️ Using Media ID: ${mediaId}`);

    const event = {
        title: 'Life of the Best Human Being: Muhammad (PBUH)',
        subtitle: 'Weekly Lesson by Mawlana Farooq Suleman',
        slug: 'life-of-muhammad-pbuh-series',
        date: '2026-02-14',
        startTime: '18:00',
        endTime: '19:00',
        description: 'Weekly lesson on the Seerah of Prophet Muhammad (PBUH) delivered by Mawlana Farooq Suleman. Every Saturday after Maghrib Salah.',
        category: 'series',
    };

    const startDateTime = new Date(`${event.date}T${event.startTime}:00Z`);
    const endDateTime = new Date(`${event.date}T${event.endTime}:00Z`);

    const eventData = {
        title: event.title,
        slug: event.slug,
        subtitle: event.subtitle,
        timing: {
            startDate: startDateTime.toISOString(),
            endDate: endDateTime.toISOString(),
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
                            text: event.description,
                            type: 'text',
                            style: '',
                            detail: 0,
                            format: 0,
                            version: 1
                        }]
                    }
                ],
                direction: 'ltr',
            }
        },
        shortDescription: event.description,
        media: {
            featuredImage: mediaId,
        },
        category: event.category,
        isPublished: true,
        isFeatured: true,
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
        console.error(JSON.stringify(e, null, 2));
    }

    process.exit(0);
}

debugWhatsappEvent();
