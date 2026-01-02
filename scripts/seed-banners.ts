// Script to seed banners into the database
// Run with: npx tsx scripts/seed-banners.ts

import { config } from 'dotenv';
config(); // Load .env file

import fs from 'fs';
import path from 'path';
import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

async function seedBanners() {
  // @ts-ignore
  const payloadConfigNew = await payloadConfig;
  const payload = await getPayload({ config: payloadConfigNew });

  console.log('🌱 Seeding banners...');

  // First, check if we have any existing media items to use
  // @ts-ignore
  const existingMedia = await payload.find({
    collection: 'media',
    limit: 2,
  });

  let imageId1: string | undefined;
  let imageId2: string | undefined;

  if (existingMedia.docs.length >= 2) {
    imageId1 = existingMedia.docs[0].id;
    imageId2 = existingMedia.docs[1].id;
    console.log('📷 Using existing media items:', imageId1, imageId2);
  } else if (existingMedia.docs.length === 1) {
    imageId1 = existingMedia.docs[0].id;
    imageId2 = existingMedia.docs[0].id;
    console.log('📷 Using existing media item:', imageId1);
  } else {
    // Upload placeholder images from public folder if they exist
    const publicPath = path.resolve(process.cwd(), 'public');

    // Check for banner images in public folder
    const bannerImages = [
      'assets/banner/banner1.jpg',
      'assets/banner/banner2.jpg',
      'assets/home/hero.jpg',
      'assets/about-us/banner.jpg',
    ];

    for (const imagePath of bannerImages) {
      const fullPath = path.join(publicPath, imagePath);
      if (fs.existsSync(fullPath)) {
        console.log('📷 Found image:', fullPath);
        try {
          // @ts-ignore
          const uploaded = await payload.create({
            collection: 'media',
            data: {
              alt: 'Banner Image',
            },
            filePath: fullPath,
          });
          if (!imageId1) {
            imageId1 = uploaded.id;
          } else if (!imageId2) {
            imageId2 = uploaded.id;
            break;
          }
        } catch (err) {
          console.log('Could not upload:', imagePath);
        }
      }
    }

    if (!imageId1) {
      console.log(
        '❌ No media items found. Please upload at least one image first via the admin panel.'
      );
      console.log(
        '   Go to http://localhost:3000/admin/collections/media/create and upload an image.'
      );
      process.exit(1);
    }

    if (!imageId2) {
      imageId2 = imageId1;
    }
  }

  // Banner 1: Welcome to Masjid Al-Falah
  // @ts-ignore
  const banner1 = await payload.create({
    collection: 'banners',
    data: {
      title: 'Welcome to Masjid Al-Falah',
      description:
        'A place of worship, learning, and community. Join us for daily prayers, educational programs, and community events. May Allah bless you and your family.',
      image: imageId1,
      primaryButton: {
        text: 'Donate Now',
        href: '/appeals',
      },
      secondaryButton: {
        text: 'Our Services',
        href: '/services',
      },
      order: 1,
      isActive: true,
    },
  });
  console.log('✅ Created banner:', banner1.title);

  // Banner 2: Ramadan Preparation
  // @ts-ignore
  const banner2 = await payload.create({
    collection: 'banners',
    data: {
      title: 'Prepare for Ramadan 2025',
      description:
        'Join us this blessed month for Taraweeh prayers, Iftar gatherings, and special lectures. Register for our Ramadan programs and be part of our growing community.',
      image: imageId2,
      primaryButton: {
        text: 'View Events',
        href: '/events',
      },
      secondaryButton: {
        text: 'Learn More',
        href: '/about',
      },
      order: 2,
      isActive: true,
    },
  });
  console.log('✅ Created banner:', banner2.title);

  console.log('🎉 Banners seeded successfully!');
  process.exit(0);
}

seedBanners().catch(err => {
  console.error('❌ Error seeding banners:', err);
  process.exit(1);
});
