import { createRevalidateHook } from '../lib/revalidation';
import { GlobalConfig } from 'payload';

export const PrayerTimeSettings: GlobalConfig = {
  slug: 'prayer-time-settings',
  admin: {
    components: {
      views: {
        edit: {
          root: {
            Component:
              './app/(payload)/components/PrayerTimes/PrayerTimesManager',
          },
        },
      },
    },
  },
  access: {
    read: () => true,
    update: () => true, // Allow updates from custom view
  },
  hooks: {

    afterChange: [createRevalidateHook('prayer-time-settings')],

  },

  fields: [
    {
      name: 'calculationMethod',
      type: 'select',
      options: [
        { label: 'Automatic Calculation', value: 'auto' },
        { label: 'Import Custom Times', value: 'custom' },
      ],
      defaultValue: 'auto',
    },
    // Jumu'ah Settings
    {
      name: 'jumuahSettings',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'replacesDhuhr',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'khutbahTime',
          type: 'text', // "HH:mm"
          defaultValue: '13:00',
        },
        {
          name: 'iqamahTime',
          type: 'text', // "HH:mm"
          defaultValue: '13:30',
        },
        {
          name: 'enableSecondJumuah',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'secondKhutbahTime',
          type: 'text',
          defaultValue: '14:00',
        },
        {
          name: 'secondIqamahTime',
          type: 'text',
          defaultValue: '14:30',
        },
      ],
    },
    // Ramadan Settings
    {
      name: 'ramadanSettings',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'startDate',
          type: 'date',
        },
        {
          name: 'endDate',
          type: 'date',
        },
        {
          name: 'showCountdown',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'imsakOffset',
          type: 'number',
          defaultValue: -15,
        },
        {
          name: 'iftarOffset',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
  ],
};
