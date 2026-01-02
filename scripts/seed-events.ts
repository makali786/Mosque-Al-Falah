// Script to seed events into the database
// Run with: npx tsx scripts/seed-events.ts

import { config } from 'dotenv';
config(); // Load .env file

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

async function seedEvents() {
  // @ts-ignore
  const payloadConfigNew = await payloadConfig;
  const payload = await getPayload({ config: payloadConfigNew });

  console.log('🌱 Seeding events...');

  // Get existing media items to use for event images
  // @ts-ignore
  const existingMedia = await payload.find({
    collection: 'media',
    limit: 5,
  });

  const imageId =
    existingMedia.docs.length > 0 ? existingMedia.docs[0].id : null;

  if (!imageId) {
    console.log(
      '❌ No media items found. Please upload at least one image first via the admin panel.'
    );
    process.exit(1);
  }

  console.log('📷 Using media item:', imageId);

  // Event 1: Friday Jummah
  // @ts-ignore
  const event1 = await payload.create({
    collection: 'events',
    data: {
      title: 'Weekly Jummah Prayer',
      slug: 'weekly-jummah-prayer',
      subtitle: 'Join us every Friday for congregational prayers',
      timing: {
        startDate: new Date('2025-01-03T12:30:00').toISOString(),
        endDate: new Date('2025-01-03T14:00:00').toISOString(),
        timezone: 'Europe/London',
      },
      platforms: [{ platform: 'in-person' }],
      venue: {
        name: 'Masjid Al-Falah Main Hall',
        fullAddress: '123 Islamic Centre Road, London, E1 1AA',
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
                  text: 'Join us every Friday for Jummah prayers. The khutbah begins at 1:00 PM followed by congregational prayer. All brothers and sisters are welcome.',
                },
              ],
            },
          ],
        },
      },
      shortDescription:
        'Join us every Friday for Jummah prayers. The khutbah begins at 1:00 PM.',
      media: {
        featuredImage: imageId,
      },
      category: 'jummah',
      isPublished: true,
      isFeatured: true,
    },
  });
  console.log('✅ Created event:', event1.title);

  // Event 2: Quran Study Circle
  // @ts-ignore
  const event2 = await payload.create({
    collection: 'events',
    data: {
      title: 'Quran Study Circle',
      slug: 'quran-study-circle-january',
      subtitle: 'Understanding the Quran together',
      timing: {
        startDate: new Date('2025-01-05T18:00:00').toISOString(),
        endDate: new Date('2025-01-05T20:00:00').toISOString(),
        timezone: 'Europe/London',
      },
      platforms: [{ platform: 'in-person' }, { platform: 'zoom' }],
      venue: {
        name: 'Masjid Al-Falah Learning Centre',
        fullAddress: '123 Islamic Centre Road, London, E1 1AA',
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
                  text: 'A weekly gathering to study and reflect on the meanings of the Quran. This week we will be covering Surah Al-Baqarah verses 1-20. Open to all levels of understanding.',
                },
              ],
            },
          ],
        },
      },
      shortDescription:
        'Weekly gathering to study and reflect on the meanings of the Quran.',
      media: {
        featuredImage: imageId,
      },
      category: 'educational',
      isPublished: true,
      isFeatured: false,
    },
  });
  console.log('✅ Created event:', event2.title);

  // Event 3: Community Iftar
  // @ts-ignore
  const event3 = await payload.create({
    collection: 'events',
    data: {
      title: 'Community Iftar Night',
      slug: 'community-iftar-ramadan-2025',
      subtitle: 'Breaking fast together as one Ummah',
      timing: {
        startDate: new Date('2025-03-01T17:30:00').toISOString(),
        endDate: new Date('2025-03-01T21:00:00').toISOString(),
        timezone: 'Europe/London',
      },
      platforms: [{ platform: 'in-person' }],
      venue: {
        name: 'Masjid Al-Falah Community Hall',
        fullAddress: '123 Islamic Centre Road, London, E1 1AA',
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
                  text: 'Join us for a blessed community iftar during the holy month of Ramadan. We will break our fast together, pray Maghrib and Isha, followed by Taraweeh prayers. Food and refreshments will be provided. Donations are welcome to support this initiative.',
                },
              ],
            },
          ],
        },
      },
      shortDescription:
        'Community iftar during Ramadan. Break fast together and pray.',
      media: {
        featuredImage: imageId,
      },
      category: 'ramadan',
      isPublished: true,
      isFeatured: true,
    },
  });
  console.log('✅ Created event:', event3.title);

  // Event 4: Islamic History Lecture
  // @ts-ignore
  const event4 = await payload.create({
    collection: 'events',
    data: {
      title: 'Life of Prophet Muhammad ﷺ',
      slug: 'seerah-lecture-series-january',
      subtitle: 'Lessons from the best of creation',
      timing: {
        startDate: new Date('2025-01-10T19:00:00').toISOString(),
        endDate: new Date('2025-01-10T21:00:00').toISOString(),
        timezone: 'Europe/London',
      },
      platforms: [{ platform: 'in-person' }, { platform: 'youtube-live' }],
      venue: {
        name: 'Masjid Al-Falah Main Hall',
        fullAddress: '123 Islamic Centre Road, London, E1 1AA',
      },
      speakers: [
        {
          speakerType: 'guest',
          guestSpeaker: {
            name: 'Sheikh Muhammad Al-Hassan',
            title: 'Islamic Scholar',
          },
        },
      ],
      description: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Join us for an enlightening lecture on the life of our beloved Prophet Muhammad ﷺ. This session covers the early years in Makkah and the challenges faced during the Meccan period. Perfect for all ages.',
                },
              ],
            },
          ],
        },
      },
      shortDescription:
        'Lecture on the life of Prophet Muhammad ﷺ. Perfect for all ages.',
      media: {
        featuredImage: imageId,
      },
      category: 'lecture',
      isPublished: true,
      isFeatured: true,
    },
  });
  console.log('✅ Created event:', event4.title);

  // Event 5: Youth Program
  // @ts-ignore
  const event5 = await payload.create({
    collection: 'events',
    data: {
      title: 'Youth Islamic Workshop',
      slug: 'youth-islamic-workshop-january',
      subtitle: 'Building the next generation of Muslim leaders',
      timing: {
        startDate: new Date('2025-01-12T14:00:00').toISOString(),
        endDate: new Date('2025-01-12T17:00:00').toISOString(),
        timezone: 'Europe/London',
      },
      platforms: [{ platform: 'in-person' }],
      venue: {
        name: 'Masjid Al-Falah Youth Centre',
        fullAddress: '123 Islamic Centre Road, London, E1 1AA',
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
                  text: 'An interactive workshop designed for young Muslims aged 13-18. Topics include: Islamic identity in modern society, building good habits, and maintaining faith during challenges. Games, discussions, and refreshments included!',
                },
              ],
            },
          ],
        },
      },
      shortDescription: 'Interactive workshop for young Muslims aged 13-18.',
      media: {
        featuredImage: imageId,
      },
      category: 'youth',
      isPublished: true,
      isFeatured: false,
    },
  });
  console.log('✅ Created event:', event5.title);

  console.log('🎉 Events seeded successfully!');
  process.exit(0);
}

seedEvents().catch(err => {
  console.error('❌ Error seeding events:', err);
  process.exit(1);
});
