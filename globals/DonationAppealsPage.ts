import type { GlobalConfig } from 'payload';

export const DonationAppealsPage: GlobalConfig = {
  slug: 'donation-appeals-page',
  label: 'Donation Appeals Page',
  admin: {
    description:
      'Manage all content and settings for the Donation Appeals (Appeals) page',
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
          defaultValue: 'Appeals',
          label: 'Page Title',
        },
        {
          name: 'pageDescription',
          type: 'richText',
          label: 'Page Description',
          admin: {
            description: 'Text shown below the page title',
          },
        },
        {
          name: 'breadcrumb',
          type: 'text',
          defaultValue: 'Home > Appeals',
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
            description: 'Number of appeals to show before "Load More"',
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
    // Appeal Card Appearance
    // ============================================================================
    {
      name: 'cardAppearance',
      type: 'group',
      label: 'Appeal Card Appearance',
      fields: [
        {
          name: 'showImage',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Appeal Image',
        },
        {
          name: 'showOrganizationName',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Organization Name',
        },
        {
          name: 'showDonorCount',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Donor Count',
        },
        {
          name: 'showDaysLeft',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Days Left',
        },
        {
          name: 'showProgressBar',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Progress Bar',
        },
        {
          name: 'showFundedAmount',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Funded Amount (£X funded of £Y)',
        },
        {
          name: 'showDescription',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Short Description',
        },
        {
          name: 'showDonateButton',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Donate Now" Button',
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
          ],
          defaultValue: 'lift',
          label: 'Card Hover Effect',
        },
      ],
    },

    // ============================================================================
    // Default Sorting & Filtering
    // ============================================================================
    {
      name: 'defaultSorting',
      type: 'group',
      label: 'Default Sorting & Filtering',
      fields: [
        {
          name: 'sortBy',
          type: 'select',
          options: [
            { label: 'Newest First', value: 'date-desc' },
            { label: 'Oldest First', value: 'date-asc' },
            { label: 'Most Funded', value: 'funded-desc' },
            { label: 'Least Funded', value: 'funded-asc' },
            { label: 'Ending Soon', value: 'deadline-asc' },
          ],
          defaultValue: 'date-desc',
          label: 'Default Sort Order',
        },
        {
          name: 'showFeaturedFirst',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Featured Appeals First',
        },
        {
          name: 'showActiveOnly',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Only Active Appeals by Default',
          admin: {
            description: 'Hide expired/completed appeals',
          },
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
          name: 'showStatusFilter',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Status Filter (Active/Completed)',
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
          defaultValue: 'Search appeals...',
          label: 'Search Placeholder Text',
          admin: {
            condition: (data, siblingData) => siblingData?.showSearch,
          },
        },
      ],
    },

    // ============================================================================
    // Detail Page Settings
    // ============================================================================
    {
      name: 'detailPage',
      type: 'group',
      label: 'Appeal Detail Page',
      fields: [
        {
          name: 'showHeroStats',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Hero Statistics',
          admin: {
            description:
              'Display key stats (funded amount, donors, days left) at top',
          },
        },
        {
          name: 'showProgressSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Progress Tracking Section',
        },
        {
          name: 'showImpactGallery',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Impact Gallery',
        },
        {
          name: 'showWaysToGive',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Ways to Give" Section',
        },
        {
          name: 'showTestimonials',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Testimonials',
        },
        {
          name: 'showDonationForm',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Donation Form',
        },
        {
          name: 'showRelatedAppeals',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Related Appeals Section',
        },
        {
          name: 'relatedAppealsTitle',
          type: 'text',
          defaultValue: 'Other Appeals',
          label: 'Related Appeals Title',
          admin: {
            condition: (data, siblingData) => siblingData?.showRelatedAppeals,
          },
        },
        {
          name: 'relatedAppealsCount',
          type: 'number',
          defaultValue: 3,
          label: 'Number of Related Appeals',
          admin: {
            condition: (data, siblingData) => siblingData?.showRelatedAppeals,
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
    // Donation Form Settings
    // ============================================================================
    {
      name: 'donationForm',
      type: 'group',
      label: 'Donation Form Settings',
      fields: [
        {
          name: 'suggestedAmounts',
          type: 'array',
          label: 'Suggested Donation Amounts',
          fields: [
            {
              name: 'amount',
              type: 'number',
              required: true,
              label: 'Amount (£)',
            },
          ],
        },
        {
          name: 'allowCustomAmount',
          type: 'checkbox',
          defaultValue: true,
          label: 'Allow Custom Amount',
        },
        {
          name: 'minimumDonation',
          type: 'number',
          defaultValue: 5,
          label: 'Minimum Donation (£)',
        },
        {
          name: 'showRecurringOption',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Recurring Donation Option',
        },
        {
          name: 'showGiftAid',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Gift Aid Option (UK)',
        },
        {
          name: 'showAnonymousOption',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Anonymous Donation Option',
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
          name: 'noAppealsMessage',
          type: 'textarea',
          defaultValue:
            'No donation appeals available at this time. Check back soon!',
          label: 'No Appeals Message',
        },
        {
          name: 'noSearchResults',
          type: 'textarea',
          defaultValue:
            'No appeals found. Try adjusting your search or filters.',
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
              'Leave blank to use default "Appeals - Masjid Al-Falah"',
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
