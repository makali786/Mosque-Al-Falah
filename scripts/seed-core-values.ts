// Script to seed core values (FAQ) into the database
// Run with: npx tsx scripts/seed-core-values.ts

import { config } from 'dotenv';
config(); // Load .env file

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

async function seedCoreValues() {
  // @ts-ignore
  const payloadConfigNew = await payloadConfig;
  const payload = await getPayload({ config: payloadConfigNew });

  console.log('🌱 Seeding core values...');

  // Core Value 1: What is MAF?
  // @ts-ignore
  const value1 = await payload.create({
    collection: 'core-values',
    data: {
      question: 'What is the Masjid Al-Falah (MAF)?',
      answer: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Masjid Al-Falah is a vibrant Islamic community centre in London, dedicated to serving the spiritual, educational, and social needs of Muslims. Our Madrasa welcomes children from ages 5 and above, with tailored classes for different age groups. We offer daily prayers, Islamic education, community events, and various support services for all members of our community.',
                },
              ],
            },
          ],
        },
      },
      category: 'about-maf',
      order: 1,
      isActive: true,
    },
  });
  console.log('✅ Created core value:', value1.question);

  // Core Value 2: How is MAF Organised?
  // @ts-ignore
  const value2 = await payload.create({
    collection: 'core-values',
    data: {
      question: 'How is MAF Organised?',
      answer: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: "Masjid Al-Falah is governed by an elected Board of Trustees who oversee the strategic direction of the organisation. Day-to-day operations are managed by a dedicated team including our Imams, administrative staff, and volunteers. We have various committees focusing on education, youth, women's affairs, community outreach, and facilities management.",
                },
              ],
            },
          ],
        },
      },
      category: 'organization',
      order: 2,
      isActive: true,
    },
  });
  console.log('✅ Created core value:', value2.question);

  // Core Value 3: How was MCB Founded?
  // @ts-ignore
  const value3 = await payload.create({
    collection: 'core-values',
    data: {
      question: 'How was MAF Founded?',
      answer: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Masjid Al-Falah was established in 1995 by a group of dedicated community members who recognised the need for a central place of worship and learning in the area. Starting from humble beginnings in a small rented space, the community worked together to purchase the current building in 2002. Through continued generosity and dedication, the mosque has grown to become a cornerstone of the Muslim community.',
                },
              ],
            },
          ],
        },
      },
      category: 'history',
      order: 3,
      isActive: true,
    },
  });
  console.log('✅ Created core value:', value3.question);

  // Core Value 4: How is MAF Funded?
  // @ts-ignore
  const value4 = await payload.create({
    collection: 'core-values',
    data: {
      question: 'How is the MAF Funded?',
      answer: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Masjid Al-Falah is primarily funded through the generous donations of our community members. We receive regular contributions through Friday collections, monthly standing orders, and special appeals during Ramadan and other occasions. We also receive Zakat and Sadaqah donations which are carefully distributed according to Islamic principles. All our financial activities are transparent and audited annually.',
                },
              ],
            },
          ],
        },
      },
      category: 'funding',
      order: 4,
      isActive: true,
    },
  });
  console.log('✅ Created core value:', value4.question);

  // Core Value 5: Relating to British Muslim Individuals
  // @ts-ignore
  const value5 = await payload.create({
    collection: 'core-values',
    data: {
      question: 'How Do You Relate to ordinary British Muslim Individuals?',
      answer: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Masjid Al-Falah is committed to serving all British Muslims regardless of their background, ethnicity, or school of thought. We provide accessible religious guidance, community support, and a welcoming environment for everyone. Our programs cater to first-generation immigrants and British-born Muslims alike. We focus on helping Muslims integrate positively into British society while maintaining their Islamic identity and values.',
                },
              ],
            },
          ],
        },
      },
      category: 'community',
      order: 5,
      isActive: true,
    },
  });
  console.log('✅ Created core value:', value5.question);

  // Core Value 6: Our Mission
  // @ts-ignore
  const value6 = await payload.create({
    collection: 'core-values',
    data: {
      question: 'What is the Mission of Masjid Al-Falah?',
      answer: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Our mission is to establish a place of worship that serves the spiritual, educational, and social needs of our community. We strive to promote understanding of Islam through authentic teachings, foster unity among Muslims, nurture the next generation through quality Islamic education, and contribute positively to the wider society. May Allah accept our efforts and bless our community.',
                },
              ],
            },
          ],
        },
      },
      category: 'values',
      order: 6,
      isActive: true,
    },
  });
  console.log('✅ Created core value:', value6.question);

  console.log('🎉 Core values seeded successfully!');
  process.exit(0);
}

seedCoreValues().catch(err => {
  console.error('❌ Error seeding core values:', err);
  process.exit(1);
});
