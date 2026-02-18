import { createRevalidateHook } from '../lib/revalidation';
import type { GlobalConfig } from 'payload';

export const PrayerTimesPage: GlobalConfig = {
  slug: 'prayer-times-page',
  label: 'Prayer Times Page',
  admin: {
    description: 'Manage all content and settings for the Prayer Times page',
  },
  access: {
    read: () => true,
  },
  hooks: {

    afterChange: [createRevalidateHook('prayer-times-page')],

  },

  fields: [
    // ============================================================================
    // Page Header Section
    // ============================================================================
    {
      name: 'pageHeader',
      type: 'group',
      label: 'Page Header',
      fields: [
        {
          name: 'showHeader',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Page Header',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Prayer Times',
          label: 'Page Title',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: 'Page Subtitle/Description',
          admin: {
            description: 'Optional description text below the title',
            rows: 2,
          },
        },
      ],
    },

    // ============================================================================
    // Prayer Times Widget Section
    // ============================================================================
    {
      name: 'prayerWidget',
      type: 'group',
      label: 'Prayer Times Widget Settings',
      fields: [
        {
          name: 'showWidget',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Prayer Times Widget',
        },
        {
          name: 'widgetLayout',
          type: 'select',
          options: [
            { label: 'Side by Side (Calendar + Times)', value: 'side-by-side' },
            { label: 'Stacked (Calendar above Times)', value: 'stacked' },
            { label: 'Times Only', value: 'times-only' },
            { label: 'Calendar Only', value: 'calendar-only' },
          ],
          defaultValue: 'side-by-side',
          label: 'Widget Layout',
        },
        {
          name: 'showCalendar',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Calendar/Countdown Widget',
          admin: {
            description: 'Display the visual calendar with countdown timer',
          },
        },
        {
          name: 'calendarBackgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Calendar Background Image',
          admin: {
            description:
              'Background image for the calendar widget (e.g., mosque image)',
            condition: (data, siblingData) => siblingData?.showCalendar,
          },
        },
        {
          name: 'showCountdown',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Next Prayer Countdown',
          admin: {
            condition: (data, siblingData) => siblingData?.showCalendar,
          },
        },
        {
          name: 'countdownFormat',
          type: 'select',
          options: [
            { label: 'Hours:Minutes:Seconds', value: 'hms' },
            { label: 'Hours and Minutes Only', value: 'hm' },
          ],
          defaultValue: 'hms',
          label: 'Countdown Display Format',
          admin: {
            condition: (data, siblingData) => siblingData?.showCountdown,
          },
        },
        {
          name: 'showPrayerTimes',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Prayer Times Table',
        },
        {
          name: 'timesDisplayMode',
          type: 'select',
          options: [
            { label: 'Begins & Jamaah Times', value: 'both' },
            { label: 'Begins Time Only', value: 'begins' },
            { label: 'Jamaah Time Only', value: 'jamaah' },
          ],
          defaultValue: 'both',
          label: 'Times Display Mode',
          admin: {
            condition: (data, siblingData) => siblingData?.showPrayerTimes,
          },
        },
        {
          name: 'highlightCurrentPrayer',
          type: 'checkbox',
          defaultValue: true,
          label: 'Highlight Current/Next Prayer',
          admin: {
            condition: (data, siblingData) => siblingData?.showPrayerTimes,
          },
        },
        {
          name: 'showDateSelector',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Date Navigation (Previous/Next Day)',
        },
        {
          name: 'showMonthSelector',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Month/Timetable Dropdown',
          admin: {
            description: 'Allow users to download monthly timetables',
          },
        },
      ],
    },

    // ============================================================================
    // Location & Calculation Settings Display
    // ============================================================================
    {
      name: 'locationInfo',
      type: 'group',
      label: 'Location Information Display',
      fields: [
        {
          name: 'showLocationInfo',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Location Information',
        },
        {
          name: 'locationText',
          type: 'text',
          defaultValue: 'Ilford, Essex IG1 3EN',
          label: 'Location Display Text',
          admin: {
            condition: (data, siblingData) => siblingData?.showLocationInfo,
          },
        },
        {
          name: 'showCalculationMethod',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show Calculation Method Info',
          admin: {
            description: 'Display which calculation method is being used',
          },
        },
      ],
    },

    // ============================================================================
    // Quote Section
    // ============================================================================
    {
      name: 'quoteSection',
      type: 'group',
      label: 'Quote Section',
      fields: [
        {
          name: 'showQuote',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Quote Section',
        },
        {
          name: 'quoteText',
          type: 'textarea',
          defaultValue:
            'The best of you is the one who is the best to his family.',
          label: 'Quote Text',
          required: true,
          admin: {
            condition: (data, siblingData) => siblingData?.showQuote,
            rows: 3,
          },
        },
        {
          name: 'quoteAttribution',
          type: 'text',
          defaultValue: 'Prophet Muhammad ﷺ',
          label: 'Quote Attribution',
          admin: {
            description:
              'Who said the quote (e.g., "Prophet Muhammad ﷺ", "Quran 2:183")',
            condition: (data, siblingData) => siblingData?.showQuote,
          },
        },
        {
          name: 'quoteSource',
          type: 'text',
          label: 'Quote Source (Optional)',
          admin: {
            description: 'e.g., "Sahih al-Bukhari", "Sunan Ibn Majah"',
            condition: (data, siblingData) => siblingData?.showQuote,
          },
        },
        {
          name: 'quoteBackgroundColor',
          type: 'select',
          options: [
            { label: 'Light Gray', value: 'gray' },
            { label: 'White', value: 'white' },
            { label: 'Blue', value: 'blue' },
            { label: 'Dark', value: 'dark' },
          ],
          defaultValue: 'gray',
          label: 'Quote Section Background',
          admin: {
            condition: (data, siblingData) => siblingData?.showQuote,
          },
        },
        {
          name: 'quoteTextAlignment',
          type: 'select',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
          defaultValue: 'left',
          label: 'Quote Text Alignment',
          admin: {
            condition: (data, siblingData) => siblingData?.showQuote,
          },
        },
      ],
    },

    // ============================================================================
    // Call-to-Action Buttons
    // ============================================================================
    {
      name: 'ctaButtons',
      type: 'group',
      label: 'Call-to-Action Buttons',
      fields: [
        {
          name: 'showCTAButtons',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show CTA Buttons',
        },
        {
          name: 'buttons',
          type: 'array',
          label: 'Action Buttons',
          maxRows: 4,
          admin: {
            description:
              'Buttons shown near the quote section (e.g., "Share this page", "Donate Now")',
            condition: (data, siblingData) => siblingData?.showCTAButtons,
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              label: 'Button Text',
              admin: {
                description:
                  'e.g., "Share this page", "Donate Now", "Download Timetable"',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'Button URL',
              admin: {
                description:
                  'Leave empty for share button (will use native share)',
              },
            },
            {
              name: 'action',
              type: 'select',
              options: [
                { label: 'Navigate to URL', value: 'navigate' },
                { label: 'Share Page', value: 'share' },
                { label: 'Download Timetable', value: 'download' },
                { label: 'Print Page', value: 'print' },
              ],
              defaultValue: 'navigate',
              label: 'Button Action',
            },
            {
              name: 'style',
              type: 'select',
              options: [
                { label: 'Primary (Blue)', value: 'primary' },
                { label: 'Secondary (White/Outline)', value: 'secondary' },
                { label: 'Dark', value: 'dark' },
              ],
              defaultValue: 'secondary',
              label: 'Button Style',
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icon (Optional)',
              admin: {
                description: 'Icon name or emoji',
              },
            },
          ],
        },
        {
          name: 'buttonsAlignment',
          type: 'select',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
          defaultValue: 'center',
          label: 'Buttons Alignment',
          admin: {
            condition: (data, siblingData) => siblingData?.showCTAButtons,
          },
        },
      ],
    },

    // ============================================================================
    // Additional Information Section
    // ============================================================================
    {
      name: 'additionalInfo',
      type: 'group',
      label: 'Additional Information',
      fields: [
        {
          name: 'showInfoSection',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show Additional Information Section',
        },
        {
          name: 'infoTitle',
          type: 'text',
          defaultValue: 'About Prayer Times',
          label: 'Section Title',
          admin: {
            condition: (data, siblingData) => siblingData?.showInfoSection,
          },
        },
        {
          name: 'infoContent',
          type: 'richText',
          label: 'Information Content',
          admin: {
            description:
              'Additional information about prayer times, calculation methods, etc.',
            condition: (data, siblingData) => siblingData?.showInfoSection,
          },
        },
        {
          name: 'showFAQs',
          type: 'checkbox',
          defaultValue: false,
          label: 'Include FAQs',
          admin: {
            condition: (data, siblingData) => siblingData?.showInfoSection,
          },
        },
        {
          name: 'faqs',
          type: 'array',
          label: 'Frequently Asked Questions',
          admin: {
            condition: (data, siblingData) => siblingData?.showFAQs,
          },
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
    // Notifications & Reminders Section
    // ============================================================================
    {
      name: 'notificationsSection',
      type: 'group',
      label: 'Prayer Reminders Section',
      fields: [
        {
          name: 'showNotifications',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show Prayer Reminders Signup',
        },
        {
          name: 'notificationTitle',
          type: 'text',
          defaultValue: 'Get Prayer Time Reminders',
          label: 'Section Title',
          admin: {
            condition: (data, siblingData) => siblingData?.showNotifications,
          },
        },
        {
          name: 'notificationDescription',
          type: 'textarea',
          defaultValue:
            'Sign up to receive daily prayer time reminders via email or SMS.',
          label: 'Description',
          admin: {
            condition: (data, siblingData) => siblingData?.showNotifications,
            rows: 2,
          },
        },
        {
          name: 'notificationMethods',
          type: 'array',
          label: 'Available Notification Methods',
          admin: {
            condition: (data, siblingData) => siblingData?.showNotifications,
          },
          fields: [
            {
              name: 'method',
              type: 'select',
              options: [
                { label: 'Email', value: 'email' },
                { label: 'SMS', value: 'sms' },
                { label: 'WhatsApp', value: 'whatsapp' },
                { label: 'Push Notification', value: 'push' },
              ],
              required: true,
            },
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
              label: 'Enable this method',
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Related Links Section
    // ============================================================================
    {
      name: 'relatedLinks',
      type: 'group',
      label: 'Related Links',
      fields: [
        {
          name: 'showRelatedLinks',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show Related Links Section',
        },
        {
          name: 'relatedLinksTitle',
          type: 'text',
          defaultValue: 'Related Resources',
          label: 'Section Title',
          admin: {
            condition: (data, siblingData) => siblingData?.showRelatedLinks,
          },
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          admin: {
            condition: (data, siblingData) => siblingData?.showRelatedLinks,
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Link Title',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Link Description',
              admin: {
                rows: 2,
              },
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'URL',
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icon (Optional)',
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
          defaultValue: 'Prayer Times - Masjid Al-Falah',
          label: 'Meta Title',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          defaultValue:
            'View accurate daily prayer times for Masjid Al-Falah in Ilford, Essex. Find Fajr, Dhuhr, Asr, Maghrib, and Isha prayer times with Jamaah times.',
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
