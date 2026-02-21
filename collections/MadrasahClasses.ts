import { createRevalidateHook } from '../lib/revalidation';
import type { CollectionConfig } from 'payload';

export const MadrasahClasses: CollectionConfig = {
  slug: 'madrasah-classes',
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'classType', 'ageRange', 'order', 'isActive'],
    description: 'Madrasah class offerings and programs',
  },
  access: {
    read: () => true,
  },
  hooks: {

    afterChange: [createRevalidateHook('madrasah-classes')],

  },

  fields: [
    // ============================================================================
    // Basic Information
    // ============================================================================
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Class Title',
      admin: {
        description: 'e.g., "Madrasah for boys", "Hifz for Children"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'e.g., "madrasah-boys", "hifz-children"',
      },
    },
    {
      name: 'classType',
      type: 'select',
      required: true,
      options: [
        { label: 'Boys Classes', value: 'boys' },
        { label: 'Girls Classes', value: 'girls' },
        { label: 'Hifz Program', value: 'hifz' },
        { label: 'Teenagers', value: 'teens' },
        { label: 'Further Education', value: 'further-education' },
        { label: 'Adult Classes', value: 'adults' },
        { label: 'Weekend Classes', value: 'weekend' },
        { label: 'Summer Classes', value: 'summer' },
      ],
      label: 'Class Type',
    },

    // ============================================================================
    // Class Details
    // ============================================================================
    {
      name: 'ageRange',
      type: 'text',
      label: 'Age Range',
      admin: {
        description: 'e.g., "6-17 years old", "Adults 18+"',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Short Description',
      admin: {
        description: 'Brief summary shown on class cards',
      },
    },
    {
      name: 'fullDescription',
      type: 'richText',
      label: 'Full Description',
      admin: {
        description: 'Detailed information about the class program',
      },
    },

    // ============================================================================
    // Media
    // ============================================================================
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Class Image',
      admin: {
        description: 'Image shown on the class card',
      },
    },

    // ============================================================================
    // Instructor & Schedule
    // ============================================================================
    {
      name: 'instructor',
      type: 'text',
      label: 'Lead Instructor/Teacher',
      admin: {
        description: 'Name of the principal instructor',
      },
    },
    {
      name: 'schedule',
      type: 'array',
      label: 'Class Schedule',
      fields: [
        {
          name: 'day',
          type: 'select',
          required: true,
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
          label: 'Day',
        },
        {
          name: 'startTime',
          type: 'text',
          label: 'Start Time',
          admin: {
            description: 'e.g., "4:00 PM"',
          },
        },
        {
          name: 'endTime',
          type: 'text',
          label: 'End Time',
          admin: {
            description: 'e.g., "6:00 PM"',
          },
        },
      ],
    },

    // ============================================================================
    // Registration
    // ============================================================================
    {
      name: 'applicationButtonText',
      type: 'text',
      defaultValue: 'Apply Now',
      label: 'Application Button Text',
    },
    {
      name: 'applicationUrl',
      type: 'text',
      label: 'Application URL',
      admin: {
        description: 'External link to application form or registration page',
      },
    },
    {
      name: 'fee',
      type: 'group',
      label: 'Fee Information',
      fields: [
        {
          name: 'hasFee',
          type: 'checkbox',
          defaultValue: false,
          label: 'Has Registration Fee',
        },
        {
          name: 'amount',
          type: 'number',
          label: 'Amount (£)',
          admin: {
            condition: (data, siblingData) => siblingData?.hasFee,
          },
        },
        {
          name: 'period',
          type: 'select',
          options: [
            { label: 'Per Month', value: 'monthly' },
            { label: 'Per Term', value: 'term' },
            { label: 'Per Year', value: 'yearly' },
            { label: 'One-time', value: 'once' },
          ],
          label: 'Fee Period',
          admin: {
            condition: (data, siblingData) => siblingData?.hasFee,
          },
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
        description: 'Order in class grid (lower numbers first)',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Class',
      admin: {
        description: 'Highlight this class',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Show this class on the website',
      },
    },
  ],
};
