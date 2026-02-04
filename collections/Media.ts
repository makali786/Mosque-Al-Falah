import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },

  upload: {
    disableLocalStorage: true, // 🔥 VERY IMPORTANT
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // Only run on creation
        if (operation === 'create' || !data.alt) {
          // Use filename as default alt, stripping extension
          const filename = req.files?.file?.name || 'Uploaded image';
          const altText = filename.split('.').slice(0, -1).join(' ');

          return {
            ...data,
            alt: altText || 'Image',
          };
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
