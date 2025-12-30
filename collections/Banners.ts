import type { CollectionConfig } from 'payload';

export const Banners: CollectionConfig = {
  slug: 'banners',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'isActive', 'order'],
    description: 'Hero banner slides for the homepage carousel',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Banner Title',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Banner Description',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Banner Image',
    },
    {
      name: 'mobileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Mobile Banner Image (Optional)',
      admin: {
        description:
          'Separate image for mobile devices. If not provided, main image will be used.',
      },
    },
    {
      name: 'primaryButton',
      type: 'group',
      label: 'Primary Button (e.g., Donate)',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          defaultValue: 'Donate',
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          defaultValue: '/donate',
        },
      ],
    },
    {
      name: 'secondaryButton',
      type: 'group',
      label: 'Secondary Button (e.g., Learn More)',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          defaultValue: 'Learn More',
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          defaultValue: '/about',
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        description: 'Lower numbers appear first',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Only active banners will be displayed on the website',
      },
    },
  ],
};
