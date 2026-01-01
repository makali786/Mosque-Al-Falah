import type { CollectionConfig } from 'payload';

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: {
    singular: 'Blog Post',
    plural: 'Blog Posts',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'category',
      'author',
      'publishedDate',
      'isFeatured',
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
      label: 'Blog Title',
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
      name: 'excerpt',
      type: 'textarea',
      required: true,
      label: 'Short Excerpt',
      maxLength: 200,
      admin: {
        description: 'Brief description shown on listing page',
      },
    },

    // ============================================================================
    // Featured Image
    // ============================================================================
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Featured Image',
      admin: {
        description: 'Main image shown on cards and hero section',
      },
    },

    // ============================================================================
    // Content
    // ============================================================================
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Full Content',
      admin: {
        description: 'Main blog post content with rich formatting',
      },
    },

    // ============================================================================
    // Category & Tags
    // ============================================================================
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Hadith', value: 'hadith' },
        { label: 'Quran', value: 'quran' },
        { label: 'Salah', value: 'salah' },
        { label: 'History', value: 'history' },
        { label: 'Ramadan', value: 'ramadan' },
        { label: 'Education', value: 'education' },
        { label: 'Community', value: 'community' },
        { label: 'General', value: 'general' },
      ],
      label: 'Category',
      admin: {
        description: 'Primary category (shown as badge on card)',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Tags shown at bottom of blog post',
      },
    },

    // ============================================================================
    // Author Information
    // ============================================================================
    {
      name: 'author',
      type: 'group',
      label: 'Author Information',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          defaultValue: 'Masjid Al-Falah',
          label: 'Author Name',
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          label: 'Author Avatar',
        },
        {
          name: 'bio',
          type: 'textarea',
          label: 'Author Bio',
        },
      ],
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
        description: 'Show at top of blog listing',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: true,
      label: 'Published',
    },

    // ============================================================================
    // Comments Settings
    // ============================================================================
    {
      name: 'enableComments',
      type: 'checkbox',
      defaultValue: true,
      label: 'Enable Comments',
    },
    {
      name: 'comments',
      type: 'array',
      label: 'Comments',
      admin: {
        condition: data => data?.enableComments,
      },
      fields: [
        {
          name: 'userName',
          type: 'text',
          required: true,
          label: 'User Name',
        },
        {
          name: 'userEmail',
          type: 'email',
          required: true,
          label: 'User Email',
        },
        {
          name: 'userAvatar',
          type: 'upload',
          relationTo: 'media',
          label: 'User Avatar',
        },
        {
          name: 'comment',
          type: 'textarea',
          required: true,
          label: 'Comment Text',
        },
        {
          name: 'commentDate',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
          label: 'Comment Date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'isApproved',
          type: 'checkbox',
          defaultValue: false,
          label: 'Approved',
          admin: {
            description: 'Approve comment to show on frontend',
          },
        },
        {
          name: 'replies',
          type: 'array',
          label: 'Replies',
          fields: [
            {
              name: 'userName',
              type: 'text',
              required: true,
              label: 'User Name',
            },
            {
              name: 'replyText',
              type: 'textarea',
              required: true,
              label: 'Reply Text',
            },
            {
              name: 'replyDate',
              type: 'date',
              required: true,
              defaultValue: () => new Date().toISOString(),
              label: 'Reply Date',
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Related Posts
    // ============================================================================
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'blog-posts',
      hasMany: true,
      label: 'Related Posts',
      admin: {
        description: 'Manually select related blog posts',
      },
    },

    // ============================================================================
    // Reading Time
    // ============================================================================
    {
      name: 'readingTime',
      type: 'number',
      label: 'Reading Time (minutes)',
      admin: {
        description: 'Estimated reading time (auto-calculated or manual)',
      },
    },

    // ============================================================================
    // View Count
    // ============================================================================
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
      label: 'View Count',
      admin: {
        description: 'Number of times this post has been viewed',
      },
    },

    // ============================================================================
    // SEO Settings
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
