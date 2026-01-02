// Script to seed services into the database
// Run with: npx tsx scripts/seed-services.ts

import { config } from 'dotenv';
config(); // Load .env file

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

async function seedServices() {
  // @ts-ignore
  const payloadConfigNew = await payloadConfig;
  const payload = await getPayload({ config: payloadConfigNew });

  console.log('🌱 Seeding services...');

  // Get existing media items for images
  // @ts-ignore
  const existingMedia = await payload.find({
    collection: 'media',
    limit: 5,
  });

  const imageId =
    existingMedia.docs.length > 0 ? existingMedia.docs[0].id : null;

  if (!imageId) {
    console.log(
      '❌ No media items found. Please upload at least one image first.'
    );
    process.exit(1);
  }

  console.log('📷 Using media item:', imageId);

  // Check if services already exist
  // @ts-ignore
  const existingServices = await payload.find({
    collection: 'services',
    limit: 1,
  });

  if (existingServices.docs.length > 0) {
    console.log(
      '⚠️ Services already exist. Skipping seeding to avoid duplicates.'
    );
    console.log(
      '   To re-seed, first delete existing services from the admin panel.'
    );
    process.exit(0);
  }

  // Service 1: Five Daily Prayers
  // @ts-ignore
  const service1 = await payload.create({
    collection: 'services',
    data: {
      title: 'Five Daily Prayers',
      slug: 'five-daily-prayers',
      serviceType: 'daily-prayers',
      shortDescription:
        'Join us for the five daily congregational prayers at Masjid Al-Falah.',
      fullDescription: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: "The five daily prayers are the cornerstone of a Muslim's day. At Masjid Al-Falah, we hold congregational prayers at their prescribed times, providing a spiritual sanctuary for the community. Our beautiful prayer hall can accommodate over 500 worshippers, and we ensure a peaceful environment for reflection and devotion.",
                },
              ],
            },
          ],
        },
      },
      media: {
        cardImage: imageId,
        heroImage: imageId,
      },
      schedule: {
        hasSchedule: true,
        scheduleType: 'daily',
        scheduleText: 'Regular congregational prayers held five times daily',
        regularTimes: [
          { label: 'Fajr', time: '05:30', description: 'Main Hall' },
          { label: 'Dhuhr', time: '13:00', description: 'Main Hall' },
          { label: 'Asr', time: '16:00', description: 'Main Hall' },
          { label: 'Maghrib', time: '18:15', description: 'Main Hall' },
          { label: 'Isha', time: '20:00', description: 'Main Hall' },
        ],
      },
      venue: {
        hasVenue: true,
        venueName: 'Masjid Al-Falah Main Hall',
        fullAddress: '123 Islamic Centre Road, London, E1 1AA',
      },
      order: 1,
      isFeatured: true,
      isActive: true,
    },
  });
  console.log('✅ Created service:', service1.title);

  // Service 2: Friday Jummah
  // @ts-ignore
  const service2 = await payload.create({
    collection: 'services',
    data: {
      title: "Friday Jumu'ah Sermon",
      slug: 'friday-jummah-sermon',
      serviceType: 'jummah',
      shortDescription:
        'Weekly Friday congregational prayer with khutbah in English and Arabic.',
      fullDescription: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'The Friday Jummah prayer is an obligation upon every Muslim man. We hold two Jummah services to accommodate our large congregation. The khutbah is delivered in English with Quranic recitations in Arabic. Topics address current issues facing the Muslim community while staying rooted in authentic Islamic teachings.',
                },
              ],
            },
          ],
        },
      },
      media: {
        cardImage: imageId,
        heroImage: imageId,
      },
      schedule: {
        hasSchedule: true,
        scheduleType: 'weekly',
        scheduleText: 'Every Friday',
        regularTimes: [
          { label: '1ST JAMAAH', time: '12:30', description: 'Main Hall' },
          { label: '2ND JAMAAH', time: '13:30', description: 'Main Hall' },
        ],
      },
      venue: {
        hasVenue: true,
        venueName: 'Masjid Al-Falah Main Hall',
        fullAddress: '123 Islamic Centre Road, London, E1 1AA',
      },
      callToActions: [
        { text: 'View Khutbah Topics', url: '/sermons', style: 'primary' },
      ],
      order: 2,
      isFeatured: true,
      isActive: true,
    },
  });
  console.log('✅ Created service:', service2.title);

  // Service 3: Taraweeh & Eid Prayers
  // @ts-ignore

  // Service 4: Food Bank
  // @ts-ignore
  const service4 = await payload.create({
    collection: 'services',
    data: {
      title: 'Food Bank',
      slug: 'food-bank',
      serviceType: 'food-bank',
      shortDescription:
        'Supporting families in need with essential food supplies every week.',
      fullDescription: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Our Food Bank serves hundreds of families each week, providing essential groceries, fresh produce, and halal meat to those in need. Everyone is welcome regardless of faith or background. We rely on generous donations from our community to continue this vital service.',
                },
              ],
            },
          ],
        },
      },
      media: {
        cardImage: imageId,
        heroImage: imageId,
      },
      schedule: {
        hasSchedule: true,
        scheduleType: 'weekly',
        scheduleText: 'Every Saturday 10:00 AM - 2:00 PM',
      },
      registration: {
        enableRegistration: true,
        registrationButtonText: 'Register for Food Bank',
        contactEmail: 'foodbank@masjid-alfalah.org',
        contactPhone: '020 1234 5678',
      },
      donation: {
        enableDonations: true,
        donationTitle: 'Support Our Food Bank',
        donationDescription:
          'Your donations help us feed families in need. £10 can provide a week of groceries for a family.',
        suggestedAmounts: [
          { amount: 10 },
          { amount: 25 },
          { amount: 50 },
          { amount: 100 },
        ],
      },
      venue: {
        hasVenue: true,
        venueName: 'Masjid Al-Falah Community Hall',
        fullAddress: '123 Islamic Centre Road, London, E1 1AA',
      },
      order: 4,
      isFeatured: false,
      isActive: true,
    },
  });
  console.log('✅ Created service:', service4.title);

  // Service 5: Madrasah & Hifdh
  // @ts-ignore
  const service5 = await payload.create({
    collection: 'services',
    data: {
      title: 'Madrasah & Hifdh Class',
      slug: 'madrasah-hifdh-class',
      serviceType: 'madrasah',
      shortDescription:
        'Islamic education for children including Quran memorization and Islamic studies.',
      fullDescription: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Our Madrasah welcomes children from ages 5 and above, with tailored classes for different age groups. Students learn Quran recitation with proper Tajweed, Islamic studies, Arabic language, and Prophetic history. Our Hifdh program supports students in memorizing the Holy Quran under qualified Huffaz.',
                },
              ],
            },
          ],
        },
      },
      media: {
        cardImage: imageId,
        heroImage: imageId,
      },
      schedule: {
        hasSchedule: true,
        scheduleType: 'weekly',
        scheduleText: 'Weekdays 4:30 PM - 6:30 PM, Weekends 10:00 AM - 1:00 PM',
        regularTimes: [
          {
            label: 'Weekdays',
            time: '16:30',
            description: 'After School Classes',
          },
          {
            label: 'Weekends',
            time: '10:00',
            description: 'Saturday & Sunday',
          },
        ],
      },
      registration: {
        enableRegistration: true,
        registrationButtonText: 'Enroll Your Child',
        contactEmail: 'madrasah@masjid-alfalah.org',
        contactPhone: '020 1234 5679',
      },
      venue: {
        hasVenue: true,
        venueName: 'Masjid Al-Falah Education Centre',
        fullAddress: '123 Islamic Centre Road, London, E1 1AA',
      },
      order: 5,
      isFeatured: true,
      isActive: true,
    },
  });
  console.log('✅ Created service:', service5.title);

  // Service 6: Weekly Adult Classes
  // @ts-ignore
  const service6 = await payload.create({
    collection: 'services',
    data: {
      title: 'Weekly Adult Classes',
      slug: 'weekly-adult-classes',
      serviceType: 'adult-classes',
      shortDescription:
        'Expand your Islamic knowledge with our weekly classes for adults.',
      fullDescription: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Our adult education program offers a range of classes including Quran study circles, Fiqh (Islamic jurisprudence), Seerah (biography of the Prophet ﷺ), and Arabic language. Classes are suitable for all levels from beginners to advanced students. Both brothers and sisters sections available.',
                },
              ],
            },
          ],
        },
      },
      media: {
        cardImage: imageId,
        heroImage: imageId,
      },
      schedule: {
        hasSchedule: true,
        scheduleType: 'weekly',
        scheduleText: 'Various classes throughout the week',
        regularTimes: [
          {
            label: 'Quran Study',
            time: '19:30',
            description: 'Tuesday - Main Hall',
          },
          {
            label: 'Fiqh Class',
            time: '19:30',
            description: 'Wednesday - Classroom 1',
          },
          {
            label: 'Seerah Class',
            time: '19:30',
            description: 'Thursday - Main Hall',
          },
          {
            label: 'Arabic Language',
            time: '11:00',
            description: 'Saturday - Classroom 2',
          },
        ],
      },
      registration: {
        enableRegistration: true,
        registrationButtonText: 'Register for Classes',
        contactEmail: 'classes@masjid-alfalah.org',
      },
      venue: {
        hasVenue: true,
        venueName: 'Masjid Al-Falah Learning Centre',
        fullAddress: '123 Islamic Centre Road, London, E1 1AA',
      },
      order: 6,
      isFeatured: false,
      isActive: true,
    },
  });
  console.log('✅ Created service:', service6.title);

  // Service 7: Nikaah Marriage
  // @ts-ignore

  // Service 8: Youth Activities
  // @ts-ignore
  const service8 = await payload.create({
    collection: 'services',
    data: {
      title: 'Youth Activities',
      slug: 'youth-activities',
      serviceType: 'youth',
      shortDescription:
        'Engaging programs for young Muslims to learn, grow, and connect.',
      fullDescription: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Our Youth Program aims to nurture the next generation of Muslim leaders. We offer weekly halaqas, sports activities, mentorship programs, and career guidance. Young Muslims aged 13-25 can participate in our various initiatives designed to strengthen their Islamic identity while navigating modern challenges.',
                },
              ],
            },
          ],
        },
      },
      media: {
        cardImage: imageId,
        heroImage: imageId,
      },
      schedule: {
        hasSchedule: true,
        scheduleType: 'weekly',
        scheduleText: 'Every Friday after Jummah and Sunday evenings',
        regularTimes: [
          {
            label: 'Youth Halaqa',
            time: '14:30',
            description: 'Friday - Youth Room',
          },
          {
            label: 'Sports & Games',
            time: '17:00',
            description: 'Sunday - Sports Hall',
          },
        ],
      },
      registration: {
        enableRegistration: true,
        registrationButtonText: 'Join Youth Program',
        contactEmail: 'youth@masjid-alfalah.org',
      },
      venue: {
        hasVenue: true,
        venueName: 'Masjid Al-Falah Youth Centre',
        fullAddress: '123 Islamic Centre Road, London, E1 1AA',
      },
      order: 8,
      isFeatured: false,
      isActive: true,
    },
  });
  console.log('✅ Created service:', service8.title);

  console.log('🎉 Services seeded successfully!');
  process.exit(0);
}

seedServices().catch(err => {
  console.error('❌ Error seeding services:', err);
  process.exit(1);
});
