import { CollectionConfig } from 'payload';

export const Locations: CollectionConfig = {
    slug: 'locations',
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'fullAddress'],
        description: 'Manage preset locations for events',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Location Name',
        },
        {
            name: 'fullAddress',
            type: 'textarea',
            label: 'Full Address',
        },
        {
            name: 'coordinates',
            type: 'group',
            label: 'Map Coordinates',
            fields: [
                {
                    name: 'latitude',
                    type: 'number',
                },
                {
                    name: 'longitude',
                    type: 'number',
                },
            ],
        },
        {
            name: 'googleMapsLink',
            type: 'text',
            label: 'Google Maps Link',
        },
    ],
};
