import type { CollectionConfig } from 'payload';

export const Imams: CollectionConfig = {
  slug: 'imams',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'order'],
    description: 'Mosque Imams and religious scholars',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title/Position',
      admin: {
        description: 'e.g., "Imam & Qari", "Resident Scholar"',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Profile Photo',
    },
    {
      name: 'imageStyle',
      type: 'text',
      label: 'Image CSS Classes',
      admin: {
        description:
          'Custom CSS classes for image positioning (e.g., "object-[50%_-14%] scale-150")',
      },
    },
    {
      name: 'biography',
      type: 'richText',
      label: 'Biography',
    },
    {
      name: 'education',
      type: 'richText',
      label: 'Educational Background',
    },
    {
      name: 'specializations',
      type: 'array',
      label: 'Areas of Specialization',
      fields: [
        {
          name: 'specialization',
          type: 'text',
        },
      ],
    },
    {
      name: 'languages',
      type: 'array',
      label: 'Languages Spoken',
      fields: [
        {
          name: 'language',
          type: 'text',
        },
      ],
    },
    {
      name: 'email',
      type: 'email',
      label: 'Contact Email',
    },
    {
      name: 'askImamEnabled',
      type: 'checkbox',
      defaultValue: true,
      label: 'Enable "Ask Imam" Feature',
      admin: {
        description: 'Allow users to submit questions to this Imam',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Display Order',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
  ],
};
