import { config } from 'dotenv';
config();

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';
import fs from 'fs';
import path from 'path';

const SOURCE_DIR = 'C:\\Users\\Administrator\\Downloads\\WhatsApp Unknown 2026-02-12 at 3.28.03 PM';

const NOTICES = [
    {
        filename: 'WhatsApp Image 2026-02-11 at 12.15.51 AM (1).jpeg',
        title: 'Etiquettes of the Masjid',
        date: '2026-02-12', // Today's date
        category: 'announcement',
        content: `
      <p><strong>Etiquettes of the Masjid</strong></p>
      <ul>
        <li>Try to walk to the Masjid</li>
        <li>Park mindfully and do not block someone's driveway</li>
        <li>Switch off or mute your mobile phone</li>
        <li>Keep silent in the prayer hall and exit quietly</li>
        <li>Stand shoulder to shoulder with no gaps</li>
        <li>Do not expose your lower back</li>
        <li>Applying perfume and removing bad odors</li>
        <li>Nobody should reserve a place in the masjid</li>
      </ul>
    `,
        isPinned: true,
    },
    {
        filename: 'WhatsApp Image 2026-02-11 at 12.15.51 AM (2).jpeg',
        title: 'Jumu\'ah Collection - 6th February 2026',
        date: '2026-02-06',
        category: 'news',
        content: `
      <p><strong>Jumu'ah Collection Update</strong></p>
      <p><strong>Lillah:</strong> £1,348</p>
      <p><strong>Sadaqah:</strong> £210</p>
      <p><strong>Total:</strong> £1,558</p>
      <p>Jazak Allah Khair for your generous donation.</p>
    `,
        isPinned: false,
    },
    {
        filename: 'WhatsApp Image 2026-02-11 at 12.15.51 AM.jpeg',
        title: 'No More Clothes Donation',
        date: '2026-02-12',
        category: 'announcement',
        content: `
      <p><strong>Important Notice</strong></p>
      <p>Masjid Al Falah will <strong>no longer accept clothing bags</strong> due to the limited available space.</p>
      <p>You can drop off your clothes for Sadaqah at the nearest clothing bank:</p>
      <p><strong>Ummah Welfare Trust</strong><br>
      477-479 Romford Road, London, E7 8AD<br>
      Opening Hours: Mon-Sat 11am-7pm, Sun 12pm-5pm</p>
    `,
        isPinned: true,
    },
    {
        filename: 'WhatsApp Image 2026-02-11 at 12.15.53 AM.jpeg',
        title: 'Important Parking Update',
        date: '2026-02-12',
        category: 'announcement',
        content: `
      <p><strong>Golf Club Car Park - Pay & Display Registration for Jumu'ah Salah Only</strong></p>
      <ol>
        <li><strong>Free Parking:</strong> You must register your vehicle at the Golf Club reception upon arrival to benefit from free parking.</li>
        <li><strong>Register Your Vehicle:</strong> 2 hours of free parking for registered commuters when attending Jumu'ah Salah ONLY.</li>
      </ol>
      <p><em>Failure to comply may lead to a parking ticket. Please park within marked bays.</em></p>
    `,
        isPinned: true,
    },
];

const EVENTS = [
    {
        filename: 'WhatsApp Image 2026-02-11 at 12.15.52 AM (1).jpeg',
        title: 'Life of the Best Human Being: Muhammad (PBUH)',
        subtitle: 'Weekly Lesson by Mawlana Farooq Suleman',
        slug: 'life-of-muhammad-pbuh-series',
        date: '2026-02-14', // Next Saturday
        startTime: '18:00', // Approx Maghrib time in Feb
        endTime: '19:00',
        description: 'Weekly lesson on the Seerah of Prophet Muhammad (PBUH) delivered by Mawlana Farooq Suleman. Every Saturday after Maghrib Salah.',
        category: 'lecture',
    },
    {
        filename: 'WhatsApp Image 2026-02-11 at 12.15.52 AM (2).jpeg',
        title: 'Tafsir of Surah Al-Furqan',
        subtitle: 'Weekly Lesson by Mawlana Huzayfah Mangera',
        slug: 'tafsir-surah-al-furqan-series',
        date: '2026-02-12', // Today (Thursday)
        startTime: '20:00', // Approx Esha time
        endTime: '21:00',
        description: 'Weekly Tafsir session covering Surah Al-Furqan delivered by Mawlana Huzayfah Mangera. Every Thursday after Esha Salah.',
        category: 'educational',
    },
    {
        filename: 'WhatsApp Image 2026-02-11 at 12.15.52 AM.jpeg',
        title: 'Explanation of Riyaadus Saliheen',
        subtitle: 'Weekly Lesson by Mawlana Hamza Adam',
        slug: 'explanation-riyaadus-saliheen-series',
        date: '2026-02-17', // Next Tuesday
        startTime: '19:30', // Winter Esha
        endTime: '20:30',
        description: 'Weekly explanation of Riyaadus Saliheen by Mawlana Hamza Adam. Every Tuesday (Summer after Asr, Winter after Esha).',
        category: 'educational',
    },
];

