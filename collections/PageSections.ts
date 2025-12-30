import type { CollectionConfig } from 'payload';

export const PageSections: CollectionConfig = {
  slug: 'page-sections',
  admin: {
    useAsTitle: 'sectionTitle',
    defaultColumns: ['sectionTitle', 'pageName', 'sectionType'],
    description: 'Reusable content sections for About Us and other pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      required: true,
      label: 'Section Title',
      admin: {
        description: 'e.g., "Our History", "Our Mission"',
      },
    },
    {
      name: 'pageName',
      type: 'select',
      required: true,
      options: [
        {
          label: 'About Us',
          value: 'about-us',
        },
        {
          label: 'Home',
          value: 'home',
        },
        {
          label: 'Services',
          value: 'services',
        },
        {
          label: 'Contact',
          value: 'contact',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      label: 'Page Name',
    },
    {
      name: 'sectionType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Text + Image (Right)',
          value: 'image-right',
        },
        {
          label: 'Text + Image (Left)',
          value: 'image-left',
        },
        {
          label: 'Text Only',
          value: 'text-only',
        },
        {
          label: 'Hero Section',
          value: 'hero',
        },
        {
          label: 'Quote Section',
          value: 'quote',
        },
      ],
      label: 'Section Layout Type',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Subheading',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Content',
      admin: {
        description: 'Main content of the section (supports rich text)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Section Image',
    },
    {
      name: 'imageAlt',
      type: 'text',
      label: 'Image Alt Text',
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background Color',
      admin: {
        description: 'Hex color code (e.g., #ffffff or #f9fafb)',
      },
    },
    {
      name: 'buttons',
      type: 'array',
      label: 'Call-to-Action Buttons',
      maxRows: 2,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'style',
          type: 'select',
          options: [
            {
              label: 'Primary',
              value: 'primary',
            },
            {
              label: 'Secondary',
              value: 'secondary',
            },
            {
              label: 'Outline',
              value: 'outline',
            },
          ],
          defaultValue: 'primary',
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
        description: 'Order in which sections appear on the page',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: true,
      label: 'Published',
    },
  ],
};
