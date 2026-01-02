import type { CollectionConfig } from 'payload';

export const Donors: CollectionConfig = {
  slug: 'donors',
  labels: {
    singular: 'Donor',
    plural: 'Donors',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: [
      'email',
      'firstName',
      'lastName',
      'totalDonated',
      'donationCount',
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
    // Basic Information
    // ============================================================================
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'Email Address',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          label: 'First Name',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'lastName',
          type: 'text',
          label: 'Last Name',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'displayName',
      type: 'text',
      label: 'Public Display Name',
      admin: {
        description:
          'Name shown on donation wall (e.g., "Anonymous kind soul")',
      },
    },
    {
      name: 'preferAnonymous',
      type: 'checkbox',
      defaultValue: false,
      label: 'Prefer Anonymous',
    },

    // ============================================================================
    // Address
    // ============================================================================
    {
      name: 'address',
      type: 'group',
      label: 'Address',
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
    // Gift Aid Status
    // ============================================================================
    {
      name: 'giftAidEligible',
      type: 'checkbox',
      defaultValue: false,
      label: 'Gift Aid Eligible',
      admin: {
        description: 'UK Taxpayer eligible for Gift Aid',
      },
    },
    {
      name: 'giftAidDeclarationDate',
      type: 'date',
      label: 'Gift Aid Declaration Date',
      admin: {
        condition: data => data?.giftAidEligible,
      },
    },

    // ============================================================================
    // Stripe Integration
    // ============================================================================
    {
      name: 'stripeCustomerId',
      type: 'text',
      label: 'Stripe Customer ID',
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'paymentMethods',
      type: 'array',
      label: 'Saved Payment Methods',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'stripePaymentMethodId',
          type: 'text',
          label: 'Payment Method ID',
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Card', value: 'card' },
            { label: 'Direct Debit', value: 'bacs_debit' },
            { label: 'PayPal', value: 'paypal' },
          ],
        },
        {
          name: 'last4',
          type: 'text',
          label: 'Last 4 digits',
        },
        {
          name: 'brand',
          type: 'text',
          label: 'Card Brand',
        },
        {
          name: 'isDefault',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },

    // ============================================================================
    // Donation Statistics
    // ============================================================================
    {
      name: 'totalDonated',
      type: 'number',
      defaultValue: 0,
      label: 'Total Donated (£)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'donationCount',
      type: 'number',
      defaultValue: 0,
      label: 'Number of Donations',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lastDonationDate',
      type: 'date',
      label: 'Last Donation Date',
      admin: {
        readOnly: true,
      },
    },

    // ============================================================================
    // Active Subscriptions
    // ============================================================================
    {
      name: 'activeSubscriptions',
      type: 'array',
      label: 'Active Recurring Donations',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'stripeSubscriptionId',
          type: 'text',
          label: 'Subscription ID',
        },
        {
          name: 'amount',
          type: 'number',
          label: 'Amount',
        },
        {
          name: 'frequency',
          type: 'select',
          options: [
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Quarterly', value: 'quarterly' },
            { label: 'Yearly', value: 'yearly' },
          ],
        },
        {
          name: 'donationType',
          type: 'text',
          label: 'Donation Type',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Paused', value: 'paused' },
            { label: 'Cancelled', value: 'cancelled' },
          ],
        },
        {
          name: 'nextPaymentDate',
          type: 'date',
          label: 'Next Payment Date',
        },
      ],
    },

    // ============================================================================
    // Authentication
    // ============================================================================
    {
      name: 'authProvider',
      type: 'select',
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Google', value: 'google' },
        { label: 'Apple', value: 'apple' },
        { label: 'Facebook', value: 'facebook' },
      ],
      label: 'Auth Provider',
    },
    {
      name: 'authProviderId',
      type: 'text',
      label: 'Auth Provider ID',
    },

    // ============================================================================
    // Marketing & Communication
    // ============================================================================
    {
      name: 'marketingConsent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Marketing Consent',
    },
    {
      name: 'communicationPreferences',
      type: 'group',
      label: 'Communication Preferences',
      fields: [
        {
          name: 'email',
          type: 'checkbox',
          defaultValue: true,
          label: 'Email Updates',
        },
        {
          name: 'sms',
          type: 'checkbox',
          defaultValue: false,
          label: 'SMS Updates',
        },
        {
          name: 'donationReceipts',
          type: 'checkbox',
          defaultValue: true,
          label: 'Donation Receipts',
        },
      ],
    },

    // ============================================================================
    // Notes
    // ============================================================================
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
    },
  ],
};
