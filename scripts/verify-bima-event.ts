import { config } from 'dotenv';
config();

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

async function verifyBimaEvent() {
    // @ts-ignore
    const payloadConfigNew = await payloadConfig;
    const payload = await getPayload({ config: payloadConfigNew });

    console.log('🔍 Verifying BIMA event...');

    const events = await payload.find({
        collection: 'events',
        where: {
            slug: {
                equals: 'bima-lifesavers-bls-2025',
            },
        },
    });

    if (events.totalDocs === 0) {
        console.error('❌ Event not found!');
        process.exit(1);
    }

    const event = events.docs[0];
    console.log(`✅ Event found: ${event.title}`);
    console.log(`📅 Date: ${event.timing.startDate} - ${event.timing.endDate}`);
    console.log(`📍 Venue: ${event.venue.name}`);
    console.log(`🖼️ Media ID: ${event.media.featuredImage}`);

    process.exit(0);
}

verifyBimaEvent();
