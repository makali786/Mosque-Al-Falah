import type { CollectionConfig } from 'payload';

export const Committees: CollectionConfig = {
  slug: 'committees',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', 'isActive'],
    description: 'Mosque committees and their members',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Committee Name',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Committee Description',
    },
    {
      name: 'members',
      type: 'array',
      label: 'Committee Members',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Member Name',
        },
        {
          name: 'role',
          type: 'text',
          required: true,
          label: 'Role/Position',
          admin: {
            description: 'e.g., "Chairman", "Secretary", "Member"',
          },
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Member Photo',
        },
        {
          name: 'bio',
          type: 'textarea',
          label: 'Short Biography',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Contact Email',
        },
      ],
    },
    {
      name: 'responsibilities',
      type: 'richText',
      label: 'Key Responsibilities',
    },
    {
      name: 'meetingSchedule',
      type: 'text',
      label: 'Meeting Schedule',
      admin: {
        description: 'When does this committee meet?',
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
