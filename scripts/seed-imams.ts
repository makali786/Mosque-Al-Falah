// Script to seed imams into the database
// Run with: npx tsx scripts/seed-imams.ts

import { config } from 'dotenv';
config(); // Load .env file

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

async function seedImams() {
  // @ts-ignore
  const payloadConfigNew = await payloadConfig;
  const payload = await getPayload({ config: payloadConfigNew });

  console.log('🌱 Seeding imams...');

  // Get existing media items to use for imam photos
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

  // Imam 1: Head Imam
  // @ts-ignore
  const imam1 = await payload.create({
    collection: 'imams',
    data: {
      name: 'Sheikh Muhammad Abdullah',
      title: 'Head Imam & Khateeb',
      image: imageId,
      biography: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Sheikh Muhammad Abdullah has been serving as the Head Imam of Masjid Al-Falah for over 15 years. He is known for his eloquent khutbahs and deep understanding of Islamic jurisprudence. He completed his studies at Al-Azhar University in Cairo, Egypt.',
                },
              ],
            },
          ],
        },
      },
      education: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Bachelor of Islamic Studies - Al-Azhar University, Cairo. Masters in Islamic Jurisprudence - Islamic University of Madinah.',
                },
              ],
            },
          ],
        },
      },
      specializations: [
        { specialization: 'Fiqh (Islamic Jurisprudence)' },
        { specialization: 'Tafsir (Quranic Exegesis)' },
        { specialization: 'Hadith Sciences' },
      ],
      languages: [
        { language: 'Arabic' },
        { language: 'English' },
        { language: 'Urdu' },
      ],
      email: 'imam.muhammad@masjid-alfalah.org',
      askImamEnabled: true,
      order: 1,
      isActive: true,
    },
  });
  console.log('✅ Created imam:', imam1.name);

  // Imam 2: Qari
  // @ts-ignore
  const imam2 = await payload.create({
    collection: 'imams',
    data: {
      name: 'Qari Yusuf Ahmed',
      title: 'Imam & Qari',
      image: imageId,
      biography: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Qari Yusuf Ahmed is a Hafiz of the Quran and has mastered the ten styles of Quranic recitation. He leads Taraweeh prayers during Ramadan and conducts Quran classes for children and adults.',
                },
              ],
            },
          ],
        },
      },
      education: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Ijazah in Quranic recitation with Sanad. Diploma in Islamic Studies from Darul Uloom.',
                },
              ],
            },
          ],
        },
      },
      specializations: [
        { specialization: 'Quranic Recitation (Tajweed)' },
        { specialization: 'Hifz Program' },
        { specialization: 'Qirat (Ten Readings)' },
      ],
      languages: [
        { language: 'Arabic' },
        { language: 'English' },
        { language: 'Bengali' },
      ],
      email: 'qari.yusuf@masjid-alfalah.org',
      askImamEnabled: true,
      order: 2,
      isActive: true,
    },
  });
  console.log('✅ Created imam:', imam2.name);

  // Imam 3: Youth Imam
  // @ts-ignore
  const imam3 = await payload.create({
    collection: 'imams',
    data: {
      name: 'Sheikh Omar Hassan',
      title: 'Youth Imam & Counselor',
      image: imageId,
      biography: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Sheikh Omar Hassan specializes in youth engagement and Islamic counseling. He leads youth programs, runs weekly halaqas, and provides guidance to young Muslims navigating modern challenges while staying true to their faith.',
                },
              ],
            },
          ],
        },
      },
      education: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Bachelor of Arts in Islamic Studies - SOAS, London. Certified Islamic Counselor. Youth Leadership Training.',
                },
              ],
            },
          ],
        },
      },
      specializations: [
        { specialization: 'Youth Programs' },
        { specialization: 'Islamic Counseling' },
        { specialization: 'Contemporary Fiqh Issues' },
      ],
      languages: [{ language: 'English' }, { language: 'Arabic' }],
      email: 'sheikh.omar@masjid-alfalah.org',
      askImamEnabled: true,
      order: 3,
      isActive: true,
    },
  });
  console.log('✅ Created imam:', imam3.name);

  // Imam 4: Resident Scholar
  // @ts-ignore
  const imam4 = await payload.create({
    collection: 'imams',
    data: {
      name: 'Maulana Farooq Suleiman',
      title: 'Resident Scholar',
      image: imageId,
      biography: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Maulana Farooq Suleiman is our resident scholar with expertise in Islamic history and biography of the Prophet ﷺ (Seerah). He conducts weekly lectures on the lives of the Sahaba and Islamic civilization.',
                },
              ],
            },
          ],
        },
      },
      education: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Alimiyyah degree from Darul Uloom. PhD in Islamic History - University of Jordan.',
                },
              ],
            },
          ],
        },
      },
      specializations: [
        { specialization: 'Islamic History' },
        { specialization: 'Seerah (Prophetic Biography)' },
        { specialization: 'Lives of the Sahaba' },
      ],
      languages: [
        { language: 'Urdu' },
        { language: 'English' },
        { language: 'Arabic' },
      ],
      email: 'maulana.farooq@masjid-alfalah.org',
      askImamEnabled: true,
      order: 4,
      isActive: true,
    },
  });
  console.log('✅ Created imam:', imam4.name);

  console.log('🎉 Imams seeded successfully!');
  process.exit(0);
}

seedImams().catch(err => {
  console.error('❌ Error seeding imams:', err);
  process.exit(1);
});
