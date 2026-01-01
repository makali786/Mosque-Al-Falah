import type { GlobalConfig } from 'payload';

export const SermonsPage: GlobalConfig = {
  slug: 'sermons-page',
  label: 'Sermons Page',
  admin: {
    description: 'Manage all content and settings for the Sermons page',
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
          defaultValue: 'Sermons',
          label: 'Page Title',
        },
        {
          name: 'breadcrumb',
          type: 'text',
          defaultValue: 'Home > Sermons',
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
            description: 'Number of sermons to show before "Load More"',
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
    // Sermon Card Appearance
    // ============================================================================
    {
      name: 'cardAppearance',
      type: 'group',
      label: 'Sermon Card Appearance',
      fields: [
        {
          name: 'showThumbnail',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Thumbnail Image',
        },
        {
          name: 'showDate',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Sermon Date',
        },
        {
          name: 'showSpeaker',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Speaker Info',
        },
        {
          name: 'showSpeakerAvatar',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Speaker Avatar',
          admin: {
            condition: (data, siblingData) => siblingData?.showSpeaker,
          },
        },
        {
          name: 'showAudioButton',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Audio Button',
        },
        {
          name: 'showVideoButton',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Video Button',
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
        {
          name: 'hoverEffect',
          type: 'select',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Lift', value: 'lift' },
            { label: 'Scale', value: 'scale' },
            { label: 'Glow', value: 'glow' },
          ],
          defaultValue: 'lift',
          label: 'Card Hover Effect',
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
          ],
          defaultValue: 'date-desc',
          label: 'Default Sort Order',
        },
        {
          name: 'showFeaturedFirst',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Featured Sermons First',
        },
      ],
    },

    // ============================================================================
    // Filter Options
    // ============================================================================
    {
      name: 'filterOptions',
      type: 'group',
      label: 'Filter Options',
      fields: [
        {
          name: 'showCategoryFilter',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Category Filter',
        },
        {
          name: 'showLanguageFilter',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Language Filter',
        },
        {
          name: 'showSpeakerFilter',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Speaker Filter',
        },
      ],
    },

    // ============================================================================
    // Detail Page Settings
    // ============================================================================
    {
      name: 'detailPage',
      type: 'group',
      label: 'Sermon Detail Page',
      fields: [
        {
          name: 'showVideoPlayer',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Video Player (if video URL exists)',
        },
        {
          name: 'showAudioPlayer',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Audio Player (if audio URL exists)',
        },
        {
          name: 'showDescription',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Description',
        },
        {
          name: 'showFullContent',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Full Content/Notes',
        },
        {
          name: 'showRelatedSermons',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Related Sermons Section',
        },
        {
          name: 'relatedSermonsTitle',
          type: 'text',
          defaultValue: 'Related Sermons',
          label: 'Related Sermons Title',
          admin: {
            condition: (data, siblingData) => siblingData?.showRelatedSermons,
          },
        },
        {
          name: 'relatedSermonsCount',
          type: 'number',
          defaultValue: 3,
          label: 'Number of Related Sermons',
          admin: {
            condition: (data, siblingData) => siblingData?.showRelatedSermons,
          },
        },
        {
          name: 'relatedSermonsLogic',
          type: 'select',
          options: [
            { label: 'Same Category', value: 'category' },
            { label: 'Same Speaker', value: 'speaker' },
            { label: 'Same Language', value: 'language' },
            { label: 'Latest Sermons', value: 'latest' },
          ],
          defaultValue: 'category',
          label: 'Related Sermons Logic',
          admin: {
            condition: (data, siblingData) => siblingData?.showRelatedSermons,
          },
        },
        {
          name: 'showSocialShare',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Social Share Buttons',
        },
        {
          name: 'showDownloadButtons',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Download Buttons (Audio/Video)',
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
          name: 'noSermonsMessage',
          type: 'textarea',
          defaultValue: 'No sermons available at this time.',
          label: 'No Sermons Message',
        },
        {
          name: 'noSearchResults',
          type: 'textarea',
          defaultValue:
            'No sermons found. Try adjusting your search or filters.',
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
            description:
              'Leave blank to use default "Sermons - Masjid Al-Falah"',
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
