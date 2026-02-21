import { createRevalidateHook } from '../lib/revalidation';
import { CollectionConfig } from 'payload';

export const PrayerTimes: CollectionConfig = {
  slug: 'prayer-times',
  orderable: true,
  admin: {
    useAsTitle: 'date',
    hidden: true, // Managed via Global View
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  hooks: {

    afterChange: [createRevalidateHook('prayer-times')],

  },

  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      unique: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'hijriDate',
      type: 'text',
    },
    // Adhan Times
    {
      type: 'row',
      fields: [
        {
          name: 'fajr',
          type: 'text', // Using text for "HH:mm" format
          required: true,
        },
        {
          name: 'sunrise',
          type: 'text',
          required: true,
        },
        {
          name: 'dhuhr',
          type: 'text',
          required: true,
        },
        {
          name: 'asr',
          type: 'text',
          required: true,
        },
        {
          name: 'maghrib',
          type: 'text',
          required: true,
        },
        {
          name: 'isha',
          type: 'text',
          required: true,
        },
      ],
    },
    // Iqamah Delays (in minutes after Adhan)
    {
      type: 'row',
      fields: [
        {
          name: 'fajrIqamahDelay',
          type: 'number',
          defaultValue: 20,
          admin: { description: 'Minutes after Fajr Adhan' },
        },
        {
          name: 'dhuhrIqamahDelay',
          type: 'number',
          defaultValue: 15,
          admin: { description: 'Minutes after Dhuhr Adhan' },
        },
        {
          name: 'asrIqamahDelay',
          type: 'number',
          defaultValue: 15,
          admin: { description: 'Minutes after Asr Adhan' },
        },
        {
          name: 'maghribIqamahDelay',
          type: 'number',
          defaultValue: 10,
          admin: { description: 'Minutes after Maghrib Adhan' },
        },
        {
          name: 'ishaIqamahDelay',
          type: 'number',
          defaultValue: 15,
          admin: { description: 'Minutes after Isha Adhan' },
        },
      ],
    },
    {
      name: 'isJumuah',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
};
