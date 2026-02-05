import type { CollectionConfig } from 'payload';

export const PageViews: CollectionConfig = {
    slug: 'page-views',
    admin: {
        useAsTitle: 'path',
        defaultColumns: ['path', 'views', 'updatedAt'],
        description: 'Track page view statistics',
        hidden: true, // Hidden from main navigation
    },
    access: {
        read: () => true,
        create: () => true,
        update: () => true,
    },
    fields: [
        {
            name: 'path',
            type: 'text',
            required: true,
            unique: true,
            label: 'Page Path',
            admin: {
                description: 'URL path of the page',
            },
        },
        {
            name: 'views',
            type: 'number',
            required: true,
            defaultValue: 0,
            label: 'Total Views',
            admin: {
                description: 'Total number of page views',
            },
        },
        {
            name: 'lastViewed',
            type: 'date',
            label: 'Last Viewed',
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
        },
    ],
    timestamps: true,
};
