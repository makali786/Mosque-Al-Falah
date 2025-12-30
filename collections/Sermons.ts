import type { CollectionConfig } from 'payload';

export const Sermons: CollectionConfig = {
  slug: 'sermons',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'speaker', 'sermonDate', 'isFeatured'],
    description: 'Khutbahs and Islamic lectures',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Sermon Title',
    },
    {
      name: 'speaker',
      type: 'relationship',
      // @ts-expect-error - Collection slug will be valid after types regeneration
      relationTo: 'imams',
      label: 'Speaker/Imam',
      admin: {
        description: 'Link to an Imam or leave blank for guest speakers',
      },
    },
    {
      name: 'guestSpeaker',
      type: 'group',
      label: 'Guest Speaker (if not from Imams list)',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Speaker Name',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Speaker Title/Role',
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          label: 'Speaker Photo',
        },
      ],
    },
    {
      name: 'sermonDate',
      type: 'date',
      required: true,
      label: 'Sermon Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Sermon Thumbnail',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Short Description',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Full Sermon Content/Notes',
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL',
      admin: {
        description: 'YouTube, Vimeo, or direct video link',
      },
    },
    {
      name: 'audioUrl',
      type: 'text',
      label: 'Audio URL',
      admin: {
        description: 'Direct link to audio file or streaming URL',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        {
          label: 'Jummah Khutbah',
          value: 'jummah',
        },
        {
          label: 'Taraweeh',
          value: 'taraweeh',
        },
        {
          label: 'Eid Khutbah',
          value: 'eid',
        },
        {
          label: 'Lecture',
          value: 'lecture',
        },
        {
          label: 'Series',
          value: 'series',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      defaultValue: 'jummah',
      label: 'Category',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'language',
      type: 'select',
      options: [
        {
          label: 'English',
          value: 'english',
        },
        {
          label: 'Arabic',
          value: 'arabic',
        },
        {
          label: 'Urdu',
          value: 'urdu',
        },
        {
          label: 'Bengali',
          value: 'bengali',
        },
        {
          label: 'Mixed',
          value: 'mixed',
        },
      ],
      defaultValue: 'english',
      label: 'Language',
    },
    {
      name: 'duration',
      type: 'text',
      label: 'Duration',
      admin: {
        description: 'e.g., "45 minutes" or "2:33"',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured',
      admin: {
        description: 'Show on homepage and featured sections',
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
