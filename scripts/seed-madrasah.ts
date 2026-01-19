// Script to seed Madrasah data into the database
// Run with: npx tsx scripts/seed-madrasah.ts

import { config } from 'dotenv';
config(); // Load .env file

import { getPayload } from 'payload';
import payloadConfig from '../payload.config';

async function seedMadrasah() {
  // @ts-ignore
  const payloadConfigNew = await payloadConfig;
  const payload = await getPayload({ config: payloadConfigNew });


  // Get existing media for placeholder images
  // @ts-ignore
  const existingMedia = await payload.find({
    collection: 'media',
    limit: 10,
  });

  const placeholderImage =
    existingMedia.docs.length > 0 ? existingMedia.docs[0].id : null;

  if (!placeholderImage) {
    console.log('⚠️  No media found. Continuing without images...');
  }

  // ============================================================================
  // Seed Madrasah Classes
  // ============================================================================

  const classesData = [
    {
      title: 'Madrasah for boys',
      slug: 'madrasah-boys',
      classType: 'boys',
      ageRange: '6-17 years old',
      shortDescription:
        'Masjid Al-Falah is delighted to be offering Hifz classes for boys and girls aged between 6-17 years old. The programme will be coordinated by our principal Imam.',
      applicationButtonText: 'Apply Now',
      applicationUrl: '/contact',
      order: 1,
      isActive: true,
      isFeatured: false,
    },
    {
      title: 'Hifz for Children',
      slug: 'hifz-children',
      classType: 'hifz',
      ageRange: '6-17 years old',
      shortDescription:
        'Masjid Al-Falah is delighted to be offering Hifz classes for boys and girls aged between 6-17 years old. The programme will be coordinated by our principal Imam.',
      applicationButtonText: 'Apply Now',
      applicationUrl: '/contact',
      order: 2,
      isActive: true,
      isFeatured: false,
    },
    {
      title: 'Further Education',
      slug: 'further-education',
      classType: 'further-education',
      ageRange: '6-17 years old',
      shortDescription:
        'Masjid Al-Falah is delighted to be offering Hifz classes for boys and girls aged between 6-17 years old. The programme will be coordinated by our principal Imam.',
      applicationButtonText: 'Apply Now',
      applicationUrl: '/contact',
      order: 3,
      isActive: true,
      isFeatured: false,
    },
    {
      title: 'Classes for Teenagers',
      slug: 'classes-teenagers',
      classType: 'teens',
      ageRange: '13-17 years old',
      shortDescription:
        'Masjid Al-Falah is delighted to be offering Hifz classes for boys and girls aged between 6-17 years old. The programme will be coordinated by our principal Imam.',
      applicationButtonText: 'Apply Now',
      applicationUrl: '/contact',
      order: 4,
      isActive: true,
      isFeatured: false,
    },
  ];

  for (const classData of classesData) {
    try {
      // @ts-ignore
      const created = await payload.create({
        collection: 'madrasah-classes',
        data: {
          ...classData,
          ...(placeholderImage && { image: placeholderImage }),
        },
      });
      console.log(`  ✅ Created class: ${created.title}`);
    } catch (err: any) {
      if (err.message?.includes('duplicate')) {
        console.log(`  ⏭️  Class already exists: ${classData.title}`);
      } else {
        console.log(
          `  ❌ Error creating class ${classData.title}:`,
          err.message
        );
      }
    }
  }

  // ============================================================================
  // Seed Madrasah Testimonials
  // ============================================================================
  console.log('\n💬 Seeding Madrasah Testimonials...');

  const testimonialsData = [
    {
      title: 'A Truly Transformative Experience',
      quote:
        'My child has grown immensely in both faith and character since joining the Madrasa. The teachers are kind, knowledgeable, and truly dedicated to nurturing Islamic values.',
      rating: 5,
      authorName: 'Guardian Name',
      authorInitials: 'GN',
      authorRole: 'Parent',
      order: 1,
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'A Safe and Supportive Learning Environment',
      quote:
        'The Madrasa provides a warm and welcoming atmosphere where my son feels comfortable learning about Islam. He loves his classes and looks forward to attending every day.',
      rating: 5,
      authorName: 'Mohammed S.',
      authorInitials: 'MS',
      authorRole: 'Parent',
      order: 2,
      isActive: true,
      isFeatured: true,
    },
    {
      title: 'Excellent Quranic Education',
      quote:
        'I am amazed at how quickly my daughter has learned to recite the Quran with proper Tajweed. The structured lessons and personalized attention have made a huge difference.',
      rating: 5,
      authorName: 'Farah K.',
      authorInitials: 'FK',
      authorRole: 'Parent',
      order: 3,
      isActive: true,
      isFeatured: true,
    },
  ];

  for (const testimonialData of testimonialsData) {
    try {
      // @ts-ignore
      const created = await payload.create({
        collection: 'madrasah-testimonials',
        data: testimonialData,
      });
      console.log(`  ✅ Created testimonial: ${created.title}`);
    } catch (err: any) {
      console.log(
        `  ❌ Error creating testimonial ${testimonialData.title}:`,
        err.message
      );
    }
  }

  // ============================================================================
  // Seed Madrasah Page Global
  // ============================================================================
  console.log('\n📄 Seeding Madrasah Page Global...');

  try {
    // @ts-ignore
    await payload.updateGlobal({
      slug: 'madrasah-page',
      data: {
        hero: {
          title: 'Madrasah',
          showBreadcrumb: true,
          breadcrumbText: 'Home > Madrasah',
        },
        classesSection: {
          enableSection: true,
          sectionTitle: 'Classes',
          displayMode: 'active',
          gridColumns: '4',
        },
        committeeSection: {
          enableSection: true,
          sectionTitle: 'Madrasah Committee',
          description:
            'Madrasah Al Falaah is run under the management of Masjid Al Falaah under which there is a group of people who gives their valuable time to look after the needs of our Madrasah n a daily basis, these people are working as Madrasah Committee and they are as follow;',
          gridColumns: '4',
        },
        gallerySection: {
          enableSection: true,
          sectionLabel: 'OUR MADRASAH MOMENTS',
          sectionTitle: 'Madrasah Gallery',
          description:
            "Explore our gallery showcasing the vibrant learning environment at Masjid Al-Falah's Madrasah. From engaging Quranic lessons to interactive activities, witness the dedication of our students and teachers in nurturing faith, knowledge, and community spirit.",
          contactButtonText: 'Contact Us',
          contactButtonUrl: '#contact',
          enrollButtonText: 'Enroll Your Child',
          enrollButtonUrl: '/contact',
        },
        testimonialsSection: {
          enableSection: true,
          sectionLabel: 'What Parents Say',
          sectionTitle: 'Inspiring journeys of faith, learning, and growth.',
          displayCount: 3,
          showCarouselControls: true,
        },
        faqsSection: {
          enableSection: true,
          sectionTitle: 'Frequently Asked Questions (FAQs)',
          sectionDescription:
            'Find answers to common questions about our Madrasa programs.',
          faqs: [
            {
              question: 'What age groups can enroll in the Madrasa?',
              answer: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text: 'Our Madrasa welcomes children from ages 5 and above, with tailored classes for different age groups.',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              question: 'What subjects are taught at the Madrasa?',
              answer: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text: 'We teach Quran recitation, Tajweed, Islamic studies, Arabic language, and Islamic history.',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              question: 'What are the class timings?',
              answer: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text: 'Classes are held on weekdays after school hours (4:00 PM - 6:00 PM) and on weekends.',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              question: 'Is there a registration fee?',
              answer: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text: 'Please contact us for information about registration fees and any available financial assistance.',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              question: 'Do you have separate classes for boys and girls?',
              answer: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text: 'Yes, we offer separate classes for boys and girls to ensure an appropriate learning environment.',
                        },
                      ],
                    },
                  ],
                },
              },
            },
            {
              question: 'How can I enroll my child?',
              answer: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text: 'You can enroll your child by filling out the contact form on this page or visiting the Masjid office during office hours.',
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
        contactSection: {
          enableSection: true,
          sectionTitle: 'Contact Us',
          description:
            'Connect our Masjid for personalized assistance and discover how we can help you.',
          formFields: {
            fullNameLabel: 'Full Name *',
            fullNamePlaceholder: 'Your Name',
            emailLabel: 'Email *',
            emailPlaceholder: 'Enter your Email',
            phoneLabel: 'Phone Number',
            phonePlaceholder: '+440 123 456 789',
            commentsLabel: 'Comments',
            submitButtonText: 'Submit',
          },
          successMessage:
            'Thank you for your inquiry! We will contact you soon.',
        },
        bottomQuote: {
          enableSection: true,
          quoteText:
            'Whoever guides someone to goodness will have a reward like the one who did it.',
          author: 'Prophet Muhammad ﷺ',
          showShareButton: true,
          shareButtonText: 'Share this page',
          showDonateButton: true,
          donateButtonText: 'Donate Now',
          donateButtonUrl: '/appeals',
        },
        seo: {
          metaTitle: 'Madrasah - Masjid Al-Falah',
          metaDescription:
            'Explore our Madrasah programs at Masjid Al-Falah. We offer Quran classes, Hifz programs, and Islamic education for children and teenagers.',
        },
      },
    });
    console.log('  ✅ Updated Madrasah Page global');
  } catch (err: any) {
    console.log('  ❌ Error updating Madrasah Page global:', err.message);
  }

  console.log('\n🎉 Madrasah data seeded successfully!');
  process.exit(0);
}

seedMadrasah().catch(err => {
  console.error('❌ Error seeding Madrasah data:', err);
  process.exit(1);
});
