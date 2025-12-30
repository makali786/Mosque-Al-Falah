import type { CollectionConfig } from 'payload';

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'serviceType', 'order', 'isActive'],
    description: 'Comprehensive mosque services management',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ============================================================================
    // Basic Information
    // ============================================================================
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Service Title',
      admin: {
        description: 'e.g., "Five Daily Prayers", "Nikaah Marriage Service"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'e.g., "five-daily-prayers", "nikaah-marriage"',
      },
    },
    {
      name: 'serviceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Five Daily Prayers', value: 'daily-prayers' },
        { label: "Friday Jumu'ah", value: 'jummah' },
        { label: 'Taraweeh & Eid Prayers', value: 'taraweeh-eid' },
        { label: 'Food Bank', value: 'food-bank' },
        { label: 'Madrasah & Hifdh', value: 'madrasah' },
        { label: 'Weekly Adult Classes', value: 'adult-classes' },
        { label: 'Nikaah Marriage', value: 'nikaah' },
        { label: 'Educational Events', value: 'educational' },
        { label: 'Youth Activities', value: 'youth' },
        { label: 'Other', value: 'other' },
      ],
      label: 'Service Type',
    },

    // ============================================================================
    // Content & Description
    // ============================================================================
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Short Description',
      admin: {
        description: 'Brief summary shown on service cards',
      },
    },
    {
      name: 'fullDescription',
      type: 'richText',
      required: true,
      label: 'Full Service Description',
      admin: {
        description: 'Detailed information about the service',
      },
    },

    // ============================================================================
    // Media
    // ============================================================================
    {
      name: 'media',
      type: 'group',
      label: 'Service Media',
      fields: [
        {
          name: 'cardImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Card Image',
          admin: {
            description: 'Image shown on service card in grid view',
          },
        },
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Hero/Banner Image',
          admin: {
            description: 'Large image for service detail page',
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: 'Featured Video URL',
          admin: {
            description: 'YouTube, Vimeo, or stream URL',
          },
        },
        {
          name: 'isLive',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show "Live" Badge',
        },
        {
          name: 'photoGallery',
          type: 'array',
          label: 'Photo Gallery',
          fields: [
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'caption',
              type: 'text',
            },
          ],
        },
        {
          name: 'audioFiles',
          type: 'array',
          label: 'Audio Files',
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'audioFile',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Schedule & Timing (for prayers, classes, etc.)
    // ============================================================================
    {
      name: 'schedule',
      type: 'group',
      label: 'Service Schedule',
      fields: [
        {
          name: 'hasSchedule',
          type: 'checkbox',
          defaultValue: false,
          label: 'Has Regular Schedule',
        },
        {
          name: 'scheduleType',
          type: 'select',
          options: [
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Seasonal (Ramadan, etc.)', value: 'seasonal' },
            { label: 'On Request', value: 'on-request' },
          ],
          admin: {
            condition: (data, siblingData) => siblingData?.hasSchedule,
          },
        },
        {
          name: 'scheduleText',
          type: 'textarea',
          label: 'Schedule Description',
          admin: {
            description: 'e.g., "Every Friday at 1:00 PM", "Daily after Fajr"',
            condition: (data, siblingData) => siblingData?.hasSchedule,
          },
        },
        {
          name: 'regularTimes',
          type: 'array',
          label: 'Regular Times/Jamaah',
          admin: {
            condition: (data, siblingData) => siblingData?.hasSchedule,
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              admin: {
                description: 'e.g., "1ST JAMAAH", "2ND JAMAAH", "Maghrib"',
              },
            },
            {
              name: 'time',
              type: 'text',
              label: 'Time',
              admin: {
                description: 'e.g., "07:00", "8:30"',
              },
            },
            {
              name: 'description',
              type: 'text',
              label: 'Additional Info',
              admin: {
                description: 'e.g., "Main Hall", "Muhammad Asad Building"',
              },
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Special Features for Taraweeh & Eid
    // ============================================================================
    {
      name: 'taraweehEid',
      type: 'group',
      label: 'Taraweeh & Eid Features',
      admin: {
        condition: data => data?.serviceType === 'taraweeh-eid',
      },
      fields: [
        {
          name: 'enableCountdown',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show Countdown Timer',
        },
        {
          name: 'countdownTargetDate',
          type: 'date',
          label: 'Countdown Target Date',
          admin: {
            condition: (data, siblingData) => siblingData?.enableCountdown,
          },
        },
        {
          name: 'enableLiveStream',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Live Taraweeh Streaming',
        },
        {
          name: 'liveStreamUrl',
          type: 'text',
          label: 'Live Stream URL',
          admin: {
            condition: (data, siblingData) => siblingData?.enableLiveStream,
          },
        },
        {
          name: 'liveStreamInstructions',
          type: 'textarea',
          label: 'Streaming Instructions',
          admin: {
            description: 'How to watch the stream (join chat room, etc.)',
            condition: (data, siblingData) => siblingData?.enableLiveStream,
          },
        },
        {
          name: 'eidScheduleTitle',
          type: 'text',
          defaultValue: 'Eid Salah Schedule at Masjid Al-Falah',
          label: 'Eid Schedule Title',
        },
        {
          name: 'eidNote',
          type: 'richText',
          label: 'Eid Note/Message',
          admin: {
            description: 'Special message about Eid celebration',
          },
        },
      ],
    },

    // ============================================================================
    // Marriage/Nikaah Specific Features
    // ============================================================================
    {
      name: 'nikaah',
      type: 'group',
      label: 'Nikaah Marriage Features',
      admin: {
        condition: data => data?.serviceType === 'nikaah',
      },
      fields: [
        {
          name: 'requirements',
          type: 'array',
          label: 'Marriage Requirements/Steps',
          admin: {
            description: 'Numbered requirements or process steps',
          },
          fields: [
            {
              name: 'stepNumber',
              type: 'number',
              label: 'Step Number',
            },
            {
              name: 'title',
              type: 'text',
              label: 'Requirement Title',
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Description',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Step Image (Optional)',
            },
          ],
        },
        {
          name: 'registrationInstructions',
          type: 'richText',
          label: 'How to Register',
        },
      ],
    },

    // ============================================================================
    // Registration & Contact
    // ============================================================================
    {
      name: 'registration',
      type: 'group',
      label: 'Registration & Contact',
      fields: [
        {
          name: 'enableRegistration',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Registration',
        },
        {
          name: 'registrationButtonText',
          type: 'text',
          defaultValue: 'Register your Interest',
          label: 'Registration Button Text',
          admin: {
            condition: (data, siblingData) => siblingData?.enableRegistration,
          },
        },
        {
          name: 'registrationUrl',
          type: 'text',
          label: 'External Registration URL',
          admin: {
            description: 'Link to external form or page',
            condition: (data, siblingData) => siblingData?.enableRegistration,
          },
        },
        {
          name: 'contactPerson',
          type: 'text',
          label: 'Contact Person',
        },
        {
          name: 'contactEmail',
          type: 'email',
          label: 'Contact Email',
        },
        {
          name: 'contactPhone',
          type: 'text',
          label: 'Contact Phone',
        },
      ],
    },

    // ============================================================================
    // Email Notifications (for Taraweeh, etc.)
    // ============================================================================
    {
      name: 'notifications',
      type: 'group',
      label: 'Prayer Reminders & Notifications',
      admin: {
        description: 'Email signup for reminders and updates',
      },
      fields: [
        {
          name: 'enableNotifications',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Email Signup',
        },
        {
          name: 'notificationTitle',
          type: 'text',
          defaultValue: 'Prayer Reminders & Notifications',
          label: 'Section Title',
          admin: {
            condition: (data, siblingData) => siblingData?.enableNotifications,
          },
        },
        {
          name: 'notificationDescription',
          type: 'textarea',
          label: 'Description',
          admin: {
            description: 'What users will receive',
            condition: (data, siblingData) => siblingData?.enableNotifications,
          },
        },
      ],
    },

    // ============================================================================
    // Venue Information
    // ============================================================================
    {
      name: 'venue',
      type: 'group',
      label: 'Venue Information',
      fields: [
        {
          name: 'hasVenue',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Venue Details',
        },
        {
          name: 'venueName',
          type: 'text',
          label: 'Venue Name',
          admin: {
            condition: (data, siblingData) => siblingData?.hasVenue,
          },
        },
        {
          name: 'fullAddress',
          type: 'textarea',
          label: 'Full Address',
          admin: {
            condition: (data, siblingData) => siblingData?.hasVenue,
          },
        },
        {
          name: 'coordinates',
          type: 'group',
          label: 'Map Coordinates',
          admin: {
            condition: (data, siblingData) => siblingData?.hasVenue,
          },
          fields: [
            {
              name: 'latitude',
              type: 'number',
            },
            {
              name: 'longitude',
              type: 'number',
            },
          ],
        },
        {
          name: 'googleMapsLink',
          type: 'text',
          label: 'Google Maps Link',
          admin: {
            condition: (data, siblingData) => siblingData?.hasVenue,
          },
        },
      ],
    },

    // ============================================================================
    // Donations
    // ============================================================================
    {
      name: 'donation',
      type: 'group',
      label: 'Donation Settings',
      fields: [
        {
          name: 'enableDonations',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Donations',
        },
        {
          name: 'donationTitle',
          type: 'text',
          defaultValue: 'Donate to Masjid Al Falah',
          label: 'Donation Section Title',
          admin: {
            condition: (data, siblingData) => siblingData?.enableDonations,
          },
        },
        {
          name: 'donationDescription',
          type: 'textarea',
          label: 'Donation Description',
          admin: {
            description: 'Brief text (40 words max)',
            condition: (data, siblingData) => siblingData?.enableDonations,
          },
        },
        {
          name: 'suggestedAmounts',
          type: 'array',
          label: 'Suggested Amounts',
          admin: {
            condition: (data, siblingData) => siblingData?.enableDonations,
          },
          fields: [
            {
              name: 'amount',
              type: 'number',
              required: true,
              label: 'Amount (£)',
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Testimonials & Quotes
    // ============================================================================
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials & Quotes',
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          label: 'Quote Text',
        },
        {
          name: 'author',
          type: 'text',
          label: 'Author Name',
        },
        {
          name: 'authorTitle',
          type: 'text',
          label: 'Author Title/Role',
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Photo',
        },
      ],
    },

    // ============================================================================
    // Educational Content & Resources
    // ============================================================================
    {
      name: 'resources',
      type: 'group',
      label: 'Educational Resources',
      fields: [
        {
          name: 'hasResources',
          type: 'checkbox',
          defaultValue: false,
          label: 'Include Resources Section',
        },
        {
          name: 'resourcesList',
          type: 'array',
          label: 'Resources',
          admin: {
            condition: (data, siblingData) => siblingData?.hasResources,
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'richText',
            },
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
              label: 'Download File (PDF, etc.)',
            },
            {
              name: 'externalLink',
              type: 'text',
              label: 'External Link',
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Call-to-Action Buttons
    // ============================================================================
    {
      name: 'callToActions',
      type: 'array',
      label: 'Call-to-Action Buttons',
      maxRows: 3,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Button Text',
          admin: {
            description: 'e.g., "Check Eid Salah Schedule", "Learn More"',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Button URL',
        },
        {
          name: 'style',
          type: 'select',
          options: [
            { label: 'Primary (Blue)', value: 'primary' },
            { label: 'Secondary (White)', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
          defaultValue: 'primary',
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon Name (Optional)',
          admin: {
            description: 'React Icons name or emoji',
          },
        },
      ],
    },

    // ============================================================================
    // Related Services & Links
    // ============================================================================
    {
      name: 'relatedServices',
      type: 'relationship',
      // @ts-expect-error - Collection slug will be valid after types regeneration
      relationTo: 'services',
      hasMany: true,
      label: 'Related Services',
      admin: {
        description: 'Other services users might be interested in',
      },
    },

    // ============================================================================
    // SEO & Meta
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
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
        },
        {
          name: 'keywords',
          type: 'array',
          label: 'Keywords',
          fields: [
            {
              name: 'keyword',
              type: 'text',
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Display Settings
    // ============================================================================
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        description: 'Order in which services appear (lower numbers first)',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Service',
      admin: {
        description: 'Highlight this service on homepage',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Show this service on the website',
      },
    },
  ],
};
