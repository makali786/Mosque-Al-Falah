import type { CollectionConfig } from 'payload';

export const MediaItems: CollectionConfig = {
  slug: 'media-items',
  labels: {
    singular: 'Media Item',
    plural: 'Media Items',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'mediaType',
      'category',
      'publishedDate',
      'isActive',
    ],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ============================================================================
    // Basic Information
    // ============================================================================
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'URL-friendly version of the title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Short Description',
      maxLength: 200,
    },
    {
      name: 'fullDescription',
      type: 'richText',
      label: 'Full Description',
    },

    // ============================================================================
    // Media Type
    // ============================================================================
    {
      name: 'mediaType',
      type: 'select',
      required: true,
      options: [
        { label: 'Video', value: 'video' },
        { label: 'Audio/Podcast', value: 'audio' },
        { label: 'Photo Gallery', value: 'gallery' },
        { label: 'Live Stream', value: 'live' },
      ],
      defaultValue: 'video',
      label: 'Media Type',
    },

    // ============================================================================
    // Media Content
    // ============================================================================
    {
      name: 'mediaContent',
      type: 'group',
      label: 'Media Content',
      fields: [
        // Video Fields
        {
          name: 'videoFile',
          type: 'upload',
          relationTo: 'media',
          label: 'Video File',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.mediaType === 'video' || data?.mediaType === 'video',
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: 'Video URL (YouTube, Vimeo, etc.)',
          admin: {
            description: 'External video URL if not uploading file',
            condition: (data, siblingData) =>
              siblingData?.mediaType === 'video' || data?.mediaType === 'video',
          },
        },
        {
          name: 'videoDuration',
          type: 'text',
          label: 'Duration (e.g., 45:30)',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.mediaType === 'video' || data?.mediaType === 'video',
          },
        },

        // Audio/Podcast Fields
        {
          name: 'audioFile',
          type: 'upload',
          relationTo: 'media',
          label: 'Audio File',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.mediaType === 'audio' || data?.mediaType === 'audio',
          },
        },
        {
          name: 'audioUrl',
          type: 'text',
          label: 'Audio URL (Podcast link)',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.mediaType === 'audio' || data?.mediaType === 'audio',
          },
        },
        {
          name: 'audioDuration',
          type: 'text',
          label: 'Duration',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.mediaType === 'audio' || data?.mediaType === 'audio',
          },
        },
        {
          name: 'podcastEpisodeNumber',
          type: 'number',
          label: 'Episode Number',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.mediaType === 'audio' || data?.mediaType === 'audio',
          },
        },

        // Photo Gallery Fields
        {
          name: 'galleryImages',
          type: 'array',
          label: 'Gallery Images',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.mediaType === 'gallery' ||
              data?.mediaType === 'gallery',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'caption',
              type: 'text',
            },
          ],
        },

        // Live Stream Fields
        {
          name: 'isLive',
          type: 'checkbox',
          defaultValue: false,
          label: 'Currently Live',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.mediaType === 'live' || data?.mediaType === 'live',
          },
        },
        {
          name: 'liveStreamUrl',
          type: 'text',
          label: 'Live Stream URL',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.mediaType === 'live' || data?.mediaType === 'live',
          },
        },
        {
          name: 'scheduledStartTime',
          type: 'date',
          label: 'Scheduled Start Time',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            condition: (data, siblingData) =>
              siblingData?.mediaType === 'live' || data?.mediaType === 'live',
          },
        },
      ],
    },

    // ============================================================================
    // Thumbnail
    // ============================================================================
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Thumbnail Image',
      admin: {
        description: 'Card image shown in grid/list view',
      },
    },

    // ============================================================================
    // Category & Tags
    // ============================================================================
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Lectures', value: 'lectures' },
        { label: 'Events', value: 'events' },
        { label: 'Community', value: 'community' },
        { label: 'Education', value: 'education' },
        { label: 'Ramadan', value: 'ramadan' },
        { label: 'Youth', value: 'youth' },
        { label: 'Sisters', value: 'sisters' },
        { label: 'General', value: 'general' },
      ],
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

    // ============================================================================
    // Related Information
    // ============================================================================
    {
      name: 'speaker',
      type: 'relationship',
      // @ts-expect-error - Collection slug will be valid after types regeneration
      relationTo: 'imams',
      label: 'Speaker/Imam',
      admin: {
        description: 'Associated speaker or imam',
      },
    },
    {
      name: 'relatedEvent',
      type: 'relationship',
      // @ts-expect-error - Collection slug will be valid after types regeneration
      relationTo: 'events',
      label: 'Related Event',
    },

    // ============================================================================
    // Publishing
    // ============================================================================
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      label: 'Published Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured',
      admin: {
        description: 'Show at top of media page',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },

    // ============================================================================
    // Donation Integration
    // ============================================================================
    {
      name: 'enableDonation',
      type: 'checkbox',
      defaultValue: false,
      label: 'Enable Donation Section',
      admin: {
        description: 'Show donation box on media detail page',
      },
    },
    {
      name: 'donationSettings',
      type: 'group',
      label: 'Donation Settings',
      admin: {
        condition: (data, siblingData) =>
          siblingData?.enableDonation || data?.enableDonation,
      },
      fields: [
        {
          name: 'donationTitle',
          type: 'text',
          defaultValue: 'Donate to Masjid Al Falah',
          label: 'Donation Title',
        },
        {
          name: 'donationDescription',
          type: 'textarea',
          defaultValue: 'description from backend here in 40 words',
          label: 'Donation Description',
          maxLength: 200,
        },
        {
          name: 'suggestedAmounts',
          type: 'array',
          label: 'Suggested Amounts',
          fields: [
            {
              name: 'amount',
              type: 'number',
              required: true,
            },
          ],
        },
        {
          name: 'donationUrl',
          type: 'text',
          label: 'Donation Page URL',
          defaultValue: '/appeals',
        },
      ],
    },

    // ============================================================================
    // Stats & Engagement
    // ============================================================================
    {
      name: 'stats',
      type: 'group',
      label: 'Statistics',
      fields: [
        {
          name: 'viewCount',
          type: 'number',
          defaultValue: 0,
          label: 'Views',
        },
        {
          name: 'likeCount',
          type: 'number',
          defaultValue: 0,
          label: 'Likes',
        },
        {
          name: 'shareCount',
          type: 'number',
          defaultValue: 0,
          label: 'Shares',
        },
      ],
    },

    // ============================================================================
    // SEO
    // ============================================================================
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Social Share Image',
        },
      ],
    },
  ],
};
