// Script to seed blog posts into the database
// Run with: npx tsx scripts/seed-blogs.ts

import { config } from 'dotenv';
config(); // Load .env file

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

async function seedBlogs() {
  // @ts-ignore
  const payloadConfigNew = await payloadConfig;
  const payload = await getPayload({ config: payloadConfigNew });

  console.log('🌱 Seeding blog posts...');

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
  const imageId3 =
    existingMedia.docs.length > 2 ? existingMedia.docs[2].id : imageId;

  if (!imageId) {
    console.log(
      '❌ No media items found. Please upload at least one image first.'
    );
    process.exit(1);
  }

  console.log('📷 Using media items:', imageId, imageId2, imageId3);

  // Blog 1: How To Pray Taraweeh during Ramadan
  // @ts-ignore
  const blog1 = await payload.create({
    collection: 'blog-posts',
    data: {
      title: 'How To Pray Taraweeh during Ramadan',
      slug: 'how-to-pray-taraweeh-during-ramadan',
      excerpt:
        'Learn how to pray Taraweeh during Ramadan with step-by-step guidance and authentic hadith references.',
      featuredImage: imageId,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Abu Hurairah reported that the Messenger of Allah (peace be upon him) stated: "Whoever performs the voluntary night prayer during Ramadan with faith and in anticipation of reward will have their past sins forgiven." [Sunan an-Nasai 5027]',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: "Taraweeh is one of the special prayers of Ramadan. It is a nightly prayer performed after the obligatory Isha prayer and before the Witr prayer. The Taraweeh prayer consists of twenty rakat, each performed as a unit of two rakats. Muslims from all over the world line up and listen to the recitation of the Quran done during Taraweeh in mosques. This prayer helps establish a deeper connection with the Lord and truly enjoy Ramadan's essence.",
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [{ type: 'text', text: 'Taraweeh & Its Origins' }],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Taraweeh is an Arabic word that means \'rest and relaxation.\' Taraweeh is sometimes called "Qiyam," which translates to "standing." It is a nightly prayer performed after the Isha prayer and is proven by the Prophet PBUH himself. Several hadiths are evidence of the Taraweeh prayer being established from the time of the Prophet PBUH.',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: '"Aisha narrated that the Messenger of Allah (PBUH) led prayer in the mosque one night, and people joined him. On the following night, more people gathered to pray with him. However, by the third or fourth night, when even larger crowds assembled, the Messenger of Allah (PBUH) chose not to come out to lead the Taraweeh prayer. In the morning, he explained: \'I observed what you were doing, but I refrained from joining you, as I feared this prayer might become mandatory for you.\'" [Sahih Muslim 761A]',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [{ type: 'text', text: 'How To Pray Taraweeh?' }],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Taraweeh is prayed like any other two-rakah prayer, with a short break after every 4 rakats. Below is a step-by-step breakdown of performing Taraweeh:',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: '1. Pray the Isha prayer, stopping before praying Witr.\n2. Make an intention to pray Taraweeh.\n3. Pray the first 2 rakats.\n4. Again, pray 2 rakats.\n5. Take a short break and recite the dua for this break.\n6. Repeat this until all 20 rakats of the Taraweeh prayer are completed.\n7. Pray the Witr prayer.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [
                { type: 'text', text: 'How Many Rakats Are In Taraweeh?' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Before arriving at the rakats of Taraweeh prayer, it is essential to remember that there are no specified number of rakats of Taraweeh in the hadith.',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Ibn \'Umar reported that the Prophet (PBUH) was asked about the night prayer. He replied, "Pray in sets of two. If you are concerned that dawn is approaching, then conclude your prayer with one Rak\'ah of Witr." [Sunan Ibn Majah 1320]',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: '• Hanafi: According to the Hanafi school of thought, the Taraweeh prayer consists of twenty rakats, apart from Witr.\n• Hanbali: The Hanbali school of thought states that the Taraweeh prayer comprises twenty rakats.\n• Shafi: The Shafi school states that taraweeh is of twenty rakats.\n• Maliki: According to the Maliki school of thought, the Taraweeh prayer consists of thirty-six rakats.',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Note: The person who is praying Taraweeh at home can pray it either at the beginning of the night or at the end of it.',
                },
              ],
            },
          ],
        },
      },
      category: 'salah',
      tags: [{ tag: 'Hadith' }, { tag: 'Salah' }, { tag: 'Quran' }],
      author: {
        name: 'Masjid Al-Falah',
      },
      publishedDate: new Date('2024-02-14T12:00:00').toISOString(),
      isFeatured: true,
      isPublished: true,
      enableComments: true,
      comments: [
        {
          userName: 'Junior Garcia',
          userEmail: 'junior@example.com',
          comment:
            'I am fortunate to have many excellent doctors in my family and amongst my friends. I never thought I needed a special primary care physician.',
          commentDate: new Date('2023-05-12T10:00:00').toISOString(),
          isApproved: true,
          replies: [
            {
              userName: 'Junior Garcia',
              replyText:
                'I am fortunate to have many excellent doctors in my family and amongst my friends. I never thought I needed a special primary care physician.',
              replyDate: new Date('2023-05-12T12:00:00').toISOString(),
            },
          ],
        },
        {
          userName: 'Toufik Hasan',
          userEmail: 'toufik@example.com',
          comment:
            'I am fortunate to have many excellent doctors in my family and amongst my friends. I never thought I needed a special primary care physician.',
          commentDate: new Date('2023-05-30T10:00:00').toISOString(),
          isApproved: true,
        },
      ],
      readingTime: 8,
      viewCount: 1536,
      seo: {
        metaTitle: 'How To Pray Taraweeh during Ramadan - Masjid Al-Falah',
        metaDescription:
          'Learn how to properly perform the Taraweeh prayer during Ramadan with step-by-step guidance and hadith references.',
      },
    },
  });
  console.log('✅ Created blog:', blog1.title);

  // Blog 2: The Importance of Daily Prayers in Islam
  // @ts-ignore
  const blog2 = await payload.create({
    collection: 'blog-posts',
    data: {
      title: 'The Importance of Daily Prayers in Islam',
      slug: 'importance-of-daily-prayers-in-islam',
      excerpt:
        "Prayer is the second pillar of Islam. Learn about the importance of five daily prayers in a Muslim's life.",
      featuredImage: imageId2,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'The Prophet (peace be upon him) said: "The first matter that the slave will be brought to account for on the Day of Judgment is the prayer. If it is sound, then the rest of his deeds will be sound. And if it is bad, then the rest of the deeds will be bad." [At-Tabarani]',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [{ type: 'text', text: 'The Five Pillars and Prayer' }],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: "Salah (prayer) is the second of the five pillars of Islam, coming right after the Shahada (declaration of faith). This placement emphasizes its importance in a Muslim's life. The five daily prayers are: Fajr (dawn), Dhuhr (noon), Asr (afternoon), Maghrib (sunset), and Isha (night).",
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [{ type: 'text', text: 'Benefits of Regular Prayer' }],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: '1. Spiritual Connection: Prayer provides a direct link to Allah, allowing Muslims to seek guidance, express gratitude, and find peace.\n\n2. Discipline and Structure: The five daily prayers create a rhythm to the day, encouraging mindfulness and time management.\n\n3. Physical Health: The various positions in prayer—standing, bowing, prostrating—provide gentle exercise and promote flexibility.\n\n4. Mental Clarity: Taking breaks to pray helps clear the mind, reduce stress, and refocus on what truly matters.\n\n5. Community Bond: Praying in congregation strengthens the bonds between Muslims and fosters a sense of unity.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [
                { type: 'text', text: 'Establishing Prayer in Your Life' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: "For those looking to establish regular prayer, start by learning the basic movements and words. Use prayer apps to remind you of prayer times, and try to pray at least one prayer at the mosque each day. Remember, consistency is key—even if you can't pray every prayer perfectly, the effort is what counts.",
                },
              ],
            },
          ],
        },
      },
      category: 'salah',
      tags: [
        { tag: 'Prayer' },
        { tag: 'Pillars of Islam' },
        { tag: 'Daily Practice' },
      ],
      author: {
        name: 'Masjid Al-Falah',
      },
      publishedDate: new Date('2024-02-14T10:00:00').toISOString(),
      isFeatured: false,
      isPublished: true,
      enableComments: true,
      readingTime: 6,
      viewCount: 892,
      seo: {
        metaTitle: 'The Importance of Daily Prayers in Islam - Masjid Al-Falah',
        metaDescription:
          'Discover why prayer is the cornerstone of Islamic practice and how to establish regular prayers in your daily life.',
      },
    },
  });
  console.log('✅ Created blog:', blog2.title);

  // Blog 3: The Significance of Charity and Giving in Islam
  // @ts-ignore
  const blog3 = await payload.create({
    collection: 'blog-posts',
    data: {
      title: 'The Significance of Charity and Giving in Islam',
      slug: 'significance-of-charity-and-giving-in-islam',
      excerpt:
        'Discover Zakat, Sadaqah, and Islamic giving. Learn how charity purifies wealth and strengthens community.',
      featuredImage: imageId3,
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'The Prophet Muhammad (peace be upon him) said: "Charity does not decrease wealth." [Sahih Muslim]. This profound statement reveals the spiritual economics of giving in Islam—what seems like a decrease actually leads to increase, both in this world and the hereafter.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [{ type: 'text', text: 'Types of Charity in Islam' }],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Islam recognizes several forms of charity:\n\n• Zakat: The obligatory charity (2.5% of savings) given annually to help those in need. It is one of the five pillars of Islam.\n\n• Sadaqah: Voluntary charity that can be given at any time, in any amount, to anyone in need.\n\n• Sadaqah Jariyah: Ongoing charity whose rewards continue even after death, such as building wells, mosques, or schools.\n\n• Qard Hasan: A beautiful loan given without expecting any return or interest.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [{ type: 'text', text: 'Who Can Receive Zakat?' }],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'The Quran specifies eight categories of people eligible to receive Zakat: the poor, the needy, those employed to collect Zakat, those whose hearts are to be reconciled, those in bondage, those in debt, in the cause of Allah, and the wayfarer.',
                },
              ],
            },
            {
              type: 'heading',
              tag: 'h2',
              children: [
                { type: 'text', text: 'The Spiritual Benefits of Giving' },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Giving charity purifies the soul from greed and selfishness. It teaches compassion and empathy, strengthens community bonds, and reminds us that all wealth ultimately belongs to Allah. The Prophet (pbuh) said that the upper hand (the one that gives) is better than the lower hand (the one that receives).',
                },
              ],
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: '"Whoever guides someone to goodness will have a reward like the one who did it." — Prophet Muhammad ﷺ',
                },
              ],
            },
          ],
        },
      },
      category: 'hadith',
      tags: [{ tag: 'Charity' }, { tag: 'Zakat' }, { tag: 'Sadaqah' }],
      author: {
        name: 'Masjid Al-Falah',
      },
      publishedDate: new Date('2024-02-14T08:00:00').toISOString(),
      isFeatured: true,
      isPublished: true,
      enableComments: true,
      readingTime: 7,
      viewCount: 1124,
      seo: {
        metaTitle:
          'The Significance of Charity and Giving in Islam - Masjid Al-Falah',
        metaDescription:
          'Learn about Zakat, Sadaqah, and the importance of charitable giving in Islam. Discover how charity purifies wealth and strengthens community.',
      },
    },
  });
  console.log('✅ Created blog:', blog3.title);

  // Link related posts
  console.log('🔗 Linking related posts...');
  // @ts-ignore
  await payload.update({
    collection: 'blog-posts',
    id: blog1.id,
    data: {
      relatedPosts: [blog2.id, blog3.id],
    },
  });
  // @ts-ignore
  await payload.update({
    collection: 'blog-posts',
    id: blog2.id,
    data: {
      relatedPosts: [blog1.id, blog3.id],
    },
  });
  // @ts-ignore
  await payload.update({
    collection: 'blog-posts',
    id: blog3.id,
    data: {
      relatedPosts: [blog1.id, blog2.id],
    },
  });

  console.log('🎉 Blog posts seeded successfully!');
  process.exit(0);
}

seedBlogs().catch(err => {
  console.error('❌ Error seeding blog posts:', err);
  process.exit(1);
});
