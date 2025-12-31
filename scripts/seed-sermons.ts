// Script to seed sermons into the database
// Run with: npx tsx scripts/seed-sermons.ts

import { config } from 'dotenv';
config(); // Load .env file

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

async function seedSermons() {
  // @ts-ignore
  const payloadConfigNew = await payloadConfig;
  const payload = await getPayload({ config: payloadConfigNew });

  console.log('🌱 Seeding sermons...');

  // Get existing media items for thumbnails
  // @ts-ignore
  const existingMedia = await payload.find({
    collection: 'media',
    limit: 5,
  });

  // Get existing imams to link as speakers
  // @ts-ignore
  const existingImams = await payload.find({
    collection: 'imams',
    limit: 5,
  });

  const imageId =
    existingMedia.docs.length > 0 ? existingMedia.docs[0].id : null;
  const imamId1 =
    existingImams.docs.length > 0 ? existingImams.docs[0].id : null;
  const imamId2 =
    existingImams.docs.length > 1 ? existingImams.docs[1].id : imamId1;
  const imamId3 =
    existingImams.docs.length > 2 ? existingImams.docs[2].id : imamId1;

  if (!imageId) {
    console.log(
      '❌ No media items found. Please upload at least one image first.'
    );
    process.exit(1);
  }

  console.log('📷 Using media item:', imageId);
  console.log('👤 Using imams:', imamId1, imamId2, imamId3);

  // Sermon 1: The Quran is the Words of Allah
  // @ts-ignore
  const sermon1 = await payload.create({
    collection: 'sermons',
    data: {
      title: 'The Quran is the Words of Allah',
      speaker: imamId1,
      sermonDate: new Date('2024-02-14T13:00:00').toISOString(),
      image: imageId,
      description:
        'A powerful reminder about the divine nature of the Holy Quran and its importance in our daily lives.',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'The Quran is not just a book; it is the direct speech of Allah to humanity. In this khutbah, we explore the miraculous nature of the Quran, its preservation throughout history, and how we should approach this blessed book with reverence and contemplation. The Prophet ﷺ said: "The best of you are those who learn the Quran and teach it."',
                },
              ],
            },
          ],
        },
      },
      videoUrl: 'https://www.youtube.com/watch?v=example1',
      category: 'jummah',
      tags: [{ tag: 'Quran' }, { tag: 'Faith' }, { tag: 'Guidance' }],
      language: 'english',
      duration: '35 minutes',
      isFeatured: true,
      isPublished: true,
    },
  });
  console.log('✅ Created sermon:', sermon1.title);

  // Sermon 2: Respecting the Sacred Month of Rajab
  // @ts-ignore
  const sermon2 = await payload.create({
    collection: 'sermons',
    data: {
      title: 'Respecting the Sacred Month of Rajab (English)',
      speaker: imamId2,
      sermonDate: new Date('2024-02-14T13:00:00').toISOString(),
      image: imageId,
      description:
        'Understanding the significance of the sacred months in Islam and how to make the most of Rajab.',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: "Rajab is one of the four sacred months in the Islamic calendar. During this blessed time, we should increase our worship, refrain from sins, and prepare our hearts for the upcoming months of Sha'ban and Ramadan. This sermon explores the virtues of Rajab and practical ways to benefit from this special month.",
                },
              ],
            },
          ],
        },
      },
      videoUrl: 'https://www.youtube.com/watch?v=example2',
      category: 'jummah',
      tags: [{ tag: 'Rajab' }, { tag: 'Sacred Months' }, { tag: 'Worship' }],
      language: 'english',
      duration: '40 minutes',
      isFeatured: true,
      isPublished: true,
    },
  });
  console.log('✅ Created sermon:', sermon2.title);

  // Sermon 3: Importance of Salah
  // @ts-ignore
  const sermon3 = await payload.create({
    collection: 'sermons',
    data: {
      title: "The Importance of Salah in a Muslim's Life",
      speaker: imamId1,
      sermonDate: new Date('2024-02-07T13:00:00').toISOString(),
      image: imageId,
      description:
        'Salah is the pillar of the religion. Learn about its significance and how to perfect your prayers.',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'The Prophet ﷺ said: "The first matter that the slave will be brought to account for on the Day of Judgment is the prayer." Salah is our direct connection to Allah, the coolness of our eyes, and the distinction between belief and disbelief. In this sermon, we discuss the importance of establishing regular prayers and perfecting our khushu (concentration).',
                },
              ],
            },
          ],
        },
      },
      videoUrl: 'https://www.youtube.com/watch?v=example3',
      audioUrl: 'https://audio.example.com/salah-khutbah.mp3',
      category: 'jummah',
      tags: [{ tag: 'Salah' }, { tag: 'Prayer' }, { tag: 'Pillars of Islam' }],
      language: 'english',
      duration: '32 minutes',
      isFeatured: false,
      isPublished: true,
    },
  });
  console.log('✅ Created sermon:', sermon3.title);

  // Sermon 4: Taraweeh Reflections
  // @ts-ignore
  const sermon4 = await payload.create({
    collection: 'sermons',
    data: {
      title: 'Taraweeh Reflections: Surah Al-Baqarah',
      speaker: imamId3,
      sermonDate: new Date('2024-03-15T21:00:00').toISOString(),
      image: imageId,
      description:
        'Reflections from the Taraweeh prayers covering the themes and lessons from Surah Al-Baqarah.',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'The time for the Taraweeh prayer begins after the Isha prayer has concluded, as noted by al-Baghawi and others, and continues until dawn. However, if a person is leading the prayer in the mosque, performing Taraweeh right after the Isha prayer is preferable instead of postponing it to the middle or end of the night. This approach helps avoid causing difficulties for the worshippers, as some may fall asleep and miss the prayer.',
                },
              ],
            },
          ],
        },
      },
      videoUrl: 'https://www.youtube.com/watch?v=example4',
      category: 'taraweeh',
      tags: [
        { tag: 'Taraweeh' },
        { tag: 'Ramadan' },
        { tag: 'Surah Al-Baqarah' },
      ],
      language: 'arabic',
      duration: '1 hour 15 minutes',
      isFeatured: true,
      isPublished: true,
    },
  });
  console.log('✅ Created sermon:', sermon4.title);

  // Sermon 5: Eid Khutbah
  // @ts-ignore
  const sermon5 = await payload.create({
    collection: 'sermons',
    data: {
      title: 'Eid Al-Fitr: A Time of Gratitude and Unity',
      speaker: imamId1,
      sermonDate: new Date('2024-04-10T08:00:00').toISOString(),
      image: imageId,
      description:
        'Eid khutbah focusing on gratitude for completing Ramadan and the importance of community.',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Allahu Akbar, Allahu Akbar, La ilaha illallah, Allahu Akbar, Allahu Akbar, wa lillahil hamd! Today we celebrate the completion of Ramadan and thank Allah for giving us the strength to fast and worship. Let us continue the good habits we developed during Ramadan and strengthen the bonds of brotherhood and sisterhood in our community.',
                },
              ],
            },
          ],
        },
      },
      videoUrl: 'https://www.youtube.com/watch?v=example5',
      category: 'eid',
      tags: [{ tag: 'Eid' }, { tag: 'Celebration' }, { tag: 'Gratitude' }],
      language: 'mixed',
      duration: '25 minutes',
      isFeatured: true,
      isPublished: true,
    },
  });
  console.log('✅ Created sermon:', sermon5.title);

  // Sermon 6: Islamic Lecture
  // @ts-ignore
  const sermon6 = await payload.create({
    collection: 'sermons',
    data: {
      title: 'The Life of Prophet Ibrahim (AS)',
      guestSpeaker: {
        name: 'Dr. Bilal Philips',
        title: 'Islamic Scholar',
      },
      sermonDate: new Date('2024-01-20T19:00:00').toISOString(),
      image: imageId,
      description:
        'An inspiring lecture about the life and trials of Prophet Ibrahim, the father of the prophets.',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Prophet Ibrahim (AS) is known as Khalilullah - the friend of Allah. His unwavering faith, his willingness to sacrifice everything for Allah, and his patient perseverance through trials make him one of the greatest prophets. In this lecture, we explore his story and derive lessons for our own lives.',
                },
              ],
            },
          ],
        },
      },
      videoUrl: 'https://www.youtube.com/watch?v=example6',
      category: 'lecture',
      tags: [{ tag: 'Prophets' }, { tag: 'Ibrahim' }, { tag: 'Seerah' }],
      language: 'english',
      duration: '1 hour 30 minutes',
      isFeatured: false,
      isPublished: true,
    },
  });
  console.log('✅ Created sermon:', sermon6.title);

  console.log('🎉 Sermons seeded successfully!');
  process.exit(0);
}

seedSermons().catch(err => {
  console.error('❌ Error seeding sermons:', err);
  process.exit(1);
});
