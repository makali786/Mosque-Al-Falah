import { createRevalidateHook } from '../lib/revalidation';
import type { CollectionConfig } from 'payload';

export const AyatOfTheMonth: CollectionConfig = {
  slug: 'ayat-of-the-month',
  orderable: true,
  admin: {
    useAsTitle: 'englishTranslation',
    defaultColumns: ['surahName', 'ayahNumber', 'isActive'],
    description: 'Featured Quranic verses for each day/month',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [createRevalidateHook('ayat-of-the-month')],
  },

  fields: [
    {
      name: 'surahName',
      type: 'text',
      required: true,
      label: 'Surah Name',
      admin: {
        description: 'e.g., "Ash-Shu\'ara"',
      },
    },
    {
      name: 'surahNumber',
      type: 'number',
      required: true,
      label: 'Surah Number',
      admin: {
        description: 'e.g., 26',
      },
    },
    {
      name: 'ayahNumber',
      type: 'number',
      required: true,
      label: 'Ayah Number',
      admin: {
        description: 'e.g., 80',
      },
    },
    {
      name: 'arabicText',
      type: 'text',
      label: 'Arabic Text',
      admin: {
        description: 'Arabic verse text',
      },
    },
    {
      name: 'timing',
      type: 'group',
      label: 'Display Timing',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          label: 'Start Date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          required: true,
          label: 'End Date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
      ],
    },
    {
      name: 'recurrence',
      type: 'group',
      label: 'Display Recurrence',
      fields: [
        {
          name: 'isRecurring',
          type: 'checkbox',
          defaultValue: false,
          label: 'Recurring Item',
          admin: {
            description: 'Enable if this item repeats on a schedule',
          },
        },
        {
          name: 'frequency',
          type: 'select',
          options: [
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
          ],
          label: 'Repeat Frequency',
          admin: {
            condition: (data, siblingData) => siblingData?.isRecurring,
            description: 'How often the item repeats',
          },
        },
        {
          name: 'weeklyPattern',
          type: 'select',
          options: [
            { label: 'Sunday', value: '0' },
            { label: 'Monday', value: '1' },
            { label: 'Tuesday', value: '2' },
            { label: 'Wednesday', value: '3' },
            { label: 'Thursday', value: '4' },
            { label: 'Friday', value: '5' },
            { label: 'Saturday', value: '6' },
          ],
          hasMany: true,
          label: 'Days of Week',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.isRecurring && siblingData?.frequency === 'weekly',
            description: 'Select which days of the week the item repeats',
          },
        },
        {
          name: 'monthlyDay',
          type: 'number',
          min: 1,
          max: 31,
          label: 'Day of Month',
          admin: {
            description: 'Which day of the month (1-31)',
            condition: (data, siblingData) =>
              siblingData?.isRecurring && siblingData?.frequency === 'monthly',
          },
        },
        {
          name: 'recurrenceEnd',
          type: 'group',
          label: 'Recurrence End',
          admin: {
            condition: (data, siblingData) => siblingData?.isRecurring,
            description: 'When should the recurring item stop',
          },
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                {
                  label: 'No end date (continues indefinitely)',
                  value: 'never',
                },
                { label: 'End on a specific date', value: 'date' },
                { label: 'End after a number of occurrences', value: 'count' },
              ],
              defaultValue: 'never',
              label: 'End Type',
            },
            {
              name: 'endDate',
              type: 'date',
              label: 'End Date',
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                },
                condition: (data, siblingData) => siblingData?.type === 'date',
                description: 'Last date the item will display',
              },
            },
            {
              name: 'occurrences',
              type: 'number',
              min: 1,
              label: 'Number of Occurrences',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'count',
                description: 'How many times the item will repeat',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'arabicCalligraphyImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Arabic Calligraphy Image (SVG)',
      admin: {
        description: 'Beautiful calligraphy representation of the verse',
      },
    },
    {
      name: 'englishTranslation',
      type: 'textarea',
      required: true,
      label: 'English Translation',
    },
    {
      name: 'transliteration',
      type: 'textarea',
      label: 'Transliteration',
    },
    {
      name: 'tafsir',
      type: 'richText',
      label: 'Tafsir/Explanation',
      admin: {
        description: 'Detailed explanation of the verse',
      },
    },
    {
      name: 'defaultTab',
      type: 'select',
      label: 'Default Tab to Show',
      defaultValue: 'audio',
      options: [
        { label: 'Audio', value: 'audio' },
        { label: 'Video', value: 'video' },
        { label: 'Text/Image', value: 'default' },
      ],
      admin: {
        description: 'Which tab should be open by default when this record is shown',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video Explanation URL',
      admin: {
        description: 'YouTube or Vimeo URL for video tafsir',
      },
    },
    {
      name: 'videoTitle',
      type: 'text',
      label: 'Video Title',
    },
    {
      name: 'videoThumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Video Thumbnail',
    },
    {
      name: 'audioUrl',
      type: 'text',
      label: 'Audio Recitation URL',
      admin: {
        description: 'Direct link to audio file or streaming URL',
      },
    },
    {
      name: 'reciter',
      type: 'text',
      label: 'Reciter Name',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: "Set as current month's ayat",
      },
    },
  ],
};
