import type { CollectionConfig } from 'payload';

export const DonationAppeals: CollectionConfig = {
  slug: 'donation-appeals',
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'targetAmount',
      'currentAmount',
      'endDate',
      'isActive',
    ],
    description: 'Comprehensive fundraising campaigns and donation appeals',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ============================================================================
    // Basic Campaign Information
    // ============================================================================
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Campaign Title',
      admin: {
        description: 'e.g., "Help Build a Lasting Legacy"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'e.g., "help-build-lasting-legacy"',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      label: 'Hero Description',
      admin: {
        description: 'Short description shown in hero section',
      },
    },

    // ============================================================================
    // Fundraising Goals & Progress
    // ============================================================================
    {
      name: 'funding',
      type: 'group',
      label: 'Fundraising Goals',
      fields: [
        {
          name: 'targetAmount',
          type: 'number',
          required: true,
          label: 'Target Amount (£)',
          admin: {
            description: 'Fundraising goal in British Pounds',
          },
        },
        {
          name: 'currentAmount',
          type: 'number',
          required: true,
          defaultValue: 0,
          label: 'Current Amount Raised (£)',
        },
        {
          name: 'totalDonors',
          type: 'number',
          defaultValue: 0,
          label: 'Total Number of Donors',
        },
        {
          name: 'monthlyGoal',
          type: 'number',
          label: 'Monthly Target (£)',
          admin: {
            description: 'For recurring donation campaigns',
          },
        },
      ],
    },

    // ============================================================================
    // Campaign Timeline
    // ============================================================================
    {
      name: 'timeline',
      type: 'group',
      label: 'Campaign Timeline',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          label: 'Campaign Start Date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'Campaign End Date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            description: 'Leave blank for ongoing campaigns',
          },
        },
        {
          name: 'showCountdown',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Days Left" Countdown',
        },
      ],
    },

    // ============================================================================
    // Quick Donation Stats Bar (£250, 10 Donors, £1000, 26 Days)
    // ============================================================================
    {
      name: 'statsDisplay',
      type: 'group',
      label: 'Stats Bar Display',
      admin: {
        description: 'Quick stats shown in hero section',
      },
      fields: [
        {
          name: 'showStatsBar',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Stats Bar',
        },
        {
          name: 'statsToShow',
          type: 'array',
          label: 'Stats to Display',
          admin: {
            condition: (data, siblingData) => siblingData?.showStatsBar,
          },
          fields: [
            {
              name: 'statType',
              type: 'select',
              options: [
                { label: 'Current Amount Raised', value: 'current-amount' },
                { label: 'Total Donors', value: 'donors' },
                { label: 'Target Amount', value: 'target' },
                { label: 'Days Left', value: 'days-left' },
                { label: 'Custom Stat', value: 'custom' },
              ],
            },
            {
              name: 'customLabel',
              type: 'text',
              label: 'Custom Label',
              admin: {
                condition: (data, siblingData) =>
                  siblingData?.statType === 'custom',
              },
            },
            {
              name: 'customValue',
              type: 'text',
              label: 'Custom Value',
              admin: {
                condition: (data, siblingData) =>
                  siblingData?.statType === 'custom',
              },
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Hero Media
    // ============================================================================
    {
      name: 'heroMedia',
      type: 'group',
      label: 'Hero Section Media',
      fields: [
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Hero Image/Video Thumbnail',
        },
        {
          name: 'heroVideoUrl',
          type: 'text',
          label: 'Hero Video URL',
          admin: {
            description: 'YouTube or Vimeo URL',
          },
        },
      ],
    },

    // ============================================================================
    // Donation Options
    // ============================================================================
    {
      name: 'donationOptions',
      type: 'group',
      label: 'Donation Options',
      fields: [
        {
          name: 'enableOneTime',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable One-Time Donations',
        },
        {
          name: 'enableMonthly',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Monthly Donations',
        },
        {
          name: 'quickAmounts',
          type: 'array',
          label: 'Quick Donation Amounts',
          admin: {
            description:
              'Suggested amounts shown as buttons (e.g., £10, £25, £50)',
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
        {
          name: 'allowCustomAmount',
          type: 'checkbox',
          defaultValue: true,
          label: 'Allow Custom Amount',
        },
        {
          name: 'minimumDonation',
          type: 'number',
          defaultValue: 1,
          label: 'Minimum Donation Amount (£)',
        },
      ],
    },

    // ============================================================================
    // "Why Your Support Matters" Section
    // ============================================================================
    {
      name: 'whyMatters',
      type: 'group',
      label: 'Why Your Support Matters',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Why Your Support Matters" Section',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Why Your Support Matters',
          label: 'Section Title',
          admin: {
            condition: (data, siblingData) => siblingData?.enableSection,
          },
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Content',
          admin: {
            description: 'Explain why this campaign is important',
            condition: (data, siblingData) => siblingData?.enableSection,
          },
        },
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Featured Image',
          admin: {
            description: 'Large image for this section (e.g., prayer hall)',
            condition: (data, siblingData) => siblingData?.enableSection,
          },
        },
      ],
    },

    // ============================================================================
    // Donation Impact Gallery
    // ============================================================================
    {
      name: 'impactGallery',
      type: 'group',
      label: 'Donation Impact Gallery',
      fields: [
        {
          name: 'enableGallery',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Impact Gallery',
        },
        {
          name: 'galleryTitle',
          type: 'text',
          defaultValue: 'Donation Impact Gallery',
          label: 'Gallery Title',
          admin: {
            condition: (data, siblingData) => siblingData?.enableGallery,
          },
        },
        {
          name: 'galleryDescription',
          type: 'textarea',
          label: 'Gallery Description',
          admin: {
            description: 'Text shown above gallery',
            condition: (data, siblingData) => siblingData?.enableGallery,
          },
        },
        {
          name: 'images',
          type: 'array',
          label: 'Gallery Images',
          admin: {
            description:
              'Photos showing impact of donations (6-8 images recommended)',
            condition: (data, siblingData) => siblingData?.enableGallery,
          },
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
            {
              name: 'altText',
              type: 'text',
              label: 'Alt Text',
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Ways to Give Section
    // ============================================================================
    {
      name: 'waysToGive',
      type: 'group',
      label: 'Ways to Give',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Ways to Give" Section',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Ways to Give',
          label: 'Section Title',
          admin: {
            condition: (data, siblingData) => siblingData?.enableSection,
          },
        },
        {
          name: 'sectionDescription',
          type: 'textarea',
          label: 'Section Description',
          admin: {
            description: 'Optional subtitle text',
            condition: (data, siblingData) => siblingData?.enableSection,
          },
        },
        {
          name: 'sectionImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Section Featured Image',
          admin: {
            description: 'Image on left side (mosque building)',
            condition: (data, siblingData) => siblingData?.enableSection,
          },
        },
        {
          name: 'givingMethods',
          type: 'array',
          label: 'Giving Methods',
          admin: {
            description: 'Different ways people can donate',
            condition: (data, siblingData) => siblingData?.enableSection,
          },
          fields: [
            {
              name: 'methodName',
              type: 'text',
              required: true,
              label: 'Method Name',
              admin: {
                description:
                  'e.g., "One-Time Donation", "Easy Funds", "Monthly Sadaqah"',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icon Name',
              admin: {
                description: 'React Icons name or emoji',
              },
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link URL',
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
          admin: {
            description: 'e.g., Hadith or supporter testimonial',
          },
        },
        {
          name: 'author',
          type: 'text',
          label: 'Author Name',
          admin: {
            description: 'e.g., "Prophet Muhammad ﷺ"',
          },
        },
        {
          name: 'source',
          type: 'text',
          label: 'Source/Reference',
          admin: {
            description: 'e.g., "Sahih Bukhari"',
          },
        },
        {
          name: 'authorPhoto',
          type: 'upload',
          relationTo: 'media',
          label: 'Author Photo (Optional)',
        },
      ],
    },

    // ============================================================================
    // Donation Form Fields
    // ============================================================================
    {
      name: 'donationForm',
      type: 'group',
      label: 'Donation Form Settings',
      fields: [
        {
          name: 'collectAddress',
          type: 'checkbox',
          defaultValue: true,
          label: 'Collect Donor Address',
        },
        {
          name: 'collectPhone',
          type: 'checkbox',
          defaultValue: true,
          label: 'Collect Phone Number',
        },
        {
          name: 'allowAnonymous',
          type: 'checkbox',
          defaultValue: true,
          label: 'Allow Anonymous Donations',
        },
        {
          name: 'showGiftAid',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Gift Aid Option (UK Tax Relief)',
        },
        {
          name: 'customFields',
          type: 'array',
          label: 'Custom Form Fields',
          fields: [
            {
              name: 'fieldLabel',
              type: 'text',
              required: true,
            },
            {
              name: 'fieldType',
              type: 'select',
              options: [
                { label: 'Text', value: 'text' },
                { label: 'Textarea', value: 'textarea' },
                { label: 'Checkbox', value: 'checkbox' },
                { label: 'Select', value: 'select' },
              ],
              defaultValue: 'text',
            },
            {
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Payment Integration
    // ============================================================================
    {
      name: 'payment',
      type: 'group',
      label: 'Payment Settings',
      fields: [
        {
          name: 'paymentProcessor',
          type: 'select',
          options: [
            { label: 'Stripe', value: 'stripe' },
            { label: 'PayPal', value: 'paypal' },
            { label: 'JustGiving', value: 'justgiving' },
            { label: 'LaunchGood', value: 'launchgood' },
            { label: 'Custom', value: 'custom' },
          ],
          defaultValue: 'stripe',
          label: 'Payment Processor',
        },
        {
          name: 'donationPageUrl',
          type: 'text',
          label: 'External Donation Page URL',
          admin: {
            description: 'If using external platform (JustGiving, etc.)',
          },
        },
        {
          name: 'allowedCurrencies',
          type: 'array',
          label: 'Allowed Currencies',
          fields: [
            {
              name: 'currency',
              type: 'select',
              options: [
                { label: 'GBP (£)', value: 'GBP' },
                { label: 'USD ($)', value: 'USD' },
                { label: 'EUR (€)', value: 'EUR' },
                { label: 'AED', value: 'AED' },
              ],
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Campaign Categories & Tags
    // ============================================================================
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'General Donation', value: 'general' },
        { label: 'Masjid Development', value: 'development' },
        { label: 'Building Fund', value: 'building' },
        { label: 'Education', value: 'education' },
        { label: 'Community Services', value: 'community' },
        { label: 'Zakat', value: 'zakat' },
        { label: 'Sadaqah', value: 'sadaqah' },
        { label: 'Sadaqah Jariyah', value: 'sadaqah-jariyah' },
        { label: 'Emergency Relief', value: 'emergency' },
        { label: 'Ramadan Campaign', value: 'ramadan' },
        { label: 'Qurbani', value: 'qurbani' },
      ],
      defaultValue: 'general',
      label: 'Appeal Category',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Campaign Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },

    // ============================================================================
    // Email Notifications
    // ============================================================================
    {
      name: 'emailSettings',
      type: 'group',
      label: 'Email Notifications',
      fields: [
        {
          name: 'sendDonorReceipt',
          type: 'checkbox',
          defaultValue: true,
          label: 'Send Donation Receipt Email',
        },
        {
          name: 'sendThankYou',
          type: 'checkbox',
          defaultValue: true,
          label: 'Send Thank You Email',
        },
        {
          name: 'customThankYouMessage',
          type: 'richText',
          label: 'Custom Thank You Message',
          admin: {
            condition: (data, siblingData) => siblingData?.sendThankYou,
          },
        },
        {
          name: 'notificationEmails',
          type: 'array',
          label: 'Admin Notification Emails',
          admin: {
            description: 'Emails to notify when donations are received',
          },
          fields: [
            {
              name: 'email',
              type: 'email',
              required: true,
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Social Sharing
    // ============================================================================
    {
      name: 'socialSharing',
      type: 'group',
      label: 'Social Sharing',
      fields: [
        {
          name: 'enableSharing',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Social Sharing',
        },
        {
          name: 'shareTitle',
          type: 'text',
          label: 'Share Title',
          admin: {
            description: 'Custom title for social media shares',
            condition: (data, siblingData) => siblingData?.enableSharing,
          },
        },
        {
          name: 'shareDescription',
          type: 'textarea',
          label: 'Share Description',
          admin: {
            condition: (data, siblingData) => siblingData?.enableSharing,
          },
        },
        {
          name: 'shareImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Social Share Image',
          admin: {
            condition: (data, siblingData) => siblingData?.enableSharing,
          },
        },
      ],
    },

    // ============================================================================
    // Call-to-Action Buttons
    // ============================================================================
    {
      name: 'cta',
      type: 'group',
      label: 'Call-to-Action Buttons',
      fields: [
        {
          name: 'primaryButtonText',
          type: 'text',
          defaultValue: 'Donate Now',
          label: 'Primary Button Text',
        },
        {
          name: 'secondaryButtonText',
          type: 'text',
          defaultValue: 'Share this page',
          label: 'Secondary Button Text',
        },
        {
          name: 'additionalButtons',
          type: 'array',
          label: 'Additional CTA Buttons',
          maxRows: 2,
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
              defaultValue: 'secondary',
            },
          ],
        },
      ],
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
    // Publishing & Display
    // ============================================================================
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Campaign',
      admin: {
        description: 'Show prominently on homepage and appeals page',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active Campaign',
      admin: {
        description: 'Deactivate when campaign is complete',
      },
    },
    {
      name: 'isUrgent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Urgent Appeal',
      admin: {
        description: 'Shows "Urgent" badge',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        description: 'Lower numbers appear first',
      },
    },
  ],
};
