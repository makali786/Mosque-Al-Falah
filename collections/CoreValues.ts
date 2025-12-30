import type { CollectionConfig } from 'payload';

export const CoreValues: CollectionConfig = {
  slug: 'core-values',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'order', 'isActive'],
    description: 'FAQ-style core values and organizational information',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      label: 'Question',
      admin: {
        description: 'e.g., "What is the Masjid Al-Falah (MAF)?"',
      },
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      label: 'Answer',
      admin: {
        description: 'Detailed answer to the question',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'About MAF', value: 'about-maf' },
        { label: 'Organization', value: 'organization' },
        { label: 'History', value: 'history' },
        { label: 'Funding', value: 'funding' },
        { label: 'Community', value: 'community' },
        { label: 'Values', value: 'values' },
      ],
      label: 'Category',
      admin: {
        description: 'Group related questions together',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        description: 'Order in which questions appear (lower numbers first)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Show this question in the FAQ section',
      },
    },
  ],
};
