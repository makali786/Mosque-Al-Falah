// Script to seed donation appeals into the database
// Run with: npx tsx scripts/seed-donation-appeals.ts

import { config } from 'dotenv';
config(); // Load .env file

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

async function seedDonationAppeals() {
  // @ts-ignore
  const payloadConfigNew = await payloadConfig;
  const payload = await getPayload({ config: payloadConfigNew });

  console.log('🌱 Seeding donation appeals...');

  // Get existing media items for images
  // @ts-ignore
  const existingMedia = await payload.find({
    collection: 'media',
    limit: 5,
  });

  const imageId =
    existingMedia.docs.length > 0 ? existingMedia.docs[0].id : null;
  const imageId2 =
    existingMedia.docs.length > 1 ? existingMedia.docs[1].id : imageId;

  if (!imageId) {
    console.log(
      '❌ No media items found. Please upload at least one image first.'
    );
    process.exit(1);
  }

  console.log('📷 Using media items:', imageId, imageId2);

  // Appeal 1: Give Back with Grateful Heart - Ramadan
  // @ts-ignore
  const appeal1 = await payload.create({
    collection: 'donation-appeals',
    data: {
      title: 'Give back with grateful heart this Ramadan',
      slug: 'ramadan-grateful-heart-2025',
      shortDescription:
        'Providing Water and Homes to Orphans, Widows and the Most Vulnerable. Your generosity feeds families, supports orphans, and builds hope.',
      funding: {
        targetAmount: 87000,
        currentAmount: 18402,
        totalDonors: 105,
      },
      timeline: {
        startDate: new Date('2025-01-01T00:00:00').toISOString(),
        endDate: new Date('2025-03-31T23:59:59').toISOString(),
        showCountdown: true,
      },
      statsDisplay: {
        showStatsBar: true,
        statsToShow: [
          { statType: 'current-amount' },
          { statType: 'donors' },
          { statType: 'target' },
          { statType: 'days-left' },
        ],
      },
      heroMedia: {
        heroImage: imageId,
      },
      donationOptions: {
        enableOneTime: true,
        enableMonthly: true,
        quickAmounts: [
          { amount: 10 },
          { amount: 25 },
          { amount: 50 },
          { amount: 100 },
          { amount: 250 },
        ],
        allowCustomAmount: true,
        minimumDonation: 5,
      },
      whyMatters: {
        enableSection: true,
        sectionTitle: 'Why Your Support Matters',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'As our community continues to grow, the need for a larger and more accommodating space has become essential. Your support will help us expand prayer halls, ensuring that everyone has a place to worship comfortably. It will also improve educational facilities, from classrooms to libraries, fostering a nurturing environment for learners of all ages. Additionally, improving accessibility will make it easier for the elderly and disabled to participate in prayers and community activities.',
                  },
                ],
              },
            ],
          },
        },
        featuredImage: imageId2,
      },
      impactGallery: {
        enableGallery: true,
        galleryTitle: 'Donation Impact Gallery',
        galleryDescription:
          'See how your generosity transforms our Masjid and community—one contribution at a time.',
        images: [
          {
            image: imageId,
            caption: 'Prayer Hall',
            altText: 'Beautiful prayer hall',
          },
          {
            image: imageId2,
            caption: 'Community Space',
            altText: 'Community gathering space',
          },
        ],
      },
      waysToGive: {
        enableSection: true,
        sectionTitle: 'Ways to Give',
        sectionDescription:
          'You can support Masjid Al-Falah in various meaningful ways.',
        sectionImage: imageId,
        givingMethods: [
          {
            methodName: 'One-Time Donation',
            description: 'Make an Immediate Impact',
            icon: '💝',
          },
          {
            methodName: 'Every Friday',
            description: 'Give weekly to earnings',
            icon: '📅',
          },
          {
            methodName: 'Monthly Sadaqah',
            description: 'Commit today for rewards',
            icon: '🔄',
          },
          {
            methodName: 'Quarterly & Yearly',
            description: 'Schedule today for long-term impact',
            icon: '📈',
          },
        ],
      },
      testimonials: [
        {
          quote:
            '"Whoever guides someone to goodness will have a reward like the one who did it."',
          author: 'Prophet Muhammad ﷺ',
        },
      ],
      donationForm: {
        collectAddress: true,
        collectPhone: true,
        allowAnonymous: true,
        showGiftAid: true,
      },
      payment: {
        paymentProcessor: 'stripe',
        allowedCurrencies: [
          { currency: 'GBP' },
          { currency: 'USD' },
          { currency: 'EUR' },
        ],
      },
      category: 'ramadan',
      tags: [{ tag: 'Ramadan' }, { tag: 'Charity' }, { tag: 'Community' }],
      emailSettings: {
        sendDonorReceipt: true,
        sendThankYou: true,
      },
      socialSharing: {
        enableSharing: true,
        shareTitle: 'Support Masjid Al-Falah this Ramadan',
        shareDescription:
          'Help us serve the community with your generous donation.',
      },
      cta: {
        primaryButtonText: 'Donate Now',
        secondaryButtonText: 'Share this page',
      },
      seo: {
        metaTitle: 'Ramadan Appeal 2025 - Masjid Al-Falah',
        metaDescription:
          'Support our Ramadan fundraising campaign. Your donation helps orphans, widows, and the vulnerable.',
      },
      isFeatured: true,
      isActive: true,
    },
  });
  console.log('✅ Created appeal:', appeal1.title);

  // Appeal 2: Gaza Emergency Appeal
  // @ts-ignore
  const appeal2 = await payload.create({
    collection: 'donation-appeals',
    data: {
      title: 'Gaza Emergency Appeal',
      slug: 'gaza-emergency-appeal',
      shortDescription:
        'Providing Water and Homes to Orphans, Widows and the Most Vulnerable. Urgent humanitarian aid for our brothers and sisters in Gaza.',
      funding: {
        targetAmount: 87000,
        currentAmount: 18402,
        totalDonors: 105,
      },
      timeline: {
        startDate: new Date('2024-10-01T00:00:00').toISOString(),
        showCountdown: true,
      },
      statsDisplay: {
        showStatsBar: true,
        statsToShow: [
          { statType: 'current-amount' },
          { statType: 'donors' },
          { statType: 'target' },
          { statType: 'days-left' },
        ],
      },
      heroMedia: {
        heroImage: imageId2,
      },
      donationOptions: {
        enableOneTime: true,
        enableMonthly: true,
        quickAmounts: [
          { amount: 25 },
          { amount: 50 },
          { amount: 100 },
          { amount: 250 },
          { amount: 500 },
        ],
        allowCustomAmount: true,
        minimumDonation: 10,
      },
      whyMatters: {
        enableSection: true,
        sectionTitle: 'Why Your Support Matters',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'The situation in Gaza requires urgent humanitarian assistance. Your donations provide food, clean water, medical supplies, and shelter to families who have lost everything. Every contribution, no matter the size, makes a real difference in the lives of our brothers and sisters facing unimaginable hardship.',
                  },
                ],
              },
            ],
          },
        },
        featuredImage: imageId,
      },
      impactGallery: {
        enableGallery: false,
      },
      waysToGive: {
        enableSection: true,
        sectionTitle: 'Ways to Give',
        sectionDescription: 'Your support reaches those most in need.',
        givingMethods: [
          {
            methodName: 'One-Time Donation',
            description: 'Immediate emergency relief',
            icon: '🆘',
          },
          {
            methodName: 'Monthly Support',
            description: 'Ongoing humanitarian aid',
            icon: '❤️',
          },
          {
            methodName: 'Zakat',
            description: 'Fulfill your obligation',
            icon: '🕌',
          },
          {
            methodName: 'Sadaqah',
            description: 'Voluntary charity',
            icon: '🤲',
          },
        ],
      },
      testimonials: [
        {
          quote:
            '"Whoever guides someone to goodness will have a reward like the one who did it."',
          author: 'Prophet Muhammad ﷺ',
        },
      ],
      donationForm: {
        collectAddress: true,
        collectPhone: true,
        allowAnonymous: true,
        showGiftAid: true,
      },
      payment: {
        paymentProcessor: 'stripe',
        allowedCurrencies: [{ currency: 'GBP' }, { currency: 'USD' }],
      },
      category: 'emergency',
      tags: [{ tag: 'Gaza' }, { tag: 'Emergency' }, { tag: 'Humanitarian' }],
      emailSettings: {
        sendDonorReceipt: true,
        sendThankYou: true,
      },
      socialSharing: {
        enableSharing: true,
        shareTitle: 'Gaza Emergency Appeal - Masjid Al-Falah',
        shareDescription: 'Help provide urgent humanitarian aid to Gaza.',
      },
      cta: {
        primaryButtonText: 'Donate Now',
        secondaryButtonText: 'Share this page',
      },
      seo: {
        metaTitle: 'Gaza Emergency Appeal - Masjid Al-Falah',
        metaDescription:
          'Urgent humanitarian appeal for Gaza. Provide food, water, and shelter to those in need.',
      },
      isFeatured: true,
      isActive: true,
    },
  });
  console.log('✅ Created appeal:', appeal2.title);

  // Appeal 3: Help Build a Lasting Legacy
  // @ts-ignore
  const appeal3 = await payload.create({
    collection: 'donation-appeals',
    data: {
      title: 'Help Build a Lasting Legacy',
      slug: 'help-build-lasting-legacy',
      shortDescription:
        'The Masjid has always been a beacon of faith, community, and service. Now, as we work on a construction drive to expand our facilities and enhance this sacred space, we invite you to be a part of something truly special.',
      funding: {
        targetAmount: 1000000,
        currentAmount: 250000,
        totalDonors: 10,
      },
      timeline: {
        startDate: new Date('2024-06-01T00:00:00').toISOString(),
        endDate: new Date('2025-06-01T23:59:59').toISOString(),
        showCountdown: true,
      },
      statsDisplay: {
        showStatsBar: true,
        statsToShow: [
          { statType: 'current-amount' },
          { statType: 'donors' },
          { statType: 'target' },
          { statType: 'days-left' },
        ],
      },
      heroMedia: {
        heroImage: imageId,
      },
      donationOptions: {
        enableOneTime: true,
        enableMonthly: true,
        quickAmounts: [
          { amount: 100 },
          { amount: 250 },
          { amount: 500 },
          { amount: 1000 },
          { amount: 5000 },
        ],
        allowCustomAmount: true,
        minimumDonation: 25,
      },
      whyMatters: {
        enableSection: true,
        sectionTitle: 'Why Your Support Matters',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'As our community continues to grow, the need for a larger and more accommodating space has become essential. Your support will help us expand prayer halls, ensuring that everyone has a place to worship comfortably. It will also improve educational facilities, from classrooms to libraries, fostering a nurturing environment for learners of all ages. Additionally, improving accessibility will make it easier for the elderly and disabled to participate in prayers and community activities.',
                  },
                ],
              },
            ],
          },
        },
        featuredImage: imageId2,
      },
      impactGallery: {
        enableGallery: true,
        galleryTitle: 'Donation Impact Gallery',
        galleryDescription:
          'See how your generosity transforms our Masjid and community—one contribution at a time.',
        images: [
          {
            image: imageId,
            caption: 'Beautiful Mosque Architecture',
            altText: 'Mosque exterior',
          },
          {
            image: imageId2,
            caption: 'Prayer Hall Interior',
            altText: 'Prayer hall',
          },
        ],
      },
      waysToGive: {
        enableSection: true,
        sectionTitle: 'Ways to Give',
        sectionDescription:
          'You can support Masjid Al-Falah in various meaningful ways.',
        sectionImage: imageId,
        givingMethods: [
          {
            methodName: 'One-Time Donation',
            description: 'Make an Immediate Impact',
            icon: '💝',
          },
          {
            methodName: 'Every Friday',
            description: 'Give weekly to earnings',
            icon: '📅',
          },
          {
            methodName: 'Monthly Sadaqah',
            description: 'Commit today for rewards',
            icon: '🔄',
          },
          {
            methodName: 'Quarterly & Yearly',
            description: 'Schedule today for long-term impact',
            icon: '📈',
          },
        ],
      },
      testimonials: [
        {
          quote:
            'Abu Hurairah (RA) reported: "Whoever builds a mosque for Allah, Allah will build for him a house in Paradise."',
          author: 'Sahih al-Bukhari & Muslim',
        },
      ],
      donationForm: {
        collectAddress: true,
        collectPhone: true,
        allowAnonymous: true,
        showGiftAid: true,
      },
      payment: {
        paymentProcessor: 'stripe',
        allowedCurrencies: [
          { currency: 'GBP' },
          { currency: 'USD' },
          { currency: 'EUR' },
        ],
      },
      category: 'building',
      tags: [
        { tag: 'Building' },
        { tag: 'Legacy' },
        { tag: 'Sadaqah Jariyah' },
      ],
      emailSettings: {
        sendDonorReceipt: true,
        sendThankYou: true,
      },
      socialSharing: {
        enableSharing: true,
        shareTitle: 'Help Build a Lasting Legacy - Masjid Al-Falah',
        shareDescription:
          'Be part of our expansion project and earn ongoing rewards.',
      },
      cta: {
        primaryButtonText: 'Donate Now',
        secondaryButtonText: 'Share this page',
      },
      seo: {
        metaTitle: 'Help Build a Lasting Legacy - Masjid Al-Falah',
        metaDescription:
          'Support our building expansion project. Your contribution is Sadaqah Jariyah - ongoing charity.',
      },
      isFeatured: true,
      isActive: true,
    },
  });
  console.log('✅ Created appeal:', appeal3.title);

  console.log('🎉 Donation appeals seeded successfully!');
  process.exit(0);
}

seedDonationAppeals().catch(err => {
  console.error('❌ Error seeding donation appeals:', err);
  process.exit(1);
});
