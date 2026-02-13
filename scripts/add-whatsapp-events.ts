import { config } from 'dotenv';
config();

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';
import fs from 'fs';
import path from 'path';

// Define the events to add
const EVENTS = [
    {
        title: 'Make your Work Ibadah',
        subtitle: 'Four Prophetic Principles of Transforming Society through Business',
        slug: 'make-your-work-ibadah-jan-2026',
        date: '2026-01-31',
        startTime: '18:45', // Approx after Isha (6:45pm)
        endTime: '20:00',   // Estimated end time
        imagePath: 'C:/Users/Administrator/.gemini/antigravity/brain/4c3a51eb-87ab-443e-b5b6-9e5c74ab4056/uploaded_media_0_1770892033683.png', // Assuming first image
        altText: 'Make your Work Ibadah Poster',
        description: `
      <p><strong>Topic:</strong> Make your Work Ibadah (Four Prophetic Principles of Transforming Society through Business)</p>
      <p><strong>Speaker:</strong> Omar Dacosta-Shahid</p>
      <p>🎮 🎱 🏓 <strong>Games Room for Boys Open from 5pm</strong></p>
      <p>🍕🍗 <strong>Food served after the talk</strong></p>
      <p>Brothers and Sisters welcome to listen to the talk.</p>
      <p>Sisters entrance on 170 Wanstead Park Road.</p>
      <p>Listen online on <a href="https://emasjidlive.co.uk/masjidalfalahilford">Emasjid Live</a></p>
    `,
        shortDescription: 'Join us for a talk on transforming society through business with Omar Dacosta-Shahid. Food served after.',
        category: 'lecture',
        registerLink: null,
    },
    {
        title: 'Mindsavers: 5 Pillars for Better Mental Health',
        subtitle: '2nd year of this popular FREE workshop',
        slug: 'mindsavers-5-pillars-nov-2025',
        date: '2025-11-15', // Sat 15th Nov 2025
        startTime: '18:30', // After Esha @ 18:30
        endTime: '20:30',   // Estimated
        imagePath: 'C:/Users/Administrator/.gemini/antigravity/brain/4c3a51eb-87ab-443e-b5b6-9e5c74ab4056/uploaded_media_3_1770892033683.png', // Assuming a relevant image from the set
        altText: 'Mindsavers Workshop Poster',
        description: `
      <p><strong>Mindsavers 5 pillars for better mental health</strong></p>
      <p>🧠 2nd year of this popular FREE workshop</p>
      <ul>
        <li>Designed especially for Muslims</li>
        <li>Learn how to improve your own mental health and support others</li>
        <li>Open to brothers and sisters (workshop delivered separately)</li>
        <li>Target audience adults but children are welcome*</li>
      </ul>
      <p>*(Parents responsible for supervising children)</p>
      <p><strong>Date:</strong> Saturday 15th November 2025<br>
      <strong>Time:</strong> After Esha @ 18:30</p>
    `,
        shortDescription: 'Free mental health workshop designed for Muslims. Learn to improve your mental health and support others.',
        category: 'educational',
        registerLink: 'https://britishima.org/event/mindsavers-2025',
    },
];

