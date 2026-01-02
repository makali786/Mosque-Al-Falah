import type { GlobalConfig } from 'payload';

export const BlogsPage: GlobalConfig = {
  slug: 'blogs-page',
  label: 'Blogs Page',
  admin: {
    description: 'Manage all content and settings for the Blogs page',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ============================================================================
    // Page Header
    // ============================================================================
    {
      name: 'pageHeader',
      type: 'group',
      label: 'Page Header',
      fields: [
        {
          name: 'pageTitle',
          type: 'text',
          defaultValue: 'Blogs',
          label: 'Page Title',
        },
        {
          name: 'breadcrumb',
          type: 'text',
          defaultValue: 'Home > Blogs',
          label: 'Breadcrumb Navigation',
        },
        {
          name: 'showBreadcrumb',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Breadcrumb',
        },
      ],
    },

    // ============================================================================
    // Category Filter
    // ============================================================================
    {
      name: 'categoryFilter',
      type: 'group',
      label: 'Category Filter',
      fields: [
        {
          name: 'showCategoryFilter',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Category Filter Tabs',
        },
        {
          name: 'allCategoriesLabel',
          type: 'text',
          defaultValue: 'All Categories',
          label: '"All Categories" Label',
        },
        {
          name: 'categories',
          type: 'array',
          label: 'Category Tabs',
          admin: {
            description: 'Categories to show as filter tabs',
          },
          fields: [
            {
              name: 'categorySlug',
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
              ],
              label: 'Category',
            },
            {
              name: 'displayLabel',
              type: 'text',
              required: true,
              label: 'Display Label',
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Search Bar
    // ============================================================================
    {
      name: 'searchBar',
      type: 'group',
      label: 'Search Bar',
      fields: [
        {
          name: 'showSearch',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Search Bar',
        },
        {
          name: 'searchPlaceholder',
          type: 'text',
          defaultValue: 'Search',
          label: 'Search Placeholder Text',
        },
      ],
    },

    // ============================================================================
    // Grid Display Settings
    // ============================================================================
    {
      name: 'gridSettings',
      type: 'group',
      label: 'Grid Display Settings',
      fields: [
        {
          name: 'gridColumns',
          type: 'select',
          options: [
            { label: '2 Columns', value: '2' },
            { label: '3 Columns', value: '3' },
            { label: '4 Columns', value: '4' },
          ],
          defaultValue: '3',
          label: 'Grid Columns',
        },
        {
          name: 'itemsPerPage',
          type: 'number',
          defaultValue: 6,
          label: 'Items Per Page',
          admin: {
            description: 'Number of blog posts to show before "Load More"',
          },
        },
        {
          name: 'showLoadMore',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Load More" Button',
        },
        {
          name: 'loadMoreButtonText',
          type: 'text',
          defaultValue: 'Load More',
          label: 'Load More Button Text',
        },
      ],
    },

    // ============================================================================
    // Blog Card Appearance
    // ============================================================================
    {
      name: 'cardAppearance',
      type: 'group',
      label: 'Blog Card Appearance',
      fields: [
        {
          name: 'showFeaturedImage',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Featured Image',
        },
        {
          name: 'showCategoryBadge',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Category Badge',
        },
        {
          name: 'showDate',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Published Date',
        },
        {
          name: 'showExcerpt',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Excerpt',
        },
        {
          name: 'showReadMoreButton',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Read More" Button',
        },
        {
          name: 'readMoreButtonText',
          type: 'text',
          defaultValue: 'Read More',
          label: 'Read More Button Text',
        },
        {
          name: 'cardStyle',
          type: 'select',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'With Shadow', value: 'shadow' },
            { label: 'Bordered', value: 'bordered' },
          ],
          defaultValue: 'shadow',
          label: 'Card Style',
        },
      ],
    },

    // ============================================================================
    // Default Sorting
    // ============================================================================
    {
      name: 'defaultSorting',
      type: 'group',
      label: 'Default Sorting',
      fields: [
        {
          name: 'sortBy',
          type: 'select',
          options: [
            { label: 'Newest First', value: 'date-desc' },
            { label: 'Oldest First', value: 'date-asc' },
            { label: 'Most Viewed', value: 'views-desc' },
            { label: 'Title A-Z', value: 'title-asc' },
          ],
          defaultValue: 'date-desc',
          label: 'Default Sort Order',
        },
        {
          name: 'showFeaturedFirst',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Featured Posts First',
        },
      ],
    },

    // ============================================================================
    // Blog Detail Page Settings
    // ============================================================================
    {
      name: 'detailPage',
      type: 'group',
      label: 'Blog Detail Page Settings',
      fields: [
        {
          name: 'showHeroSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Hero Section',
          admin: {
            description: 'Full-width hero with featured image and title',
          },
        },
        {
          name: 'showBreadcrumbOnDetail',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Breadcrumb on Detail Page',
        },
        {
          name: 'showPublishedDate',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Published Date',
        },
        {
          name: 'showReadingTime',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Reading Time',
        },
        {
          name: 'showAuthorInfo',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Author Information',
        },
        {
          name: 'showTags',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Tags',
        },
        {
          name: 'showSocialShare',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Social Share Buttons',
        },
        {
          name: 'showRelatedPosts',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Related Posts',
        },
        {
          name: 'relatedPostsTitle',
          type: 'text',
          defaultValue: 'Related Post',
          label: 'Related Posts Section Title',
        },
        {
          name: 'relatedPostsCount',
          type: 'number',
          defaultValue: 3,
          label: 'Number of Related Posts',
        },
      ],
    },

    // ============================================================================
    // Comments Settings
    // ============================================================================
    {
      name: 'commentsSettings',
      type: 'group',
      label: 'Comments Settings',
      fields: [
        {
          name: 'enableComments',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Comments System',
        },
        {
          name: 'commentsSectionTitle',
          type: 'text',
          defaultValue: 'Comments',
          label: 'Comments Section Title',
        },
        {
          name: 'leaveReplyTitle',
          type: 'text',
          defaultValue: 'Leave a Reply',
          label: 'Leave Reply Section Title',
        },
        {
          name: 'requireApproval',
          type: 'checkbox',
          defaultValue: true,
          label: 'Require Admin Approval',
          admin: {
            description: 'Comments must be approved before showing',
          },
        },
        {
          name: 'showUserAvatars',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show User Avatars',
        },
        {
          name: 'allowReplies',
          type: 'checkbox',
          defaultValue: true,
          label: 'Allow Replies to Comments',
        },
        {
          name: 'commentFormFields',
          type: 'group',
          label: 'Comment Form Fields',
          fields: [
            {
              name: 'nameLabel',
              type: 'text',
              defaultValue: 'Full Name *',
              label: 'Name Field Label',
            },
            {
              name: 'namePlaceholder',
              type: 'text',
              defaultValue: 'Toufiq Hasan',
              label: 'Name Placeholder',
            },
            {
              name: 'emailLabel',
              type: 'text',
              defaultValue: 'Email *',
              label: 'Email Field Label',
            },
            {
              name: 'emailPlaceholder',
              type: 'text',
              defaultValue: 'Enter your Email',
              label: 'Email Placeholder',
            },
            {
              name: 'commentLabel',
              type: 'text',
              defaultValue: 'Comments',
              label: 'Comment Field Label',
            },
            {
              name: 'commentPlaceholder',
              type: 'text',
              defaultValue: 'content',
              label: 'Comment Placeholder',
            },
            {
              name: 'submitButtonText',
              type: 'text',
              defaultValue: 'Post comment',
              label: 'Submit Button Text',
            },
            {
              name: 'saveInfoCheckboxLabel',
              type: 'text',
              defaultValue:
                'Save my name, email, and website in this browser for the next time I comment.',
              label: 'Save Info Checkbox Label',
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Bottom Quote Section
    // ============================================================================
    {
      name: 'bottomQuote',
      type: 'group',
      label: 'Bottom Quote Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Bottom Quote',
        },
        {
          name: 'quoteText',
          type: 'textarea',
          required: true,
          defaultValue:
            'Whoever guides someone to goodness will have a reward like the one who did it.',
          label: 'Quote Text',
        },
        {
          name: 'author',
          type: 'text',
          required: true,
          defaultValue: 'Prophet Muhammad ﷺ',
          label: 'Quote Author',
        },
        {
          name: 'showShareButton',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Share Button',
        },
        {
          name: 'shareButtonText',
          type: 'text',
          defaultValue: 'Share this page',
          label: 'Share Button Text',
        },
        {
          name: 'showDonateButton',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Donate Button',
        },
        {
          name: 'donateButtonText',
          type: 'text',
          defaultValue: 'Donate Now',
          label: 'Donate Button Text',
        },
      ],
    },

    // ============================================================================
    // Empty State Messages
    // ============================================================================
    {
      name: 'emptyStates',
      type: 'group',
      label: 'Empty State Messages',
      fields: [
        {
          name: 'noPostsMessage',
          type: 'textarea',
          defaultValue: 'No blog posts available at this time.',
          label: 'No Posts Message',
        },
        {
          name: 'noSearchResults',
          type: 'textarea',
          defaultValue: 'No posts found. Try adjusting your search or filters.',
          label: 'No Search Results Message',
        },
      ],
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
          admin: {
            description: 'Leave blank to use default "Blogs - Masjid Al-Falah"',
          },
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
