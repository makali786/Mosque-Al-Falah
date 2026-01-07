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
          defaultValue: 'Madrasah',
          label: 'Page Title',
        },
        {
          name: 'showBreadcrumb',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Breadcrumb',
        },
        {
          name: 'breadcrumbText',
          type: 'text',
          defaultValue: 'Home > Madrasah',
          label: 'Breadcrumb Text',
          admin: {
            condition: (data, siblingData) => siblingData?.showBreadcrumb,
          },
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
