import type { GlobalConfig } from 'payload';

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  admin: {
    description: 'Manage all content and settings for the homepage',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ============================================================================
    // Hero/Banner Section
    // ============================================================================
    {
      name: 'hero',
      type: 'group',
      label: 'Hero/Banner Section',
      fields: [
        {
          name: 'enableHero',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Hero Section',
        },
        {
          name: 'heroSource',
          type: 'select',
          options: [
            { label: 'Use Banners Collection (Carousel)', value: 'collection' },
            { label: 'Use Custom Content Below', value: 'custom' },
          ],
          defaultValue: 'collection',
          label: 'Hero Content Source',
        },
        {
          name: 'customHero',
          type: 'group',
          label: 'Custom Hero Content',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.heroSource === 'custom',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Welcome to Masjid Al-Falah',
              label: 'Hero Title',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Hero Description',
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Image',
            },
            {
              name: 'primaryButton',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  defaultValue: 'Learn More',
                },
                {
                  name: 'url',
                  type: 'text',
                  defaultValue: '/about-us',
                },
              ],
            },
            {
              name: 'secondaryButton',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  defaultValue: 'Donate',
                },
                {
                  name: 'url',
                  type: 'text',
                  defaultValue: '/appeals',
                },
              ],
            },
          ],
        },
        {
          name: 'showCarouselDots',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Carousel Navigation Dots',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.heroSource === 'collection',
          },
        },
        {
          name: 'autoplayCarousel',
          type: 'checkbox',
          defaultValue: true,
          label: 'Auto-play Carousel',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.heroSource === 'collection',
          },
        },
      ],
    },

    // ============================================================================
    // Section Order & Visibility
    // ============================================================================
    {
      name: 'sectionOrder',
      type: 'array',
      label: 'Homepage Section Order',
      admin: {
        description: 'Drag to reorder sections on the homepage',
      },
      fields: [
        {
          name: 'section',
          type: 'select',
          required: true,
          options: [
            { label: 'Upcoming Events', value: 'upcomingEvents' },
            { label: 'Notice Board', value: 'noticeBoard' },
            { label: 'Services Carousel', value: 'services' },
            { label: 'Meet Our Imams', value: 'imams' },
            { label: 'Ayat of the Month', value: 'ayat' },
            { label: 'Featured Sermons', value: 'sermons' },
            { label: 'Donation Appeal', value: 'donationAppeal' },
          ],
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show This Section',
        },
      ],
    },

    // ============================================================================
    // Upcoming Events Section
    // ============================================================================
    {
      name: 'upcomingEvents',
      type: 'group',
      label: 'Upcoming Events Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Upcoming Events',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Upcoming Events',
          label: 'Section Title',
        },
        {
          name: 'viewAllText',
          type: 'text',
          defaultValue: 'See All →',
          label: '"View All" Link Text',
        },
        {
          name: 'viewAllUrl',
          type: 'text',
          defaultValue: '/events',
          label: '"View All" Link URL',
        },
        {
          name: 'eventsToShow',
          type: 'number',
          defaultValue: 4,
          label: 'Number of Events to Display',
          admin: {
            description: 'How many upcoming events to show',
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
          defaultValue: '2',
          label: 'Grid Layout',
        },
        {
          name: 'showEventVideo',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Video Play Buttons',
        },
      ],
    },

    // ============================================================================
    // Notice Board Section
    // ============================================================================
    {
      name: 'noticeBoard',
      type: 'group',
      label: 'Notice Board Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Notice Board',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Notice Board',
          label: 'Section Title',
        },
        {
          name: 'noticesToShow',
          type: 'number',
          defaultValue: 4,
          label: 'Number of Notices to Display',
        },
        {
          name: 'showNoticeLabels',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Notice Type Labels (Admin, Imam, etc.)',
        },
        {
          name: 'showNoticeDates',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Notice Dates',
        },
      ],
    },

    // ============================================================================
    // Services Section (Experience. Connect. Grow)
    // ============================================================================
    {
      name: 'servicesSection',
      type: 'group',
      label: 'Services Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Services Section',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Experience. Connect. Grow',
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'Join us in explore your faith through various services and devotion.',
          label: 'Section Description',
        },
        {
          name: 'viewAllButton',
          type: 'group',
          label: 'View All Button',
          fields: [
            {
              name: 'text',
              type: 'text',
              defaultValue: 'View All Services',
              label: 'Button Text',
            },
            {
              name: 'url',
              type: 'text',
              defaultValue: '/services',
              label: 'Button URL',
            },
          ],
        },
        {
          name: 'displayMode',
          type: 'select',
          options: [
            { label: 'All Active Services', value: 'all-active' },
            { label: 'Featured Services Only', value: 'featured' },
            { label: 'Selected Services', value: 'selected' },
          ],
          defaultValue: 'featured',
          label: 'Which Services to Display',
        },
        {
          name: 'selectedServices',
          type: 'relationship',
          // @ts-expect-error - Collection slug will be valid after types regeneration
          relationTo: 'services',
          hasMany: true,
          label: 'Selected Services',
          admin: {
            description: 'Choose specific services to show',
            condition: (data, siblingData) =>
              siblingData?.displayMode === 'selected',
          },
        },
        {
          name: 'carouselSettings',
          type: 'group',
          label: 'Carousel Settings',
          fields: [
            {
              name: 'showArrows',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show Navigation Arrows',
            },
            {
              name: 'autoplay',
              type: 'checkbox',
              defaultValue: false,
              label: 'Auto-play Carousel',
            },
            {
              name: 'itemsToShow',
              type: 'number',
              defaultValue: 5,
              label: 'Items to Show at Once',
            },
          ],
        },
        {
          name: 'backgroundColor',
          type: 'select',
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Dark', value: 'dark' },
            { label: 'White', value: 'white' },
          ],
          defaultValue: 'blue',
          label: 'Section Background Color',
        },
      ],
    },

    // ============================================================================
    // Meet Our Imams Section
    // ============================================================================
    {
      name: 'imamsSection',
      type: 'group',
      label: 'Meet Our Imams Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Imams Section',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Meet Our Imams',
          label: 'Section Title',
        },
        {
          name: 'displayMode',
          type: 'select',
          options: [
            { label: 'All Imams', value: 'all' },
            { label: 'Featured Imams Only', value: 'featured' },
            { label: 'Selected Imams', value: 'selected' },
          ],
          defaultValue: 'featured',
          label: 'Which Imams to Display',
        },
        {
          name: 'selectedImams',
          type: 'relationship',
          // @ts-expect-error - Collection slug will be valid after types regeneration
          relationTo: 'imams',
          hasMany: true,
          label: 'Selected Imams',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.displayMode === 'selected',
          },
        },
        {
          name: 'showBio',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Imam Bios on Cards',
        },
        {
          name: 'showContactButton',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Ask Imam" Button',
        },
        {
          name: 'contactButtonText',
          type: 'text',
          defaultValue: 'Ask Imam',
          label: 'Contact Button Text',
          admin: {
            condition: (data, siblingData) => siblingData?.showContactButton,
          },
        },
      ],
    },

    // ============================================================================
    // Ayat of the Month Section
    // ============================================================================
    {
      name: 'ayatSection',
      type: 'group',
      label: 'Ayat of the Month Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Ayat of the Month',
        },
        {
          name: 'sectionLabel',
          type: 'text',
          defaultValue: 'AYAT OF THE MONTH',
          label: 'Section Label',
        },
        {
          name: 'readMoreButtonText',
          type: 'text',
          defaultValue: 'Read More',
          label: 'Read More Button Text',
        },
        {
          name: 'showAudio',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Audio Player',
        },
        {
          name: 'showVideo',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Video Player',
        },
        {
          name: 'showSocialShare',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Social Share Buttons',
        },
        {
          name: 'backgroundColor',
          type: 'select',
          options: [
            { label: 'Dark/Night', value: 'dark' },
            { label: 'Blue', value: 'blue' },
            { label: 'White', value: 'white' },
          ],
          defaultValue: 'dark',
          label: 'Section Background',
        },
      ],
    },

    // ============================================================================
    // Featured Sermons Section
    // ============================================================================
    {
      name: 'sermonsSection',
      type: 'group',
      label: 'Featured Sermons Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Sermons Section',
        },
        {
          name: 'sectionSubtitle',
          type: 'text',
          defaultValue: 'POWERFUL & LIFE-CHANGING',
          label: 'Section Subtitle',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Featured Sermons and Lectures',
          label: 'Section Title',
        },
        {
          name: 'discoverMoreText',
          type: 'text',
          defaultValue: 'Discover More',
          label: '"Discover More" Link Text',
        },
        {
          name: 'discoverMoreUrl',
          type: 'text',
          defaultValue: '/sermons',
          label: '"Discover More" URL',
        },
        {
          name: 'sermonsToShow',
          type: 'number',
          defaultValue: 3,
          label: 'Number of Sermons to Display',
        },
        {
          name: 'displayMode',
          type: 'select',
          options: [
            { label: 'Latest Sermons', value: 'latest' },
            { label: 'Featured Sermons', value: 'featured' },
            { label: 'Selected Sermons', value: 'selected' },
          ],
          defaultValue: 'featured',
          label: 'Which Sermons to Display',
        },
        {
          name: 'selectedSermons',
          type: 'relationship',
          // @ts-expect-error - Collection slug will be valid after types regeneration
          relationTo: 'sermons',
          hasMany: true,
          label: 'Selected Sermons',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.displayMode === 'selected',
          },
        },
        {
          name: 'showCarousel',
          type: 'checkbox',
          defaultValue: true,
          label: 'Use Carousel Navigation',
        },
      ],
    },

    // ============================================================================
    // Donation Appeal Section
    // ============================================================================
    {
      name: 'donationSection',
      type: 'group',
      label: 'Donation Appeal Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Donation Appeal',
        },
        {
          name: 'displayMode',
          type: 'select',
          options: [
            { label: 'Featured Appeal', value: 'featured' },
            { label: 'Latest Appeal', value: 'latest' },
            { label: 'Selected Appeal', value: 'selected' },
          ],
          defaultValue: 'featured',
          label: 'Which Appeal to Display',
        },
        {
          name: 'selectedAppeal',
          type: 'relationship',
          // @ts-expect-error - Collection slug will be valid after types regeneration
          relationTo: 'donation-appeals',
          label: 'Selected Appeal',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.displayMode === 'selected',
          },
        },
        {
          name: 'showProgressBar',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Fundraising Progress Bar',
        },
        {
          name: 'showDonorCount',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Donor Count',
        },
        {
          name: 'showDaysLeft',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Days Left Countdown',
        },
        {
          name: 'viewAllAppealsText',
          type: 'text',
          defaultValue: 'View All Appeals',
          label: '"View All Appeals" Button Text',
        },
        {
          name: 'viewAllAppealsUrl',
          type: 'text',
          defaultValue: '/appeals',
          label: '"View All Appeals" URL',
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
          label: 'Section Background Color',
        },
      ],
    },

    // ============================================================================
    // Quick Actions / Floating Buttons
    // ============================================================================
    {
      name: 'quickActions',
      type: 'group',
      label: 'Quick Action Buttons',
      fields: [
        {
          name: 'showQuickActions',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Quick Action Buttons',
          admin: {
            description: 'Floating buttons like Chat, WhatsApp, etc.',
          },
        },
        {
          name: 'actions',
          type: 'array',
          label: 'Action Buttons',
          maxRows: 4,
          admin: {
            condition: (data, siblingData) => siblingData?.showQuickActions,
          },
          fields: [
            {
              name: 'icon',
              type: 'text',
              required: true,
              label: 'Icon Name',
              admin: {
                description: 'e.g., "whatsapp", "chat", "phone"',
              },
            },
            {
              name: 'label',
              type: 'text',
              label: 'Tooltip/Label',
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'Action URL',
            },
            {
              name: 'color',
              type: 'select',
              options: [
                { label: 'Green (WhatsApp)', value: 'green' },
                { label: 'Blue', value: 'blue' },
                { label: 'Red', value: 'red' },
              ],
              defaultValue: 'blue',
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
              'Leave blank to use default "Masjid Al-Falah - North Ilford Islamic Centre"',
          },
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
