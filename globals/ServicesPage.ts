import type { GlobalConfig } from 'payload';

export const ServicesPage: GlobalConfig = {
  slug: 'services-page',
  label: 'Our Services Page',
  admin: {
    description: 'Manage all content for the Our Services page',
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
          name: 'greeting',
          type: 'text',
          defaultValue: 'ASSALAMU ALAIKUM',
          label: 'Greeting Text',
          admin: {
            description: 'Small text above main heading',
          },
        },
        {
          name: 'visionStatement',
          type: 'textarea',
          required: true,
          defaultValue:
            'Our vision is to be a leader in providing Islamic guidance and services that contributes to the Muslim community.',
          label: 'Vision Statement',
          admin: {
            description: 'Main heading text in hero section',
          },
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
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image (Optional)',
          admin: {
            description: 'Background pattern or image',
          },
        },
      ],
    },

    // ============================================================================
    // Breadcrumb
    // ============================================================================
    {
      name: 'breadcrumb',
      type: 'group',
      label: 'Breadcrumb Navigation',
      fields: [
        {
          name: 'showBreadcrumb',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Breadcrumb',
        },
        {
          name: 'breadcrumbText',
          type: 'text',
          defaultValue: 'Home > Our Services',
          label: 'Breadcrumb Text',
          admin: {
            condition: (data, siblingData) => siblingData?.showBreadcrumb,
          },
        },
      ],
    },

    // ============================================================================
    // Services Grid Settings
    // ============================================================================
    {
      name: 'servicesGrid',
      type: 'group',
      label: 'Services Grid Settings',
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          label: 'Section Title (Optional)',
          admin: {
            description: 'Leave blank to show services without title',
          },
        },
        {
          name: 'displayMode',
          type: 'select',
          options: [
            { label: 'All Services', value: 'all' },
            { label: 'Active Services Only', value: 'active' },
            { label: 'Featured Services Only', value: 'featured' },
            { label: 'Selected Services', value: 'selected' },
          ],
          defaultValue: 'active',
          label: 'Display Mode',
        },
        {
          name: 'selectedServices',
          type: 'relationship',
          // @ts-expect-error - Collection slug will be valid after types regeneration
          relationTo: 'services',
          hasMany: true,
          label: 'Selected Services',
          admin: {
            description: 'Choose specific services to display',
            condition: (data, siblingData) =>
              siblingData?.displayMode === 'selected',
          },
        },
        {
          name: 'gridColumns',
          type: 'select',
          options: [
            { label: '2 Columns', value: '2' },
            { label: '3 Columns', value: '3' },
            { label: '4 Columns', value: '4' },
          ],
          defaultValue: '3',
          label: 'Grid Columns',
          admin: {
            description: 'Number of columns in services grid',
          },
        },
        {
          name: 'sortBy',
          type: 'select',
          options: [
            { label: 'Display Order', value: 'order' },
            { label: 'Service Type', value: 'serviceType' },
            { label: 'Title A-Z', value: 'title-asc' },
            { label: 'Most Recent', value: 'recent' },
          ],
          defaultValue: 'order',
          label: 'Sort Services By',
        },
        {
          name: 'showSearch',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Search Bar',
        },
      ],
    },

    // ============================================================================
    // Service Card Appearance
    // ============================================================================
    {
      name: 'cardAppearance',
      type: 'group',
      label: 'Service Card Appearance',
      fields: [
        {
          name: 'showCardImage',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Card Images',
        },
        {
          name: 'showShortDescription',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show Short Description on Cards',
        },
        {
          name: 'cardButtonText',
          type: 'text',
          defaultValue: 'Learn More →',
          label: 'Card Button Text',
        },
        {
          name: 'cardStyle',
          type: 'select',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'With Shadow', value: 'shadow' },
            { label: 'Bordered', value: 'bordered' },
            { label: 'Glassmorphism', value: 'glass' },
          ],
          defaultValue: 'standard',
          label: 'Card Style',
        },
        {
          name: 'hoverEffect',
          type: 'select',
          options: [
            { label: 'Scale Up', value: 'scale' },
            { label: 'Lift (Shadow)', value: 'lift' },
            { label: 'None', value: 'none' },
          ],
          defaultValue: 'scale',
          label: 'Hover Effect',
        },
      ],
    },

    // ============================================================================
    // Request a Service Form
    // ============================================================================
    {
      name: 'requestForm',
      type: 'group',
      label: 'Request a Service Form',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Request Form',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Request a service',
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
              defaultValue: 'Youle Naam',
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
              defaultValue: '+44 000 000 0000',
              label: 'Phone Placeholder',
            },
            {
              name: 'commentLabel',
              type: 'text',
              defaultValue: 'Comment',
              label: 'Comment Field Label',
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
            description: 'Email address where service requests will be sent',
          },
        },
        {
          name: 'successMessage',
          type: 'textarea',
          defaultValue: 'Thank you for your request! We will contact you soon.',
          label: 'Success Message',
        },
        {
          name: 'backgroundColor',
          type: 'select',
          options: [
            { label: 'White', value: 'white' },
            { label: 'Light Gray', value: 'gray' },
            { label: 'Light Blue', value: 'blue' },
          ],
          defaultValue: 'gray',
          label: 'Form Section Background',
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
    // Call-to-Action Section (Optional)
    // ============================================================================
    {
      name: 'cta',
      type: 'group',
      label: 'Additional Call-to-Action',
      fields: [
        {
          name: 'enableCTA',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show Additional CTA Section',
        },
        {
          name: 'ctaTitle',
          type: 'text',
          label: 'CTA Title',
          admin: {
            condition: (data, siblingData) => siblingData?.enableCTA,
          },
        },
        {
          name: 'ctaDescription',
          type: 'textarea',
          label: 'CTA Description',
          admin: {
            condition: (data, siblingData) => siblingData?.enableCTA,
          },
        },
        {
          name: 'ctaButtons',
          type: 'array',
          label: 'CTA Buttons',
          maxRows: 2,
          admin: {
            condition: (data, siblingData) => siblingData?.enableCTA,
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
            {
              name: 'style',
              type: 'select',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
              ],
              defaultValue: 'primary',
            },
          ],
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
              'Leave blank to use default "Our Services - Masjid Al-Falah"',
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
