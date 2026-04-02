import { createRevalidateHook } from '../lib/revalidation';
import type { GlobalConfig } from 'payload';

export const DonationSettings: GlobalConfig = {
  slug: 'donation-settings',
  label: 'Donation Settings',
  admin: {
    description: 'Manage donation page settings including quick amounts, platform fees, and donation types',
    group: 'Settings',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [createRevalidateHook('donation-settings')],
  },
  fields: [
    // ============================================================================
    // Quick Donation Amounts
    // ============================================================================
    {
      name: 'quickAmounts',
      type: 'array',
      label: 'Quick Donation Amounts',
      admin: {
        description: 'Preset amounts displayed as quick-select buttons (e.g., £15, £20, £45)',
      },
      defaultValue: [
        { amount: 15 },
        { amount: 20 },
        { amount: 45 },
      ],
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          label: 'Amount (£)',
          min: 1,
          admin: {
            description: 'Amount in British Pounds',
          },
        },
      ],
    },

    // ============================================================================
    // Default Amount Settings
    // ============================================================================
    {
      name: 'defaultAmount',
      type: 'group',
      label: 'Default Amount Settings',
      fields: [
        {
          name: 'defaultSelectedAmount',
          type: 'number',
          label: 'Default Selected Amount',
          defaultValue: 20,
          min: 1,
          admin: {
            description: 'Amount pre-selected when user visits the donation page',
          },
        },
        {
          name: 'minimumDonation',
          type: 'number',
          label: 'Minimum Donation Amount (£)',
          defaultValue: 1,
          min: 1,
          admin: {
            description: 'Minimum allowed donation amount',
          },
        },
      ],
    },

    // ============================================================================
    // Platform Fee Settings
    // ============================================================================
    {
      name: 'platformFee',
      type: 'group',
      label: 'Platform Fee Settings',
      fields: [
        {
          name: 'enabledByDefault',
          type: 'checkbox',
          label: 'Enable Platform Fee by Default',
          defaultValue: true,
          admin: {
            description: 'Whether the platform fee toggle is enabled by default',
          },
        },
        {
          name: 'defaultPercentage',
          type: 'number',
          label: 'Default Platform Fee Percentage (%)',
          defaultValue: 12.5,
          min: 0,
          max: 100,
          admin: {
            description: 'Default percentage for platform fee (e.g., 12.5 for 12.5%)',
          },
        },
        {
          name: 'sliderPoints',
          type: 'array',
          label: 'Slider Points',
          admin: {
            description: 'Percentage points displayed on the platform fee slider (0-100 range)',
          },
          defaultValue: [
            { visualPosition: 0, percentageValue: 0 },
            { visualPosition: 25, percentageValue: 7.5 },
            { visualPosition: 50, percentageValue: 12.5 },
            { visualPosition: 75, percentageValue: 17.5 },
            { visualPosition: 100, percentageValue: 20 },
          ],
          fields: [
            {
              name: 'visualPosition',
              type: 'number',
              required: true,
              label: 'Visual Position (%)',
              min: 0,
              max: 100,
              admin: {
                description: 'Position on slider (0 = left, 100 = right)',
              },
            },
            {
              name: 'percentageValue',
              type: 'number',
              required: true,
              label: 'Percentage Value (%)',
              min: 0,
              max: 100,
              admin: {
                description: 'Actual percentage value at this position',
              },
            },
          ],
        },
        {
          name: 'recommendedPosition',
          type: 'number',
          label: 'Recommended Position',
          defaultValue: 50,
          min: 0,
          max: 100,
          admin: {
            description: 'Visual position where "RECOMMENDED" badge appears (e.g., 50 for middle)',
          },
        },
        {
          name: 'infoText',
          type: 'text',
          label: 'Info Box Text',
          defaultValue: '75% of donors',
          admin: {
            description: 'Text shown in the green info box (e.g., "75% of donors")',
          },
        },
        {
          name: 'infoSubtext',
          type: 'text',
          label: 'Info Box Subtext',
          defaultValue: 'have helped keep Masjid System free for our charity in last the 24 hours',
          admin: {
            description: 'Subtext shown after the info text',
          },
        },
      ],
    },

    // ============================================================================
    // Donation Types
    // ============================================================================
    {
      name: 'donationTypes',
      type: 'array',
      label: 'Donation Types',
      admin: {
        description: 'Available donation categories/types',
      },
      defaultValue: [
        { value: 'general', label: 'General Fund' },
        { value: 'zakat', label: 'Zakat' },
        { value: 'sadaqah', label: 'Sadaqah' },
        { value: 'building', label: 'Building Fund' },
        { value: 'ramadan', label: 'Ramadan Appeal' },
        { value: 'gaza', label: 'Gaza Emergency' },
        { value: 'orphan', label: 'Orphan Support' },
        { value: 'education', label: 'Education' },
      ],
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Value (slug)',
          admin: {
            description: 'Unique identifier (e.g., general, zakat, sadaqah)',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
          admin: {
            description: 'Display name shown to users',
          },
        },
      ],
    },

    // ============================================================================
    // Frequency Options
    // ============================================================================
    {
      name: 'frequencies',
      type: 'array',
      label: 'Frequency Options',
      admin: {
        description: 'Available donation frequency options',
      },
      defaultValue: [
        { value: 'one-time', label: 'One-off' },
        { value: 'weekly', label: 'Every Friday' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'yearly', label: 'Yearly' },
      ],
      fields: [
        {
          name: 'value',
          type: 'select',
          required: true,
          label: 'Value',
          options: [
            { label: 'One-time', value: 'one-time' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Quarterly', value: 'quarterly' },
            { label: 'Yearly', value: 'yearly' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
          admin: {
            description: 'Display name shown to users',
          },
        },
      ],
    },

    // ============================================================================
    // UI Text Customization
    // ============================================================================
    {
      name: 'uiText',
      type: 'group',
      label: 'UI Text Customization',
      fields: [
        {
          name: 'amountSelectorLabel',
          type: 'text',
          label: 'Amount Selector Label',
          defaultValue: 'Your giving amount',
          admin: {
            description: 'Label shown above the amount selector',
          },
        },
        {
          name: 'customAmountButtonText',
          type: 'text',
          label: 'Custom Amount Button Text',
          defaultValue: 'Custom',
        },
        {
          name: 'customAmountPlaceholder',
          type: 'text',
          label: 'Custom Amount Placeholder',
          defaultValue: 'Enter amount',
        },
        {
          name: 'applyButtonText',
          type: 'text',
          label: 'Apply Button Text',
          defaultValue: 'Apply',
        },
      ],
    },
  ],
};
