import type { CollectionConfig } from 'payload';

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  orderable: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'subscribedAt', 'source'],
    description: 'Manage newsletter subscribers and email list',
    group: 'Communications',
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    // ============================================================================
    // Subscriber Information
    // ============================================================================
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'Email Address',
      admin: {
        description: "Subscriber's email address",
      },
    },
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      admin: {
        description: 'Optional - can be collected later',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      admin: {
        description: 'Optional - can be collected later',
      },
    },

    // ============================================================================
    // Subscription Status
    // ============================================================================
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
        { label: 'Bounced', value: 'bounced' },
        { label: 'Pending Confirmation', value: 'pending' },
      ],
      label: 'Subscription Status',
      admin: {
        description: 'Current status of this subscription',
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: 'Subscribed Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When the user subscribed',
      },
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      label: 'Unsubscribed Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        condition: data => data?.status === 'unsubscribed',
      },
    },
    {
      name: 'confirmationToken',
      type: 'text',
      label: 'Confirmation Token',
      admin: {
        description: 'Token for email confirmation (if using double opt-in)',
        readOnly: true,
      },
    },
    {
      name: 'confirmedAt',
      type: 'date',
      label: 'Confirmed Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When the user confirmed their subscription',
      },
    },

    // ============================================================================
    // Subscription Preferences
    // ============================================================================
    {
      name: 'preferences',
      type: 'group',
      label: 'Email Preferences',
      fields: [
        {
          name: 'receiveWeeklyUpdates',
          type: 'checkbox',
          defaultValue: true,
          label: 'Weekly Updates',
          admin: {
            description: 'Receive weekly mosque updates and news',
          },
        },
        {
          name: 'receiveEventNotifications',
          type: 'checkbox',
          defaultValue: true,
          label: 'Event Notifications',
          admin: {
            description: 'Receive notifications about upcoming events',
          },
        },
        {
          name: 'receivePrayerTimeUpdates',
          type: 'checkbox',
          defaultValue: false,
          label: 'Prayer Time Updates',
          admin: {
            description: 'Receive prayer time updates and reminders',
          },
        },
        {
          name: 'receiveDonationAppeals',
          type: 'checkbox',
          defaultValue: true,
          label: 'Donation Appeals',
          admin: {
            description: 'Receive information about donation campaigns',
          },
        },
        {
          name: 'receiveRamadanUpdates',
          type: 'checkbox',
          defaultValue: true,
          label: 'Ramadan Updates',
          admin: {
            description: 'Receive special Ramadan updates and schedules',
          },
        },
      ],
    },

    // ============================================================================
    // Source Tracking
    // ============================================================================
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Website Footer', value: 'footer' },
        { label: 'Prayer Reminder', value: 'prayer-reminder' },
        { label: 'Event Registration', value: 'event' },
        { label: 'Service Request', value: 'service' },
        { label: 'Donation Page', value: 'donation' },
        { label: 'Manual Entry', value: 'manual' },
        { label: 'Import', value: 'import' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'footer',
      label: 'Subscription Source',
      admin: {
        description: 'Where did this subscriber sign up from?',
      },
    },
    {
      name: 'sourceDetails',
      type: 'group',
      label: 'Source Details',
      fields: [
        {
          name: 'referrer',
          type: 'text',
          label: 'Referrer URL',
          admin: {
            description: 'The page where the user subscribed from',
          },
        },
        {
          name: 'device',
          type: 'select',
          options: [
            { label: 'Desktop', value: 'desktop' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Tablet', value: 'tablet' },
          ],
          label: 'Device Type',
        },
        {
          name: 'ipAddress',
          type: 'text',
          label: 'IP Address',
          admin: {
            description: 'For tracking and spam prevention',
          },
        },
      ],
    },

    // ============================================================================
    // Email Campaign Tracking
    // ============================================================================
    {
      name: 'emailsSent',
      type: 'number',
      defaultValue: 0,
      label: 'Total Emails Sent',
      admin: {
        description: 'Total number of emails sent to this subscriber',
        readOnly: true,
      },
    },
    {
      name: 'emailsOpened',
      type: 'number',
      defaultValue: 0,
      label: 'Emails Opened',
      admin: {
        description: 'Number of emails opened by this subscriber',
        readOnly: true,
      },
    },
    {
      name: 'emailsClicked',
      type: 'number',
      defaultValue: 0,
      label: 'Emails Clicked',
      admin: {
        description: 'Number of emails where links were clicked',
        readOnly: true,
      },
    },
    {
      name: 'lastEmailSentAt',
      type: 'date',
      label: 'Last Email Sent',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When was the last email sent to this subscriber',
        readOnly: true,
      },
    },

    // ============================================================================
    // Tags & Segmentation
    // ============================================================================
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      admin: {
        description:
          'Tags for segmenting subscribers (e.g., "youth", "parents", "donors")',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },

    // ============================================================================
    // Admin Notes
    // ============================================================================
    {
      name: 'notes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        description: 'Internal notes about this subscriber',
        rows: 3,
      },
    },

    // ============================================================================
    // Unsubscribe Information
    // ============================================================================
    {
      name: 'unsubscribeReason',
      type: 'select',
      options: [
        { label: 'Too many emails', value: 'too-many' },
        { label: 'Not relevant', value: 'not-relevant' },
        { label: 'Never subscribed', value: 'never-subscribed' },
        { label: 'Other', value: 'other' },
      ],
      label: 'Unsubscribe Reason',
      admin: {
        condition: data => data?.status === 'unsubscribed',
      },
    },
    {
      name: 'unsubscribeFeedback',
      type: 'textarea',
      label: 'Unsubscribe Feedback',
      admin: {
        description: 'Additional feedback from the subscriber',
        condition: data => data?.status === 'unsubscribed',
        rows: 3,
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Generate confirmation token for new subscriptions
        if (operation === 'create' && !data.confirmationToken) {
          data.confirmationToken = `NL-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        }

        // Set unsubscribed date when status changes to unsubscribed
        if (data.status === 'unsubscribed' && !data.unsubscribedAt) {
          data.unsubscribedAt = new Date().toISOString();
        }

        return data;
      },
    ],
  },
};
