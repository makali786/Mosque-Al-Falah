import type { CollectionConfig } from 'payload';

export const CoreValues: CollectionConfig = {
  slug: 'core-values',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'isActive'],
    description: 'Mosque core values displayed on About Us page',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Value Title',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Description',
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: 'Icon/Image',
      admin: {
        description: 'SVG or image representing this value',
      },
    },
    {
      name: 'iconName',
      type: 'text',
      label: 'Icon Name (React Icons)',
      admin: {
        description: 'Alternative: React Icons name (e.g., "FaHeart")',
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
