import type { CollectionConfig } from 'payload';

export const Committees: CollectionConfig = {
  slug: 'committees',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'committeeType', 'order'],
    description: 'Leadership team and committee members',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ============================================================================
    // Basic Information
    // ============================================================================
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
      admin: {
        description: 'e.g., "Muhammad Ashraf", "Imtiaz AbuBaker"',
      },
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      label: 'Role/Position',
      admin: {
        description:
          'e.g., "Chairman", "Vice Chair", "Secretary", "Coordinator"',
      },
    },
    {
      name: 'committeeType',
      type: 'select',
      required: true,
      options: [
        { label: 'Directional Leadership Team', value: 'leadership' },
        { label: 'Imam & Scholars', value: 'imam-scholars' },
        { label: 'Operations', value: 'operations' },
        { label: 'Education', value: 'education' },
        { label: 'Community Outreach', value: 'outreach' },
        { label: 'Youth', value: 'youth' },
        { label: 'Finance', value: 'finance' },
      ],
      defaultValue: 'leadership',
      label: 'Committee Type',
    },

    // ============================================================================
    // Profile Details
    // ============================================================================
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Profile Photo',
      admin: {
        description: 'Professional headshot photo',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
      label: 'Short Bio/Description',
      admin: {
        description:
          'Brief description of responsibilities (e.g., "Responsible for the strategic direction and overall management of the masjid.")',
      },
    },
    {
      name: 'fullBio',
      type: 'richText',
      label: 'Full Biography',
      admin: {
        description:
          'Detailed background, qualifications, and experience (optional)',
      },
    },

    // ============================================================================
    // Contact Information
    // ============================================================================
    {
      name: 'contact',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'enableWhatsApp',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show WhatsApp Button',
        },
        {
          name: 'whatsappNumber',
          type: 'text',
          label: 'WhatsApp Number',
          admin: {
            description:
              'Phone number in international format (e.g., +447123456789)',
            condition: (data, siblingData) => siblingData?.enableWhatsApp,
          },
        },
        {
          name: 'enableEmail',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Email Button',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          admin: {
            condition: (data, siblingData) => siblingData?.enableEmail,
          },
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
          admin: {
            description: 'Alternative phone number',
          },
        },
      ],
    },

    // ============================================================================
    // Additional Information
    // ============================================================================
    {
      name: 'specializations',
      type: 'array',
      label: 'Areas of Specialization',
      admin: {
        description: 'For Imams and Scholars',
      },
      fields: [
        {
          name: 'area',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'qualifications',
      type: 'array',
      label: 'Qualifications',
      fields: [
        {
          name: 'qualification',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'joinedDate',
      type: 'date',
      label: 'Joined Committee Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },

    // ============================================================================
    // Social Links
    // ============================================================================
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Media Links',
      fields: [
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn Profile URL',
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter/X Handle',
        },
        {
          name: 'website',
          type: 'text',
          label: 'Personal Website',
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
        description: 'Order in committee grid (lower numbers first)',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Member',
      admin: {
        description: 'Highlight this member (e.g., for Chairman, Imam)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Show this member on the website',
      },
    },
  ],
};