async function addWhatsappContent() {
    // @ts-ignore
    const payloadConfigNew = await payloadConfig;
    const payload = await getPayload({ config: payloadConfigNew });

    console.log('🌱 Adding content from WhatsApp images...');

    // --- Process Notices ---
    console.log('\n--- Adding Notices ---');
    for (const notice of NOTICES) {
        const filePath = path.join(SOURCE_DIR, notice.filename);
        console.log(`Processing: ${notice.title}`);

        let mediaId = null;
        if (fs.existsSync(filePath)) {
            try {
                const fileData = fs.readFileSync(filePath);
                const media = await payload.create({
                    collection: 'media',
                    data: { alt: notice.title },
                    file: {
                        data: fileData,
                        name: notice.filename,
                        mimetype: 'image/jpeg',
                        size: fileData.length,
                    }
                });
                mediaId = media.id;
                console.log(`   ✅ Media Uploaded: ${mediaId}`);
            } catch (e) {
                console.error(`   ⚠️ Media upload failed (likely auth, skipping media only):`, e);
                // Do NOT continue, preserve execution flow
            }
        } else {
            console.warn(`   ⚠️ File not found: ${filePath}`);
        }

        // Create Notice
        try {
            await payload.create({
                collection: 'notices',
                data: {
                    title: notice.title,
                    noticeDate: new Date(notice.date).toISOString(),
                    category: notice.category,
                    // @ts-ignore
                    content: {
                        root: {
                            type: 'root', // IMPORTANT: Lexical structure
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
                                        text: 'See the poster for details. Content extracted from image.',
                                        type: 'text',
                                        style: '',
                                        detail: 0,
                                        format: 0,
                                        version: 1
                                    }]
                                }
                            ]
                        }
                    },
                    isPublished: true,
                    isPinned: notice.isPinned,
                }
            });
            console.log(`   ✅ Notice Created: "${notice.title}"`);
        } catch (e) {
            console.error(`   ❌ Failed to create notice:`, e);
        }
    }

    // --- Process Events ---
    console.log('\n--- Adding Events ---');
    for (const event of EVENTS) {
        const filePath = path.join(SOURCE_DIR, event.filename);
        console.log(`Processing: ${event.title}`);

        let mediaId = null;
        if (fs.existsSync(filePath)) {
            try {
                const fileData = fs.readFileSync(filePath);
                const media = await payload.create({
                    collection: 'media',
                    data: { alt: event.title },
                    file: {
                        data: fileData,
                        name: event.filename,
                        mimetype: 'image/jpeg',
                        size: fileData.length,
                    }
                });
                mediaId = media.id;
                console.log(`   ✅ Media Uploaded: ${mediaId}`);
            } catch (e) {
                console.error(`   ⚠️ Media upload failed (likely auth):`, e);
                // Fallback logic below
            }
        } else {
            console.warn(`   ⚠️ File not found: ${filePath}`);
        }

        // Fallback for Events which require image
        if (!mediaId) {
            console.log('   ⚠️ No media uploaded, trying to find fallback...');
            const anyMedia = await payload.find({ collection: 'media', limit: 1 });
            if (anyMedia.docs.length > 0) {
                mediaId = anyMedia.docs[0].id;
                console.log(`   ⚠️ Using fallback media ID: ${mediaId}`);
            } else {
                console.error('   ❌ No media available for event. Skipping.');
                continue; // Cannot proceed without media for events
            }
        }

        // Create Event
        const startDateTime = new Date(`${event.date}T${event.startTime}:00Z`);
        const endDateTime = new Date(`${event.date}T${event.endTime}:00Z`);

        try {
            // Check if exists
            const existing = await payload.find({
                collection: 'events',
                where: { slug: { equals: event.slug } }
            });

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
                // @ts-ignore
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
                        ]
                    }
                },
                shortDescription: event.description,
                media: {
                    featuredImage: mediaId,
                },
                category: event.category,
                isPublished: true,
                isFeatured: true, // Make these featured as they are important series
            };

            if (existing.totalDocs > 0) {
                await payload.update({
                    collection: 'events',
                    id: existing.docs[0].id,
                    data: eventData
                });
                console.log(`   ✅ Event Updated: "${event.title}"`);
            } else {
                await payload.create({
                    collection: 'events',
                    data: eventData
                });
                console.log(`   ✅ Event Created: "${event.title}"`);
            }

        } catch (e) {
            console.error(`   ❌ Failed to create event:`, e);
            console.error(e); // Added full error log
        }
    }

    process.exit(0);
}

addWhatsappContent();
