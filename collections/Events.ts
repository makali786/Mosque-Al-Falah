import type { CollectionConfig } from 'payload';

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'startDate',
      'endDate',
      'isPublished',
      'isFeatured',
    ],
    description:
      'Comprehensive event management with booking, donations, and media',
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
      label: 'Event Title',
      admin: {
        description: 'Main event title (e.g., "Quran: A Path to Paradise")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description:
          'URL-friendly version of title (e.g., "quran-path-to-paradise")',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Event Subtitle',
      admin: {
        description: 'Short tagline (e.g., "an uplifting event for all!")',
      },
    },

    // ============================================================================
    // Date & Time
    // ============================================================================
    {
      name: 'timing',
      type: 'group',
      label: 'Event Timing',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          label: 'Start Date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          required: true,
          label: 'End Date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'timezone',
          type: 'select',
          defaultValue: 'Europe/London',
          options: [
            { label: 'London (GMT/BST)', value: 'Europe/London' },
            { label: 'New York (EST/EDT)', value: 'America/New_York' },
            { label: 'Dubai (GST)', value: 'Asia/Dubai' },
          ],
        },
      ],
    },

    // ============================================================================
    // Platform & Format
    // ============================================================================
    {
      name: 'platforms',
      type: 'array',
      label: 'Event Platforms',
      admin: {
        description: 'Where attendees can join (in-person, online, etc.)',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'In-person', value: 'in-person' },
            { label: 'Zoom', value: 'zoom' },
            { label: 'eMasjid Live', value: 'emasjid-live' },
            { label: 'YouTube Live', value: 'youtube-live' },
            { label: 'Facebook Live', value: 'facebook-live' },
          ],
        },
        {
          name: 'link',
          type: 'text',
          label: 'Platform Link',
          admin: {
            description: 'Zoom link, YouTube URL, etc.',
          },
        },
      ],
    },

    // ============================================================================
    // Location Details
    // ============================================================================
    {
      name: 'venue',
      type: 'group',
      label: 'Venue Information',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Venue Name',
          admin: {
            description: 'e.g., "London Muslim Centre, Ground Floor Hall"',
          },
        },
        {
          name: 'fullAddress',
          type: 'textarea',
          label: 'Full Address',
          admin: {
            description: 'Complete address with postcode',
          },
        },
        {
          name: 'coordinates',
          type: 'group',
          label: 'Map Coordinates (Optional)',
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
        },
      ],
    },

    // ============================================================================
    // Speaker/Imam Information
    // ============================================================================
    {
      name: 'speakers',
      type: 'array',
      label: 'Speakers',
      fields: [
        {
          name: 'speakerType',
          type: 'select',
          options: [
            { label: 'From Imams Collection', value: 'imam' },
            { label: 'Guest Speaker', value: 'guest' },
          ],
          defaultValue: 'guest',
        },
        {
          name: 'imam',
          type: 'relationship',
          // @ts-expect-error - Collection slug will be valid after types regeneration
          relationTo: 'imams',
          label: 'Select Imam',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.speakerType === 'imam',
          },
        },
        {
          name: 'guestSpeaker',
          type: 'group',
          label: 'Guest Speaker Details',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.speakerType === 'guest',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Speaker Name',
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title/Role',
              admin: {
                description: 'e.g., "Imam", "Sheikh", "Guest Reciter"',
              },
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              label: 'Speaker Photo',
            },
            {
              name: 'bio',
              type: 'richText',
              label: 'Biography',
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Event Content
    // ============================================================================
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Event Description',
      admin: {
        description: 'Full event description/details',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Short Description',
      admin: {
        description:
          'Brief summary for cards and previews (max 200 characters)',
      },
    },

    // ============================================================================
    // Media Assets
    // ============================================================================
    {
      name: 'media',
      type: 'group',
      label: 'Event Media',
      fields: [
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Featured Event Poster',
          admin: {
            description: 'Main event poster/banner image',
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: 'Live Stream / Video URL',
          admin: {
            description: 'YouTube, Vimeo, or custom stream URL',
          },
        },
        {
          name: 'isLive',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show "Live" Indicator',
        },
        {
          name: 'photos',
          type: 'array',
          label: 'Event Photos',
          fields: [
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          name: 'audioRecordings',
          type: 'array',
          label: 'Audio Recordings',
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
    // Registration & Booking
    // ============================================================================
    {
      name: 'registration',
      type: 'group',
      label: 'Event Registration',
      fields: [
        {
          name: 'enableRegistration',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Registration',
        },
        {
          name: 'registrationType',
          type: 'select',
          options: [
            { label: 'Free Event', value: 'free' },
            { label: 'Paid Event', value: 'paid' },
            { label: 'Donation-based', value: 'donation' },
          ],
          defaultValue: 'free',
        },
        {
          name: 'ticketPrice',
          type: 'number',
          label: 'Ticket Price (£)',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.registrationType === 'paid',
          },
        },
        {
          name: 'maxAttendees',
          type: 'number',
          label: 'Maximum Attendees',
          admin: {
            description: 'Leave blank for unlimited',
          },
        },
        {
          name: 'currentRegistrations',
          type: 'number',
          defaultValue: 0,
          label: 'Current Registrations',
          admin: {
            description: 'Auto-increments with each booking',
          },
        },
        {
          name: 'registrationDeadline',
          type: 'date',
          label: 'Registration Deadline',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'externalBookingUrl',
          type: 'text',
          label: 'External Booking URL',
          admin: {
            description: 'If using external booking system (Eventbrite, etc.)',
          },
        },
      ],
    },

    // ============================================================================
    // Donation Settings
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
          label: 'Donation Section Title',
          defaultValue: 'Donate to Masjid Al Falah',
        },
        {
          name: 'donationDescription',
          type: 'textarea',
          label: 'Donation Description',
          admin: {
            description: 'Short text explaining the donation (max 40 words)',
          },
        },
        {
          name: 'suggestedAmounts',
          type: 'array',
          label: 'Suggested Donation Amounts',
          fields: [
            {
              name: 'amount',
              type: 'number',
              required: true,
              label: 'Amount (£)',
            },
          ],
        },
        {
          name: 'allowCustomAmount',
          type: 'checkbox',
          defaultValue: true,
          label: 'Allow Custom Amount',
        },
      ],
    },

    // ============================================================================
    // Additional Settings
    // ============================================================================
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Lecture', value: 'lecture' },
        { label: 'Jummah', value: 'jummah' },
        { label: 'Ramadan', value: 'ramadan' },
        { label: 'Youth Program', value: 'youth' },
        { label: 'Community Event', value: 'community' },
        { label: 'Educational', value: 'educational' },
        { label: 'Fundraising', value: 'fundraising' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'lecture',
      label: 'Event Category',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Event Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'relatedEvents',
      type: 'relationship',
      // @ts-expect-error - Collection slug will be valid after types regeneration
      relationTo: 'events',
      hasMany: true,
      label: 'Related Events',
    },

    // ============================================================================
    // SEO & Sharing
    // ============================================================================
    {
      name: 'seo',
      type: 'group',
      label: 'SEO & Social Sharing',
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
          name: 'shareImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Social Share Image',
        },
      ],
    },

    // ============================================================================
    // Publishing Controls
    // ============================================================================
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Event',
      admin: {
        description: 'Show prominently on homepage and event pages',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: true,
      label: 'Published',
    },
    {
      name: 'publishDate',
      type: 'date',
      label: 'Publish Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Schedule event to be published at a specific time',
      },
    },
  ],
};
