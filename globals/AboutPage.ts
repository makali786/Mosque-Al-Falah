import type { GlobalConfig } from 'payload';

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Us Page',
  admin: {
    description: 'Manage all content for the About Us page',
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
          defaultValue: 'About Us',
          label: 'Page Title',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Hero Background Image',
        },
        {
          name: 'breadcrumb',
          type: 'text',
          defaultValue: 'Home > About Us',
          label: 'Breadcrumb Text',
        },
      ],
    },

    // ============================================================================
    // Our History Section
    // ============================================================================
    {
      name: 'history',
      type: 'group',
      label: 'Our History Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show History Section',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Our History',
          label: 'Section Title',
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
          label: 'History Content',
          admin: {
            description: 'Full history text with timeline details',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'History Image',
          admin: {
            description: 'Image shown on right side (e.g., mosque building)',
          },
        },
        {
          name: 'timeline',
          type: 'array',
          label: 'Timeline Highlights',
          admin: {
            description: 'Key dates and events in mosque history',
          },
          fields: [
            {
              name: 'year',
              type: 'text',
              required: true,
              label: 'Year',
              admin: {
                description: 'e.g., "1950", "2007", "2009"',
              },
            },
            {
              name: 'event',
              type: 'text',
              required: true,
              label: 'Event',
              admin: {
                description: 'What happened in this year',
              },
            },
            {
              name: 'details',
              type: 'richText',
              label: 'Additional Details',
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Our Mission Section
    // ============================================================================
    {
      name: 'mission',
      type: 'group',
      label: 'Our Mission Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Mission Section',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Our Mission',
          label: 'Section Title',
        },
        {
          name: 'introduction',
          type: 'textarea',
          required: true,
          label: 'Mission Statement',
          admin: {
            description: 'Opening paragraph about the mission',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Mission Image',
          admin: {
            description: 'Image shown on left side',
          },
        },
        {
          name: 'missionPoints',
          type: 'array',
          required: true,
          label: 'Mission Points',
          admin: {
            description: 'Key mission objectives (bullet points)',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Point Title',
              admin: {
                description: 'e.g., "Inspiring faith", "Educating"',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              label: 'Description',
              admin: {
                description: 'Detailed explanation of this point',
              },
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icon Name',
              admin: {
                description: 'Optional: React Icons name or emoji',
              },
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Core Values Section Settings
    // ============================================================================
    {
      name: 'coreValues',
      type: 'group',
      label: 'Core Values Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Core Values Section',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Our Core Values',
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Section Description',
          admin: {
            description: 'Text shown above FAQ accordion',
          },
        },
        {
          name: 'backgroundColor',
          type: 'select',
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'White', value: 'white' },
            { label: 'Light Gray', value: 'gray' },
          ],
          defaultValue: 'blue',
          label: 'Background Color',
        },
      ],
    },

    // ============================================================================
    // Committees Section Settings
    // ============================================================================
    {
      name: 'committeesSection',
      type: 'group',
      label: 'Committees Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Committees Section',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Meet Our Committees',
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'Our Directional Leadership Team works together to shape the vision and direction of Firid Faith',
          label: 'Section Description',
        },
        {
          name: 'showAllCommittees',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show All Committee Types',
          admin: {
            description:
              'If disabled, you can select specific committees to display',
          },
        },
      ],
    },

    // ============================================================================
    // Connect with Us Section
    // ============================================================================
    {
      name: 'connect',
      type: 'group',
      label: 'Connect with Us Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Connect Section',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Connect with Us',
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          label: 'Connect Message',
          admin: {
            description: 'Message encouraging community connection',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Section Image',
          admin: {
            description: 'Image shown on left side (prayer hall)',
          },
        },
        {
          name: 'primaryButton',
          type: 'group',
          label: 'Primary Button',
          fields: [
            {
              name: 'text',
              type: 'text',
              defaultValue: 'Contact Us',
              label: 'Button Text',
            },
            {
              name: 'url',
              type: 'text',
              defaultValue: '/contact-us',
              label: 'Button URL',
            },
          ],
        },
        {
          name: 'secondaryButton',
          type: 'group',
          label: 'Secondary Button',
          fields: [
            {
              name: 'text',
              type: 'text',
              defaultValue: 'Join Our Community',
              label: 'Button Text',
            },
            {
              name: 'url',
              type: 'text',
              label: 'Button URL',
            },
          ],
        },
        {
          name: 'backgroundColor',
          type: 'select',
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
            { label: 'Dark', value: 'dark' },
          ],
          defaultValue: 'blue',
          label: 'Background Color',
        },
      ],
    },

    // ============================================================================
    // Quote Section
    // ============================================================================
    {
      name: 'quote',
      type: 'group',
      label: 'Inspirational Quote Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Quote Section',
        },
        {
          name: 'quoteText',
          type: 'textarea',
          required: true,
          label: 'Quote Text',
          admin: {
            description: 'e.g., Hadith or inspirational quote',
          },
        },
        {
          name: 'author',
          type: 'text',
          required: true,
          label: 'Quote Author',
          admin: {
            description: 'e.g., "Prophet Muhammad ﷺ"',
          },
        },
        {
          name: 'showShareButton',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Share Button',
        },
        {
          name: 'showDonateButton',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Donate Button',
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
              'Leave blank to use default "About Us - Masjid Al-Falah"',
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
