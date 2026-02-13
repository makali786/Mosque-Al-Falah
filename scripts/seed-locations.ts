import { config } from 'dotenv';
config();

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

async function seedLocations() {
    // @ts-ignore
    const payloadConfigNew = await payloadConfig;
    const payload = await getPayload({ config: payloadConfigNew });

    console.log('🌱 Seeding Locations...');

    // 1. Create London Central Mosque Location
    const lcmData = {
        name: 'London Central Mosque',
        fullAddress: '146 Park Rd, London NW8 7RG',
        coordinates: {
            latitude: 51.528938,
            longitude: -0.1650437,
        },
        googleMapsLink: 'https://www.google.com/maps/place/London+Central+Mosque/@51.6041892,-0.1691641,29353m/data=!3m1!1e3!4m10!1m2!2m1!1slondon+mosque!3m6!1s0x48761b2558395ef3:0x124e691956844ac2!8m2!3d51.528938!4d-0.1650437!15sCg1sb25kb24gbW9zcXVlWg8iDWxvbmRvbiBtb3NxdWWSAQZtb3NxdWWaASNDaFpEU1VoTk1HOW5TMFZKUTBGblNVTlhiRFJ5Y2s5M0VBReABAPoBBAgVEEI!16zL20vMDU3ODAz?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D',
    };

    let lcmId;
    const existingLcm = await payload.find({
        collection: 'locations',
        where: { name: { equals: lcmData.name } },
    });

    if (existingLcm.totalDocs > 0) {
        console.log('✅ London Central Mosque location already exists.');
        lcmId = existingLcm.docs[0].id;
    } else {
        const lcm = await payload.create({
            collection: 'locations',
            data: lcmData,
        });
        console.log('✅ Created London Central Mosque location.');
        lcmId = lcm.id;
    }

    // 2. Create Masjid Al Falah Location
    const mafData = {
        name: 'Masjid Al Falah',
        fullAddress: 'Masjid Al Falah, Ilford IG1 3EN',
        coordinates: {
            latitude: 51.5564, // Approx
            longitude: 0.0814, // Approx
        },
        googleMapsLink: 'https://maps.google.com/?q=Masjid+Al+Falah,+Ilford',
    };

    const existingMaf = await payload.find({
        collection: 'locations',
        where: { name: { equals: mafData.name } },
    });

    if (existingMaf.totalDocs > 0) {
        console.log('✅ Masjid Al Falah location already exists.');
    } else {
        await payload.create({
            collection: 'locations',
            data: mafData,
        });
        console.log('✅ Created Masjid Al Falah location.');
    }

    // 3. Test Event Creation with Autofill
    console.log('\n🧪 Testing Event Autofill...');

    // Create a dummy media first
    const media = await payload.find({ collection: 'media', limit: 1 });
    const mediaId = media.docs[0].id;

    const testEventData = {
        title: 'Location Test Event',
        slug: 'location-test-event-' + Date.now(),
        timing: {
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            timezone: 'Europe/London',
        },
        venue: {
            locationPreset: lcmId, // Select the preset
            // Intentionally NOT setting other venue fields to test autofill
        },
        description: {
            root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Test' }] }] }
        },
        media: { featuredImage: mediaId },
        isPublished: false,
    };

    try {
        const event = await payload.create({
            collection: 'events',
            // @ts-ignore
            data: testEventData,
        });

        console.log('✅ Event created.');
        console.log('--- Autofilled Venue Details ---');
        console.log('Name:', event.venue.name);
        console.log('Address:', event.venue.fullAddress);
        console.log('Coords:', event.venue.coordinates);

        if (event.venue.name === lcmData.name && event.venue.fullAddress === lcmData.fullAddress) {
            console.log('🎉 Autofill SUCCESS!');
        } else {
            console.error('❌ Autofill FAILED.');
        }

    } catch (e) {
        console.error('❌ Failed to create test event:', e);
    }

    process.exit(0);
}

seedLocations();
