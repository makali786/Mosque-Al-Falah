import type { GlobalConfig } from 'payload';

export const MediaPage: GlobalConfig = {
  slug: 'media-page',
  label: 'Media Page',
  admin: {
    description: 'Manage all content and settings for the Media page',
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
          defaultValue: 'Media',
          label: 'Page Title',
        },
        {
          name: 'breadcrumb',
          type: 'text',
          defaultValue: 'Home > Media',
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
    // Filter Tabs
    // ============================================================================
    {
      name: 'filterTabs',
      type: 'group',
      label: 'Filter Tabs',
      fields: [
        {
          name: 'showAllTab',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "All" Tab',
        },
        {
          name: 'allTabLabel',
          type: 'text',
          defaultValue: 'All',
          label: '"All" Tab Label',
          admin: {
            condition: (data, siblingData) => siblingData?.showAllTab,
          },
        },
        {
          name: 'showVideosTab',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Videos" Tab',
        },
        {
          name: 'videosTabLabel',
          type: 'text',
          defaultValue: 'Videos',
          label: '"Videos" Tab Label',
          admin: {
            condition: (data, siblingData) => siblingData?.showVideosTab,
          },
        },
        {
          name: 'showPhotoGalleryTab',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Photo Gallery" Tab',
        },
        {
          name: 'photoGalleryTabLabel',
          type: 'text',
          defaultValue: 'Photo Gallery',
          label: '"Photo Gallery" Tab Label',
          admin: {
            condition: (data, siblingData) => siblingData?.showPhotoGalleryTab,
          },
        },
        {
          name: 'showAudioPodcastTab',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Audio/Podcast" Tab',
        },
        {
          name: 'audioPodcastTabLabel',
          type: 'text',
          defaultValue: 'Audio/Podcast',
          label: '"Audio/Podcast" Tab Label',
          admin: {
            condition: (data, siblingData) => siblingData?.showAudioPodcastTab,
          },
        },
      ],
    },

    // ============================================================================
    // View Options
    // ============================================================================
    {
      name: 'viewOptions',
      type: 'group',
      label: 'View Options',
      fields: [
        {
          name: 'showViewToggle',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show List/Grid Toggle',
        },
        {
          name: 'defaultView',
          type: 'select',
          options: [
            { label: 'Grid View', value: 'grid' },
            { label: 'List View', value: 'list' },
          ],
          defaultValue: 'grid',
          label: 'Default View',
        },
        {
          name: 'listViewLabel',
          type: 'text',
          defaultValue: 'List',
          label: 'List View Label',
        },
        {
          name: 'gridViewLabel',
          type: 'text',
          defaultValue: 'Grid',
          label: 'Grid View Label',
        },
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
            description: 'Number of media items to show before "Load More"',
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
          admin: {
            condition: (data, siblingData) => siblingData?.showLoadMore,
          },
        },
      ],
    },

    // ============================================================================
    // Media Card Appearance
    // ============================================================================
    {
      name: 'cardAppearance',
      type: 'group',
      label: 'Media Card Appearance',
      fields: [
        {
          name: 'showThumbnail',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Thumbnail',
        },
        {
          name: 'showMediaType',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Media Type Badge (Videos, Podcast, etc.)',
        },
        {
          name: 'showDescription',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Description on Cards',
        },
        {
          name: 'showDuration',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Duration (for videos/audio)',
        },
        {
          name: 'showLiveBadge',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Live" Badge',
        },
        {
          name: 'cardStyle',
          type: 'select',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'With Shadow', value: 'shadow' },
            { label: 'Bordered', value: 'bordered' },
          ],
          defaultValue: 'standard',
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
            { label: 'Title A-Z', value: 'title-asc' },
            { label: 'Title Z-A', value: 'title-desc' },
            { label: 'Most Viewed', value: 'views-desc' },
          ],
          defaultValue: 'date-desc',
          label: 'Default Sort Order',
        },
        {
          name: 'showFeaturedFirst',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Featured Media First',
        },
      ],
    },

    // ============================================================================
    // Media Detail Page Settings
    // ============================================================================
    {
      name: 'detailPage',
      type: 'group',
      label: 'Media Detail Page',
      fields: [
        {
          name: 'showDonationBox',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Donation Box (if enabled in media item)',
        },
        {
          name: 'donationBoxPosition',
          type: 'select',
          options: [
            { label: 'Right Side', value: 'right' },
            { label: 'Bottom', value: 'bottom' },
          ],
          defaultValue: 'right',
          label: 'Donation Box Position',
        },
        {
          name: 'showRelatedMedia',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Related Media Section',
        },
        {
          name: 'relatedMediaCount',
          type: 'number',
          defaultValue: 3,
          label: 'Number of Related Media Items',
          admin: {
            condition: (data, siblingData) => siblingData?.showRelatedMedia,
          },
        },
        {
          name: 'showSocialShare',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Social Share Buttons',
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
          admin: {
            condition: (data, siblingData) => siblingData?.showShareButton,
          },
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
          admin: {
            condition: (data, siblingData) => siblingData?.showDonateButton,
          },
        },
        {
          name: 'donateButtonUrl',
          type: 'text',
          defaultValue: '/appeals',
          label: 'Donate Button URL',
          admin: {
            condition: (data, siblingData) => siblingData?.showDonateButton,
          },
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
          name: 'noMediaMessage',
          type: 'textarea',
          defaultValue: 'No media items available at this time.',
          label: 'No Media Message',
        },
        {
          name: 'noSearchResults',
          type: 'textarea',
          defaultValue: 'No media found. Try adjusting your search or filters.',
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
            description: 'Leave blank to use default "Media - Masjid Al-Falah"',
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
