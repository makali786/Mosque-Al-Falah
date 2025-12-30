import type { CollectionConfig } from 'payload';

export const AyatOfTheMonth: CollectionConfig = {
  slug: 'ayat-of-the-month',
  admin: {
    useAsTitle: 'englishTranslation',
    defaultColumns: ['surahName', 'ayahNumber', 'monthYear', 'isActive'],
    description: 'Featured Quranic verses for each month',
  },
  access: {
    read: () => true,
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
      name: 'monthYear',
      type: 'date',
      required: true,
      label: 'Month & Year',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
        },
        description: 'The month this ayat should be featured',
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
