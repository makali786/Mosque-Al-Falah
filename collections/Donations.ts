import type { CollectionConfig } from 'payload';

export const Donations: CollectionConfig = {
  slug: 'donations',
  labels: {
    singular: 'Donation',
    plural: 'Donations',
  },
  admin: {
    useAsTitle: 'donorEmail',
    defaultColumns: [
      'donorEmail',
      'amount',
      'currency',
      'frequency',
      'status',
      'createdAt',
    ],
    group: 'Donations',
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    // ============================================================================
    // Donation Details
    // ============================================================================
    {
      type: 'row',
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          label: 'Amount',
          min: 1,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'currency',
          type: 'select',
          required: true,
          defaultValue: 'GBP',
          options: [
            { label: '£ GBP', value: 'GBP' },
            { label: '$ USD', value: 'USD' },
            { label: '€ EUR', value: 'EUR' },
          ],
          admin: {
            width: '33%',
          },
        },
        {
          name: 'frequency',
          type: 'select',
          required: true,
          defaultValue: 'one-time',
          options: [
            { label: 'One-off', value: 'one-time' },
            { label: 'Every Friday', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Quarterly', value: 'quarterly' },
            { label: 'Yearly', value: 'yearly' },
          ],
          admin: {
            width: '33%',
          },
        },
      ],
    },
    {
      name: 'donationType',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'General Fund', value: 'general' },
        { label: 'Zakat', value: 'zakat' },
        { label: 'Sadaqah', value: 'sadaqah' },
        { label: 'Building Fund', value: 'building' },
        { label: 'Ramadan Appeal', value: 'ramadan' },
        { label: 'Gaza Emergency', value: 'gaza' },
        { label: 'Orphan Support', value: 'orphan' },
        { label: 'Education', value: 'education' },
      ],
      label: 'Donation Type',
    },
    {
      name: 'appeal',
      type: 'relationship',
      relationTo: 'donation-appeals',
      label: 'Linked Appeal',
      admin: {
        description: 'Associated donation appeal (if any)',
      },
    },

    // ============================================================================
    // Donor Information
    // ============================================================================
    {
      name: 'donorEmail',
      type: 'email',
      required: true,
      label: 'Donor Email',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'donorFirstName',
          type: 'text',
          label: 'First Name',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'donorLastName',
          type: 'text',
          label: 'Last Name',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'donorPhone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'isAnonymous',
      type: 'checkbox',
      defaultValue: false,
      label: 'Anonymous Donation',
    },
    {
      name: 'displayName',
      type: 'text',
      label: 'Display Name',
      admin: {
        description: 'Name to show publicly (e.g., "Anonymous kind soul")',
      },
    },

    // ============================================================================
    // Address (for Gift Aid)
    // ============================================================================
    {
      name: 'address',
      type: 'group',
      label: 'Billing Address',
      fields: [
        {
          name: 'line1',
          type: 'text',
          label: 'Address Line 1',
        },
        {
          name: 'line2',
          type: 'text',
          label: 'Address Line 2',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'city',
              type: 'text',
              label: 'City',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'postcode',
              type: 'text',
              label: 'Postcode',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'country',
          type: 'select',
          defaultValue: 'GB',
          options: [
            { label: 'United Kingdom', value: 'GB' },
            { label: 'United States', value: 'US' },
            { label: 'United Arab Emirates', value: 'AE' },
            { label: 'Other', value: 'OTHER' },
          ],
          label: 'Country',
        },
      ],
    },

    // ============================================================================
    // Gift Aid (UK Tax Relief)
    // ============================================================================
    {
      name: 'giftAid',
      type: 'group',
      label: 'Gift Aid',
      admin: {
        description: 'UK Tax Relief - adds 25% to donation at no extra cost',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Gift Aid this donation',
        },
        {
          name: 'amount',
          type: 'number',
          label: 'Gift Aid Amount',
          admin: {
            description: 'Calculated as 25% of donation',
            readOnly: true,
          },
        },
        {
          name: 'declaration',
          type: 'checkbox',
          label: 'I confirm I am a UK taxpayer',
          admin: {
            condition: data => data?.giftAid?.enabled,
          },
        },
      ],
    },

    // ============================================================================
    // Platform Fee / Tip
    // ============================================================================
    {
      name: 'platformFee',
      type: 'group',
      label: 'Platform Support',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Support platform with tip',
        },
        {
          name: 'percentage',
          type: 'number',
          defaultValue: 12.5,
          label: 'Tip Percentage',
          admin: {
            condition: data => data?.platformFee?.enabled,
          },
        },
        {
          name: 'amount',
          type: 'number',
          label: 'Tip Amount',
          admin: {
            condition: data => data?.platformFee?.enabled,
          },
        },
      ],
    },

    // ============================================================================
    // Payment Details
    // ============================================================================
    {
      name: 'payment',
      type: 'group',
      label: 'Payment Information',
      fields: [
        {
          name: 'method',
          type: 'select',
          required: true,
          options: [
            { label: 'Card (Stripe)', value: 'card' },
            { label: 'Direct Debit', value: 'direct_debit' },
            { label: 'PayPal', value: 'paypal' },
            { label: 'Apple Pay', value: 'apple_pay' },
            { label: 'Google Pay', value: 'google_pay' },
          ],
          label: 'Payment Method',
        },
        {
          name: 'stripePaymentIntentId',
          type: 'text',
          label: 'Stripe Payment Intent ID',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'stripeSubscriptionId',
          type: 'text',
          label: 'Stripe Subscription ID',
          admin: {
            readOnly: true,
            description: 'For recurring donations',
          },
        },
        {
          name: 'stripeCustomerId',
          type: 'text',
          label: 'Stripe Customer ID',
          admin: {
            readOnly: true,
          },
        },
      ],
    },

    // ============================================================================
    // Status & Tracking
    // ============================================================================
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      label: 'Status',
    },
    {
      name: 'totalAmount',
      type: 'number',
      label: 'Total Amount Charged',
      admin: {
        description: 'Donation + Platform Fee',
        readOnly: true,
      },
    },
    {
      name: 'receiptSent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Receipt Sent',
    },
    {
      name: 'thankYouSent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Thank You Email Sent',
    },

    // ============================================================================
    // Marketing Consent
    // ============================================================================
    {
      name: 'marketingConsent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Marketing Consent',
      admin: {
        description: 'Agreed to receive email updates',
      },
    },

    // ============================================================================
    // Notes
    // ============================================================================
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        description: 'Admin notes (not visible to donor)',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Calculate Gift Aid amount (25%)
        if (data?.giftAid?.enabled && data?.amount) {
          data.giftAid.amount = Math.round(data.amount * 0.25 * 100) / 100;
        }

        // Calculate platform fee
        if (
          data?.platformFee?.enabled &&
          data?.platformFee?.percentage &&
          data?.amount
        ) {
          data.platformFee.amount =
            Math.round(
              data.amount * (data.platformFee.percentage / 100) * 100
            ) / 100;
        }

        // Calculate total amount
        const donationAmount = data?.amount || 0;
        const tipAmount = data?.platformFee?.enabled
          ? data?.platformFee?.amount || 0
          : 0;
        data.totalAmount = donationAmount + tipAmount;

        return data;
      },
    ],
  },
};
