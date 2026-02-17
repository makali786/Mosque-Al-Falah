import type { CollectionConfig } from 'payload';

export const Popups: CollectionConfig = {
    slug: 'popups',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'isActive', 'priority', 'type'],
        description: 'Manage popup modals for daily messages, notices, and announcements',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            label: 'Popup Title',
        },
        {
            name: 'isActive',
            type: 'checkbox',
            defaultValue: true,
            label: 'Active',
            admin: {
                description: 'Only active popups will be displayed',
            },
        },
        {
            name: 'priority',
            type: 'number',
            defaultValue: 10,
            label: 'Priority',
            admin: {
                description: 'Higher numbers show first (1-100)',
            },
        },
        {
            name: 'type',
            type: 'select',
            options: [
                { label: 'General Message', value: 'general' },
                { label: 'Daily Reminder', value: 'daily_reminder' },
                { label: 'Ramadan Special', value: 'ramadan' },
            ],
            defaultValue: 'general',
            required: true,
        },
        {
            name: 'frequency',
            type: 'select',
            label: 'Show Frequency',
            options: [
                { label: 'Every Session', value: 'always' },
                { label: 'Once Per Day', value: 'once_per_day' },
                { label: 'Once Only', value: 'once_ever' },
            ],
            defaultValue: 'once_per_day',
            required: true,
        },
        {
            name: 'scheduling',
            type: 'group',
            label: 'Scheduling',
            fields: [
                {
                    name: 'startDate',
                    type: 'date',
                    label: 'Start Date (Optional)',
                    admin: {
                        date: {
                            pickerAppearance: 'dayAndTime',
                        },
                    },
                },
                {
                    name: 'endDate',
                    type: 'date',
                    label: 'End Date (Optional)',
                    admin: {
                        date: {
                            pickerAppearance: 'dayAndTime',
                        },
                    },
                },
            ],
        },
        {
            name: 'content',
            type: 'group',
            label: 'Content',
            fields: [
                {
                    name: 'message',
                    type: 'richText',
                    label: 'Message Content',
                },
                {
                    name: 'backgroundImage',
                    type: 'upload',
                    relationTo: 'media',
                    label: 'Background Image (Optional)',
                },
                {
                    name: 'contentMedia',
                    type: 'upload',
                    relationTo: 'media',
                    label: 'Featured Image/Video (Optional)',
                },
                {
                    name: 'videoUrl',
                    type: 'text',
                    label: 'Video URL (YouTube/Vimeo) - Optional',
                },
            ],
        },
        {
            name: 'actions',
            type: 'array',
            label: 'Buttons',
            maxRows: 2,
            fields: [
                {
                    name: 'label',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'link',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'style',
                    type: 'select',
                    options: [
                        { label: 'Primary (Gold)', value: 'primary' },
                        { label: 'Secondary (Outline)', value: 'secondary' },
                    ],
                    defaultValue: 'primary',
                },
            ],
        },
    ],
};
