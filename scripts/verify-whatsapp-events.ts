import { config } from 'dotenv';
config();

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

async function verifyWhatsappEvents() {
    // @ts-ignore
    const payloadConfigNew = await payloadConfig;
    const payload = await getPayload({ config: payloadConfigNew });

    console.log('🔍 Verifying WhatsApp events...');

    const slugs = ['make-your-work-ibadah-jan-2026', 'mindsavers-5-pillars-nov-2025'];

    for (const slug of slugs) {
        const events = await payload.find({
            collection: 'events',
            where: {
                slug: {
                    equals: slug,
                },
            },
        });

        if (events.totalDocs === 0) {
            console.error(`❌ Event not found: ${slug}`);
        } else {
            const event = events.docs[0];
            console.log(`✅ Event found: ${event.title}`);
            console.log(`📅 Date: ${event.timing.startDate} - ${event.timing.endDate}`);
            console.log(`📍 Venue: ${event.venue.name}`);
        }
    }

    process.exit(0);
}

verifyWhatsappEvents();
