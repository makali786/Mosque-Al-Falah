import type { CollectionConfig } from 'payload';

export const Notices: CollectionConfig = {
  slug: 'notices',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'noticeDate', 'category', 'isCancelled'],
    description: 'Notice board items for community announcements',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Notice Title',
    },
    {
      name: 'noticeDate',
      type: 'date',
      required: true,
      label: 'Notice Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Events',
          value: 'events',
        },
        {
          label: 'News',
          value: 'news',
        },
        {
          label: 'Announcement',
          value: 'announcement',
        },
      ],
      defaultValue: 'news',
      label: 'Category',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Notice Content',
    },
    {
      name: 'isCancelled',
      type: 'checkbox',
      defaultValue: false,
      label: 'Event Cancelled',
      admin: {
        description: 'Mark this if the event has been cancelled',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: true,
      label: 'Published',
    },
    {
      name: 'isPinned',
      type: 'checkbox',
      defaultValue: false,
      label: 'Pin to Top',
      admin: {
        description: 'Keep this notice at the top of the notice board',
      },
    },
  ],
};
