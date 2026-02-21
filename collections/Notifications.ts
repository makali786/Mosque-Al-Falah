import type { CollectionConfig } from 'payload';

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  orderable: true,
  admin: {
    useAsTitle: 'title',
    description: 'Global notification bar management',
    group: 'Appearance',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal reference name',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: false,
      admin: {
        description: 'Check to show this notification on the website',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Simple Announcement', value: 'simple' },
        { label: "Jumu'ah Schedule", value: 'jummah' },
        { label: 'Eid Schedule', value: 'eid' },
      ],
      defaultValue: 'simple',
    },
    {
      name: 'displayRule',
      type: 'select',
      required: true,
      options: [
        { label: 'Always Show', value: 'always' },
        { label: 'Once Per Session', value: 'once_per_session' },
        { label: 'Until Dismissed', value: 'until_dismissed' },
      ],
      defaultValue: 'until_dismissed',
      admin: {
        description: 'Control how often the user sees this notification',
      },
    },
    // Simple Variant Fields
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData.type === 'simple',
      },
    },
    {
      name: 'links',
      type: 'array',
      maxRows: 2,
      admin: {
        condition: (_, siblingData) => siblingData.type === 'simple',
      },
      fields: [
        {
          name: 'linkType',
          type: 'select',
          defaultValue: 'custom',
          options: [
            { label: 'Custom URL', value: 'custom' },
            { label: 'Donation Appeal', value: 'appeal' },
            { label: 'Event', value: 'event' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData.linkType === 'custom',
          },
        },
        {
          name: 'relatedAppeal',
          type: 'relationship',
          relationTo: 'donation-appeals',
          admin: {
            condition: (_, siblingData) => siblingData.linkType === 'appeal',
          },
        },
        {
          name: 'relatedEvent',
          type: 'relationship',
          relationTo: 'events',
          admin: {
            condition: (_, siblingData) => siblingData.linkType === 'event',
          },
        },
        {
          name: 'style',
          type: 'select',
          options: [
            { label: 'Primary (Solid)', value: 'primary' },
            { label: 'Secondary (Outline/Light)', value: 'secondary' },
          ],
          defaultValue: 'primary',
        },
      ],
    },
    // Jumu'ah Variant Fields
    {
      name: 'jummahDate',
      type: 'text',
      label: "Jumu'ah Date/Text",
      defaultValue: 'This Friday',
      admin: {
        condition: (_, siblingData) => siblingData.type === 'jummah',
      },
    },
    {
      name: 'jummah1',
      type: 'group',
      label: "1st Jumu'ah",
      admin: {
        condition: (_, siblingData) => siblingData.type === 'jummah',
      },
      fields: [
        {
          name: 'time',
          type: 'text',
          required: true,
          defaultValue: '12:30 PM',
        },
        { name: 'athan', type: 'text', defaultValue: '12:15 PM' },
        { name: 'imam', type: 'text', required: true },
        {
          name: 'khutbahLang',
          type: 'text',
          label: 'Khutbah Language',
          defaultValue: 'English',
        },
      ],
    },
    {
      name: 'jummah2',
      type: 'group',
      label: "2nd Jumu'ah",
      admin: {
        condition: (_, siblingData) => siblingData.type === 'jummah',
      },
      fields: [
        { name: 'time', type: 'text', required: true, defaultValue: '1:30 PM' },
        { name: 'athan', type: 'text', defaultValue: '1:15 PM' },
        { name: 'imam', type: 'text', required: true },
        {
          name: 'khutbahLang',
          type: 'text',
          label: 'Khutbah Language',
          defaultValue: 'Arabic',
        },
      ],
    },
    {
      name: 'fundraising',
      type: 'group',
      label: 'Fundraising Stats',
      admin: {
        condition: (_, siblingData) =>
          siblingData.type === 'jummah' || siblingData.type === 'eid',
      },
      fields: [
        {
          name: 'source',
          type: 'select',
          defaultValue: 'manual',
          options: [
            { label: 'Manual Entry', value: 'manual' },
            { label: 'From Donation Appeal', value: 'appeal' },
          ],
        },
        {
          name: 'relatedAppeal',
          type: 'relationship',
          relationTo: 'donation-appeals',
          admin: {
            condition: (_, siblingData) => siblingData.source === 'appeal',
          },
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Friday Giving',
          admin: {
            condition: (_, siblingData) => siblingData.source === 'manual',
          },
        },
        {
          name: 'donorCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            condition: (_, siblingData) => siblingData.source === 'manual',
          },
        },
        {
          name: 'amountRaised',
          type: 'number',
          defaultValue: 0,
          admin: {
            condition: (_, siblingData) => siblingData.source === 'manual',
          },
        },
      ],
    },
    // Eid Variant Fields
    {
      name: 'eidMessage',
      type: 'textarea',
      label: 'Eid Message',
      defaultValue: 'Join us for Eid Salah at Masjid Al-Falah. Eid Mubarak!',
      admin: {
        condition: (_, siblingData) => siblingData.type === 'eid',
      },
    },
    {
      name: 'eidJamaats',
      type: 'array',
      label: 'Eid Jamaat Times',
      minRows: 1,
      admin: {
        condition: (_, siblingData) => siblingData.type === 'eid',
      },
      fields: [
        { name: 'time', type: 'text', required: true },
        { name: 'imam', type: 'text' },
        { name: 'notes', type: 'text' },
      ],
    },
  ],
};