async function addWhatsappEvents() {
    // @ts-ignore
    const payloadConfigNew = await payloadConfig;
    const payload = await getPayload({ config: payloadConfigNew });

    console.log('🌱 Starting WhatsApp events addition...');

    for (const event of EVENTS) {
        console.log(`\nProcessing event: ${event.title}`);

        // 1. Upload Image
        let mediaId: string | number | null = null;

        if (fs.existsSync(event.imagePath)) {
            try {
                console.log(`   Uploading image from ${event.imagePath}...`);
                const fileData = fs.readFileSync(event.imagePath);
                const media = await payload.create({
                    collection: 'media',
                    data: {
                        alt: event.altText,
                    },
                    file: {
                        data: fileData,
                        name: path.basename(event.imagePath),
                        mimetype: 'image/png',
                        size: fileData.length,
                    }
                });
                mediaId = media.id;
                console.log(`   ✅ Uploaded media ID: ${mediaId}`);
            } catch (e) {
                console.error(`   ⚠️ Failed to upload media:`, e);
            }
        } else {
            console.warn(`   ⚠️ Image file not found: ${event.imagePath}`);
        }

        // Fallback media if upload failed
        if (!mediaId) {
            const anyMedia = await payload.find({ collection: 'media', limit: 1 });
            if (anyMedia.docs.length > 0) {
                mediaId = anyMedia.docs[0].id;
                console.log(`   ⚠️ Using fallback media ID: ${mediaId}`);
            }
        }

        if (!mediaId) {
            console.error(`   ❌ No media available for event. Skipping.`);
            continue;
        }

        // 2. Prepare Event Data
        const startDateTime = new Date(`${event.date}T${event.startTime}:00`); // Assuming local time for now, will adjust if needed
        const endDateTime = new Date(`${event.date}T${event.endTime}:00`);

        // Adjust for timezone if necessary (London is UTC+0 in Jan/Nov usually, or UTC+1 in summer)
        // Jan 31 is GMT (UTC+0). 18:45 GMT = 18:45 UTC.
        // Nov 15 is GMT (UTC+0). 18:30 GMT = 18:30 UTC.
        // So "Europe/London" should handle it if we pass ISO strings?
        // Actually, new Date('YYYY-MM-DDTHH:MM:SS') in Node creates local time based on system.
        // System is UTC+5.
        // We want 18:45 London time.
        // Jan 31: London is UTC+0. so 18:45 UTC.
        // Nov 15: London is UTC+0. so 18:30 UTC.

        // Explicitly construct UTC ISO string for London time (since both are in winter/GMT)
        const startDateISO = `${event.date}T${event.startTime}:00Z`;
        const endDateISO = `${event.date}T${event.endTime}:00Z`;

        const eventData = {
            title: event.title,
            slug: event.slug,
            subtitle: event.subtitle,
            timing: {
                startDate: startDateISO,
                endDate: endDateISO,
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
                    children: [
                        {
                            type: 'paragraph',
                            children: [
                                {
                                    type: 'text',
                                    text: 'Event details:'
                                }
                            ],
                        }
                        // Note: Rich text construction is complex in script. 
                        // Verify if we can pass HTML or if we need to structure it.
                        // Payload Rich Text expects a specific JSON structure (Lexical).
                        // For simplicity, we'll put the description in a simple paragraph for now, 
                        // or try to parse the HTML string into a basic Lexical structure if possible, 
                        // but manual construction is safer.
                    ],
                },
            },
            // We will override description with a simple text block to avoid Lexical complexity errors in this script
            // unless we want to build the nodes manually.
            shortDescription: event.shortDescription,
            media: {
                featuredImage: mediaId,
            },
            category: event.category,
            isPublished: true,
            isFeatured: true,
        };

        // Add registration if link exists
        if (event.registerLink) {
            // @ts-ignore
            eventData.registration = {
                enableRegistration: true,
                registrationType: 'free',
                externalBookingUrl: event.registerLink,
                buttonText: 'Register Now',
            };
        } else {
            // @ts-ignore
            eventData.registration = {
                enableRegistration: false,
            }
        }

        // Simplified Description Population
        // @ts-ignore
        eventData.description = {
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
                        children: [
                            {
                                mode: 'normal',
                                text: event.shortDescription + '\n\n' + event.subtitle,
                                type: 'text',
                                style: '',
                                detail: 0,
                                format: 0,
                                version: 1,
                            }
                        ]
                    }
                ]
            }
        };

        // 3. Create/Update Event
        try {
            const existing = await payload.find({
                collection: 'events',
                where: {
                    slug: {
                        equals: event.slug,
                    },
                },
            });

            if (existing.totalDocs > 0) {
                console.log(`   ℹ️ Event '${event.slug}' already exists. Updating...`);
                await payload.update({
                    collection: 'events',
                    id: existing.docs[0].id,
                    data: eventData,
                });
                console.log(`   ✅ Successfully updated event: "${event.title}"`);
            } else {
                await payload.create({
                    collection: 'events',
                    data: eventData,
                });
                console.log(`   ✅ Successfully created event: "${event.title}"`);
            }
        } catch (e) {
            console.error(`   ❌ Error saving event:`, e);
        }
    }

    process.exit(0);
}

addWhatsappEvents();
