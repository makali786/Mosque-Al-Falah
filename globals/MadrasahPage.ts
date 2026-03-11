import { createRevalidateHook } from '../lib/revalidation';
import type { GlobalConfig } from 'payload';

export const MadrasahPage: GlobalConfig = {
  slug: 'madrasah-page',
  label: 'Madrasah Page',
  admin: {
    description: 'Manage all content for the Madrasah page',
  },
  access: {
    read: () => true,
  },
  hooks: {

    afterChange: [createRevalidateHook('madrasah-page')],

  },

  fields: [
    // ============================================================================
    // Hero Section
    // ============================================================================
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Madrasah Al-Falah',
          label: 'Page Title',
        },
        {
          name: 'subtitle',
          type: 'text',
          defaultValue: 'Nurturing Faith & Character',
          label: 'Subtitle',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'A mosque-based learning programme helping children develop a love for the Qur’an, deepen their Islamic understanding, and grow with strong character and values.',
          label: 'Description',
        },
        {
          name: 'tag1',
          type: 'text',
          defaultValue: 'Ages 5-16',
          label: 'Tag 1',
        },
        {
          name: 'tag2',
          type: 'text',
          defaultValue: 'Weekdays & Weekends',
          label: 'Tag 2',
        },
        {
          name: 'tag3',
          type: 'text',
          defaultValue: 'Established 2007',
          label: 'Tag 3',
        },
        {
          name: 'button1Text',
          type: 'text',
          defaultValue: 'Enrol Your Child',
          label: 'Button 1 Text',
        },
        {
          name: 'button1Url',
          type: 'text',
          defaultValue: '#enroll',
          label: 'Button 1 URL',
        },
        {
          name: 'button2Text',
          type: 'text',
          defaultValue: 'View Curriculum',
          label: 'Button 2 Text',
        },
        {
          name: 'button2Url',
          type: 'text',
          defaultValue: '#curriculum',
          label: 'Button 2 URL',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Hero Background Image',
          admin: {
            description: 'Background image for the hero section',
          },
        },
      ],
    },

    // ============================================================================
    // Mission Section
    // ============================================================================
    {
      name: 'mission',
      type: 'group',
      label: 'Mission Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Mission Section',
        },
        {
          name: 'tag',
          type: 'text',
          defaultValue: 'Our Mission',
          label: 'Tag / Label',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'A Holistic Approach to Spiritual Growth',
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'At Madrasah Al-Falah, we believe that education is more than just memorization. Our mission is to provide a balanced Islamic education that equips students with firm theological foundations while fostering a deep, personal connection with their Creator and the community.',
          label: 'Description',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Mission Image',
        },
        {
          name: 'cards',
          type: 'array',
          label: 'Value Cards',
          minRows: 1,
          maxRows: 4,
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Card Title',
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              label: 'Card Description',
            },
            // Note: Icons are hardcoded in the frontend for now, or we could add an icon/svg picker
          ],
          defaultValue: [
            {
              title: 'Quran Learning',
              description: 'Mastering Tajweed and Hifdh with expert guidance and traditional methods.',
            },
            {
              title: 'Islamic Studies',
              description: 'Comprehensive understanding of Fiqh, Sirah, and fundamental Aqa’id.',
            },
            {
              title: 'Character Dev',
              description: 'Building noble Akhlaq and Islamic values for everyday life.',
            },
            {
              title: 'Family Support',
              description: 'Partnering with parents to nurture a consistent Islamic environment at home.',
            },
          ]
        },
      ],
    },

    // ============================================================================
    // Class Schedule Section
    // ============================================================================
    {
      name: 'classSchedule',
      type: 'group',
      label: 'Class Schedule Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Class Schedule Section',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Class Schedule',
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: "Flexible session timings designed to accommodate your child's primary education and your family's daily routine.",
          label: 'Description',
        },
        {
          name: 'sessions',
          type: 'array',
          label: 'Sessions',
          minRows: 1,
          maxRows: 4,
          fields: [
            {
              name: 'sessionTag',
              type: 'text',
              required: true,
              label: 'Session Tag (e.g. SESSION 01)',
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Session Title',
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              label: 'Session Description',
            },
            {
              name: 'days',
              type: 'text',
              required: true,
              label: 'Days (e.g. Monday - Friday)',
            },
            {
              name: 'time',
              type: 'text',
              required: true,
              label: 'Time (e.g. 5:00 PM - 7:00 PM)',
            },
            {
              name: 'buttonText',
              type: 'text',
              required: true,
              label: 'Button Text',
            },
            {
              name: 'buttonUrl',
              type: 'text',
              label: 'Button URL',
            },
            {
              name: 'theme',
              type: 'select',
              options: [
                { label: 'Light Button', value: 'light' },
                { label: 'Gold Button', value: 'gold' },
              ],
              defaultValue: 'light',
              label: 'Button Theme Strategy',
            }
          ],
          defaultValue: [
            {
              sessionTag: 'SESSION 01',
              title: 'Weekday Madrasah',
              description: 'Consistent daily learning to build strong foundations.',
              days: 'Monday - Friday',
              time: '5:00 PM - 7:00 PM',
              buttonText: 'Apply for Weekdays',
              theme: 'light',
            },
            {
              sessionTag: 'SESSION 02',
              title: 'Weekend Madrasah',
              description: 'Intensive weekend morning sessions for focused study.',
              days: 'Saturday - Sunday',
              time: '9:30 AM - 12:30 PM',
              buttonText: 'Apply for Weekends',
              theme: 'gold',
            },
          ]
        },
      ],
    },

    // ============================================================================
    // Structured Curriculum Section
    // ============================================================================
    {
      name: 'structuredCurriculum',
      type: 'group',
      label: 'Structured Curriculum Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Structured Curriculum Section',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Structured Curriculum',
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'Our tiered learning programme is designed to take students from foundational literacy to advanced theological understanding.',
          label: 'Description',
        },
        {
          name: 'infoBoxText',
          type: 'textarea',
          defaultValue: 'Teaching materials are drawn from recognized Islamic education resources, including publications by An-Nasihah and Safar.',
          label: 'Info Box Text',
        },
        {
          name: 'curriculumBlocks',
          type: 'array',
          label: 'Curriculum Blocks',
          minRows: 1,
          maxRows: 2,
          defaultValue: [
            {
              blockTitle: 'Qur’an Studies',
              iconType: 'book',
              items: [
                {
                  number: '01',
                  title: 'Qa’idah & Reading Skills',
                  description: 'Systematic development of correct Arabic letter recognition and pronunciation.'
                },
                {
                  number: '02',
                  title: 'Tajwīd (Rules of Recitation)',
                  description: 'Learning and applying the rules for accurate and beautiful recitation of the Qur’an.'
                },
                {
                  number: '03',
                  title: 'Qur’an Recitation',
                  description: 'Guided reading with correction to build fluency and confidence.'
                }
              ]
            },
            {
              blockTitle: 'Islamic Studies',
              iconType: 'head',
              items: [
                {
                  number: '01',
                  title: 'Fiqh (Jurisprudence)',
                  description: 'Fundamentals of worship including Taharah (cleanliness), Wudu, Ghusl, Salah rules, and Zakah.'
                },
                {
                  number: '02',
                  title: 'Ahadith (Sayings of the Prophet ﷺ)',
                  description: 'Memorisation and application of selected Ahadith focusing on character and conduct.'
                },
                {
                  number: '03',
                  title: 'Sirah (Life of the Prophet ﷺ)',
                  description: 'Key events from the life of Prophet Muhammad ﷺ'
                }
              ]
            }
          ],
          fields: [
            {
              name: 'blockTitle',
              type: 'text',
              required: true,
              label: 'Block Title (e.g. Qur’an Studies)',
            },
            {
              name: 'iconType',
              type: 'select',
              options: [
                { label: 'Book (Qur\'an Studies)', value: 'book' },
                { label: 'Head (Islamic Studies)', value: 'head' },
              ],
              defaultValue: 'book',
              label: 'Block Icon',
            },
            {
              name: 'items',
              type: 'array',
              label: 'Curriculum Items',
              minRows: 1,
              fields: [
                {
                  name: 'number',
                  type: 'text',
                  required: true,
                  label: 'Number (e.g. 01)',
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Item Title',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  label: 'Item Description',
                },
              ]
            }
          ]
        }
      ],
    },

    // ============================================================================
    // Core Aims Section
    // ============================================================================
    {
      name: 'coreAimsSection',
      type: 'group',
      label: 'Core Aims Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Core Aims Section',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Core Aims',
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'Our mission is not only to teach knowledge, but to nurture every child in a safe, caring environment where faith, character, and confidence can flourish.',
          label: 'Section Description',
        },
        {
          name: 'aims',
          type: 'array',
          label: 'Core Aims',
          minRows: 1,
          maxRows: 6,
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Aim Title',
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              label: 'Aim Description',
            },
          ],
          defaultValue: [
            {
              title: 'Love for Allah & His Messenger',
              description:
                'Instilling love for Allah, devotion in worship, and commitment to the Sunnah.',
            },
            {
              title: 'Spiritual Growth & Excellence',
              description:
                'Encouraging self-reflection (Muhasabah) and striving for excellence (Ihsan) in character and conduct.',
            },
            {
              title: 'Confident British Muslims',
              description:
                'Nurturing a strong Islamic identity that contributes positively and ethically to modern society.',
            },
          ],
        },
        {
          name: 'safeguardingTitle',
          type: 'text',
          defaultValue: 'Safeguarding & Trust',
          label: 'Safeguarding Card Title',
        },
        {
          name: 'safeguardingDescription',
          type: 'textarea',
          defaultValue:
            "Your child's safety and well-being are our paramount concerns. We maintain industry-leading safeguarding standards.",
          label: 'Safeguarding Card Description',
        },
        {
          name: 'safeguardingPoints',
          type: 'array',
          label: 'Safeguarding Bullet Points',
          minRows: 1,
          maxRows: 10,
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              label: 'Point',
            },
          ],
          defaultValue: [
            { text: 'All staff are fully enhanced DBS checked' },
            { text: 'Safeguarding and child-protection trained staff' },
            { text: 'Zero-tolerance Anti-Bullying Policy' },
            { text: 'Students supervised at all times' },
            { text: 'Secure student check-in/out protocols' },
          ],
        },
      ],
    },

    // ============================================================================
    // Leadership Section
    // ============================================================================
    {
      name: 'leadershipSection',
      type: 'group',
      label: 'Our Leadership Section',
      admin: {
        description: 'Showcase the key teachers and leaders of the Madrasah.',
      },
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Leadership Section',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Our Leadership',
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'Serving the community through scholarship, guidance, and dedicated teaching.',
          label: 'Section Description',
        },
        {
          name: 'members',
          type: 'array',
          label: 'Leadership Members',
          minRows: 1,
          maxRows: 8,
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Full Name',
            },
            {
              name: 'role',
              type: 'text',
              required: true,
              label: 'Role / Title',
            },
            {
              name: 'bio',
              type: 'textarea',
              required: true,
              label: 'Short Bio',
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              label: 'Photo',
            },
            {
              name: 'whatsappUrl',
              type: 'text',
              label: 'WhatsApp Link (e.g. https://wa.me/447700000000)',
            },
            {
              name: 'emailUrl',
              type: 'email',
              label: 'Email Address',
            },
          ],
          defaultValue: [
            {
              name: 'Maulana Mohammed Dawood',
              role: 'Head of Madrasah',
              bio: 'Provides scholarly guidance and oversees the Madrasah programme.',
            },
            {
              name: 'Ustaad Umor Harun',
              role: 'Madrasah Lead',
              bio: 'Manages daily operations and supports students and teachers.',
            },
            {
              name: 'Maulana Yusuf Kothi Sahib',
              role: 'Senior Scholar & Advisor',
              bio: 'Provides guidance and mentorship to the Madrasah community.',
            },
            {
              name: 'Ustadha Nargis',
              role: 'Head of Girls Section',
              bio: "Teaches Qur'an and leads the girls' learning programme.",
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Admissions & Fees Section
    // ============================================================================
    {
      name: 'admissionsSection',
      type: 'group',
      label: 'Admissions & Fees Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Admissions & Fees Section',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Admissions & Fees',
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'Madrasah Al-Falah welcomes students who wish to learn the Qur’an and develop strong Islamic character in a supportive environment.',
          label: 'Section Description',
        },
        {
          name: 'eligibilityAgeRange',
          type: 'text',
          defaultValue: '5-16',
          label: 'Eligibility: Age Range',
        },
        {
          name: 'eligibilityAgeUnit',
          type: 'text',
          defaultValue: 'Years Old',
          label: 'Eligibility: Age Unit',
        },
        {
          name: 'eligibilityBody',
          type: 'textarea',
          defaultValue:
            'Placement may be based on ability as well as age, and priority may be given to local families and siblings of existing students.\n\nMadrasah Al-Falah maintains high standards and small class sizes, and due to strong demand, admission is subject to availability.\n\nParents are expected to support their child’s attendance, homework, and behaviour.',
          label: 'Eligibility: Body Text',
        },
        {
          name: 'processHeadline',
          type: 'text',
          defaultValue: 'Placement',
          label: 'Process: Headline Text',
        },
        {
          name: 'processBody',
          type: 'textarea',
          defaultValue:
            'New students may undergo a brief assessment to determine the appropriate class\n\nStudents are expected to attend regularly, respect teachers and classmates, follow classroom rules, and care for learning materials.\n\nModest and appropriate conduct is expected at all times.',
          label: 'Process: Body Text',
        },
        {
          name: 'feesBadgeLabel',
          type: 'text',
          defaultValue: 'TERMLY CONTRIBUTION',
          label: 'Fees: Badge Label',
        },
        {
          name: 'feesBody',
          type: 'textarea',
          defaultValue:
            'Fees help cover teaching costs, learning materials, utilities, and the maintenance of Madrasah facilities.',
          label: 'Fees: Body Text',
        },
        {
          name: 'feePoints',
          type: 'array',
          label: 'Fees: Bullet Points',
          minRows: 1,
          maxRows: 5,
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              label: 'Point',
            },
          ],
          defaultValue: [
            { text: 'Fees are payable termly' },
            { text: 'Payment details provided upon enrolment' },
            { text: 'Fees are generally non-refundable' },
          ],
        },
        {
          name: 'feesHardshipNote',
          type: 'textarea',
          defaultValue:
            'Parents experiencing financial difficulty are encouraged to discuss this confidentially with the office.',
          label: 'Fees: Hardship Note',
        },
        {
          name: 'feesCtaText',
          type: 'text',
          defaultValue: 'Inquire About Fees',
          label: 'Fees: CTA Button Text',
        },
        {
          name: 'feesCtaUrl',
          type: 'text',
          defaultValue: '#inquire',
          label: 'Fees: CTA Button URL',
        },
      ],
    },

    // ============================================================================
    // Classes Section
    // ============================================================================
    {
      name: 'classesSection',
      type: 'group',
      label: 'Classes Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Classes Section',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Classes',
          label: 'Section Title',
        },
        {
          name: 'displayMode',
          type: 'select',
          options: [
            { label: 'All Classes', value: 'all' },
            { label: 'Active Only', value: 'active' },
            { label: 'Featured Only', value: 'featured' },
          ],
          defaultValue: 'active',
          label: 'Display Mode',
        },
        {
          name: 'gridColumns',
          type: 'select',
          options: [
            { label: '2 Columns', value: '2' },
            { label: '3 Columns', value: '3' },
            { label: '4 Columns', value: '4' },
          ],
          defaultValue: '4',
          label: 'Grid Columns',
        },
      ],
    },

    // ============================================================================
    // Committee Section
    // ============================================================================
    {
      name: 'committeeSection',
      type: 'group',
      label: 'Madrasah Committee Section',
      admin: {
        description:
          'Uses committee members from Committees collection filtered by "education" type',
      },
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Committee Section',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Madrasah Committee',
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'Madrasah Al Falaah is run under the management of Masjid Al Falaah under which there is a group of people who gives their valuable time to look after the needs of our Madrasah n a daily basis, these people are working as Madrasah Committee and they are as follow;',
          label: 'Section Description',
        },
        {
          name: 'gridColumns',
          type: 'select',
          options: [
            { label: '3 Columns', value: '3' },
            { label: '4 Columns', value: '4' },
          ],
          defaultValue: '4',
          label: 'Grid Columns',
        },
      ],
    },

    // ============================================================================
    // Gallery Section
    // ============================================================================
    {
      name: 'gallerySection',
      type: 'group',
      label: 'Madrasah Gallery Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Gallery Section',
        },
        {
          name: 'sectionLabel',
          type: 'text',
          defaultValue: 'OUR MADRASAH MOMENTS',
          label: 'Section Label (Small Text)',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Madrasah Gallery',
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            "Explore our gallery showcasing the vibrant learning environment at Masjid Al-Falah's Madrasah. From engaging Quranic lessons to interactive activities, witness the dedication of our students and teachers in nurturing faith, knowledge, and community spirit.",
          label: 'Gallery Description',
        },
        {
          name: 'galleryImages',
          type: 'array',
          label: 'Gallery Images',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'caption',
              type: 'text',
              label: 'Image Caption',
            },
          ],
        },
        {
          name: 'contactButtonText',
          type: 'text',
          defaultValue: 'Contact Us',
          label: 'Contact Button Text',
        },
        {
          name: 'contactButtonUrl',
          type: 'text',
          defaultValue: '#contact',
          label: 'Contact Button URL',
        },
        {
          name: 'enrollButtonText',
          type: 'text',
          defaultValue: 'Enroll Your Child',
          label: 'Enroll Button Text',
        },
        {
          name: 'enrollButtonUrl',
          type: 'text',
          label: 'Enroll Button URL',
        },
      ],
    },

    // ============================================================================
    // Journey CTA Section
    // ============================================================================
    {
      name: 'journeyCtaSection',
      type: 'group',
      label: 'Journey CTA Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Journey CTA Section',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Ready to begin the journey?',
          label: 'Title',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'Give your child the gift of sacred knowledge and a community\nthat cares. Admissions for the 2024 intake are now open.',
          label: 'Description',
        },
        {
          name: 'primaryButtonText',
          type: 'text',
          defaultValue: 'Apply Now',
          label: 'Primary Button Text',
        },
        {
          name: 'primaryButtonUrl',
          type: 'text',
          defaultValue: '#apply',
          label: 'Primary Button URL',
        },
        {
          name: 'secondaryButtonText',
          type: 'text',
          defaultValue: 'Submit Admissions Enquiry',
          label: 'Secondary Button Text',
        },
        {
          name: 'secondaryButtonUrl',
          type: 'text',
          defaultValue: '#enquiry',
          label: 'Secondary Button URL',
        },
      ],
    },

    // ============================================================================
    // Visit Our Centre Section
    // ============================================================================
    {
      name: 'visitCentreSection',
      type: 'group',
      label: 'Visit Our Centre Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Visit Our Centre Section',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Visit Our Centre',
          label: 'Section Title',
        },
        {
          name: 'addressLabel',
          type: 'text',
          defaultValue: 'Address',
          label: 'Address Label',
        },
        {
          name: 'addressValue',
          type: 'textarea',
          defaultValue: 'Masjid Al-Falah, 97 Kensington Gardens,\nIlford, IG1 3RR',
          label: 'Address Value',
        },
        {
          name: 'emailLabel',
          type: 'text',
          defaultValue: 'Email',
          label: 'Email Label',
        },
        {
          name: 'emailValue',
          type: 'text',
          defaultValue: 'admissions@alfalahilford.org',
          label: 'Email Value',
        },
        {
          name: 'phoneLabel',
          type: 'text',
          defaultValue: 'Phone',
          label: 'Phone Label',
        },
        {
          name: 'phoneValue',
          type: 'text',
          defaultValue: '+44 20 8123 4567',
          label: 'Phone Value',
        },
        {
          name: 'latitude',
          type: 'number',
          defaultValue: 51.5623063,
          label: 'Latitude (for Map)',
        },
        {
          name: 'longitude',
          type: 'number',
          defaultValue: 0.0747472,
          label: 'Longitude (for Map)',
        },
      ],
    },

    // ============================================================================
    // Testimonials Section
    // ============================================================================
    {
      name: 'testimonialsSection',
      type: 'group',
      label: 'Parent Testimonials Section',
      admin: {
        description: 'Uses testimonials from Madrasah Testimonials collection',
      },
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Testimonials Section',
        },
        {
          name: 'sectionLabel',
          type: 'text',
          defaultValue: 'What Parents Say',
          label: 'Section Label (Small Text)',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Inspiring journeys of faith, learning, and growth.',
          label: 'Section Title',
        },
        {
          name: 'displayCount',
          type: 'number',
          defaultValue: 3,
          label: 'Number of Testimonials to Show',
        },
        {
          name: 'showCarouselControls',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Carousel Navigation Arrows',
        },
      ],
    },

    // ============================================================================
    // FAQs Section
    // ============================================================================
    {
      name: 'faqsSection',
      type: 'group',
      label: 'FAQs Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show FAQs Section',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Frequently Asked Questions (FAQs)',
          label: 'Section Title',
        },
        {
          name: 'sectionDescription',
          type: 'text',
          defaultValue:
            'Find answers to common questions about our Madrasa programs.',
          label: 'Section Description',
        },
        {
          name: 'faqs',
          type: 'array',
          label: 'FAQ Items',
          fields: [
            {
              name: 'question',
              type: 'text',
              required: true,
              label: 'Question',
            },
            {
              name: 'answer',
              type: 'richText',
              required: true,
              label: 'Answer',
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Contact Form Section
    // ============================================================================
    {
      name: 'contactSection',
      type: 'group',
      label: 'Contact Form Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Contact Section',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Contact Us',
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'Connect our Masjid for personalized assistance and discover how we can help you.',
          label: 'Form Description',
        },
        {
          name: 'formFields',
          type: 'group',
          label: 'Form Field Labels',
          fields: [
            {
              name: 'fullNameLabel',
              type: 'text',
              defaultValue: 'Full Name *',
              label: 'Full Name Field Label',
            },
            {
              name: 'fullNamePlaceholder',
              type: 'text',
              defaultValue: 'Your Name',
              label: 'Full Name Placeholder',
            },
            {
              name: 'emailLabel',
              type: 'text',
              defaultValue: 'Email *',
              label: 'Email Field Label',
            },
            {
              name: 'emailPlaceholder',
              type: 'text',
              defaultValue: 'Enter your Email',
              label: 'Email Placeholder',
            },
            {
              name: 'phoneLabel',
              type: 'text',
              defaultValue: 'Phone Number',
              label: 'Phone Field Label',
            },
            {
              name: 'phonePlaceholder',
              type: 'text',
              defaultValue: '+440 123 456 789',
              label: 'Phone Placeholder',
            },
            {
              name: 'commentsLabel',
              type: 'text',
              defaultValue: 'Comments',
              label: 'Comments Field Label',
            },
            {
              name: 'submitButtonText',
              type: 'text',
              defaultValue: 'Submit',
              label: 'Submit Button Text',
            },
          ],
        },
        {
          name: 'recipientEmail',
          type: 'email',
          label: 'Form Submissions Email',
          admin: {
            description: 'Email address where inquiries will be sent',
          },
        },
        {
          name: 'successMessage',
          type: 'textarea',
          defaultValue: 'Thank you for your inquiry! We will contact you soon.',
          label: 'Success Message',
        },
      ],
    },

    // ============================================================================
    // Bottom Quote Section
    // ============================================================================
    {
      name: 'bottomQuote',
      type: 'group',
      label: 'Bottom Quote Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Bottom Quote',
        },
        {
          name: 'quoteText',
          type: 'textarea',
          required: true,
          defaultValue:
            'Whoever guides someone to goodness will have a reward like the one who did it.',
          label: 'Quote Text',
        },
        {
          name: 'author',
          type: 'text',
          required: true,
          defaultValue: 'Prophet Muhammad ﷺ',
          label: 'Quote Author',
        },
        {
          name: 'showShareButton',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Share Button',
        },
        {
          name: 'shareButtonText',
          type: 'text',
          defaultValue: 'Share this page',
          label: 'Share Button Text',
          admin: {
            condition: (data, siblingData) => siblingData?.showShareButton,
          },
        },
        {
          name: 'showDonateButton',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Donate Button',
        },
        {
          name: 'donateButtonText',
          type: 'text',
          defaultValue: 'Donate Now',
          label: 'Donate Button Text',
          admin: {
            condition: (data, siblingData) => siblingData?.showDonateButton,
          },
        },
        {
          name: 'donateButtonUrl',
          type: 'text',
          defaultValue: '/appeals',
          label: 'Donate Button URL',
          admin: {
            condition: (data, siblingData) => siblingData?.showDonateButton,
          },
        },
      ],
    },

    // ============================================================================
    // SEO Settings
    // ============================================================================
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description:
              'Leave blank to use default "Madrasah - Masjid Al-Falah"',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Social Share Image',
        },
      ],
    },
  ],
};
