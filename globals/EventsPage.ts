import type { GlobalConfig } from 'payload';

export const EventsPage: GlobalConfig = {
  slug: 'events-page',
  label: 'Events Page',
  admin: {
    description: 'Manage all content for the Events/Lectures page',
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
          defaultValue: 'Events/Lectures',
          label: 'Page Title',
        },
        {
          name: 'breadcrumb',
          type: 'text',
          defaultValue: 'Home > Events/Lectures',
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
    // Filtering & Display Options
    // ============================================================================
    {
      name: 'filterOptions',
      type: 'group',
      label: 'Filter & Display Options',
      fields: [
        {
          name: 'enableUpcomingTab',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Upcoming" Tab',
        },
        {
          name: 'upcomingTabLabel',
          type: 'text',
          defaultValue: 'Upcoming',
          label: 'Upcoming Tab Label',
          admin: {
            condition: (data, siblingData) => siblingData?.enableUpcomingTab,
          },
        },
        {
          name: 'enableArchivedTab',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Archived" Tab',
        },
        {
          name: 'archivedTabLabel',
          type: 'text',
          defaultValue: 'Archived',
          label: 'Archived Tab Label',
          admin: {
            condition: (data, siblingData) => siblingData?.enableArchivedTab,
          },
        },
        {
          name: 'enableSpeakerFilter',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "All Speakers" Filter',
        },
        {
          name: 'speakerFilterLabel',
          type: 'text',
          defaultValue: 'All Speakers',
          label: 'Speaker Filter Label',
          admin: {
            condition: (data, siblingData) => siblingData?.enableSpeakerFilter,
          },
        },
        {
          name: 'enableCategoryFilter',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Category" Filter',
        },
        {
          name: 'categoryFilterLabel',
          type: 'text',
          defaultValue: 'Category',
          label: 'Category Filter Label',
          admin: {
            condition: (data, siblingData) => siblingData?.enableCategoryFilter,
          },
        },
        {
          name: 'enableCalendarView',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Calendar" View Option',
        },
        {
          name: 'calendarViewLabel',
          type: 'text',
          defaultValue: 'Calendar',
          label: 'Calendar View Label',
          admin: {
            condition: (data, siblingData) => siblingData?.enableCalendarView,
          },
        },
      ],
    },

    // ============================================================================
    // View Toggle (List/Grid)
    // ============================================================================
    {
      name: 'viewOptions',
      type: 'group',
      label: 'View Toggle Options',
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
          name: 'eventsPerPage',
          type: 'number',
          defaultValue: 6,
          label: 'Events Per Page',
          admin: {
            description: 'Number of events to show before "Load More"',
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
    // Event Card Appearance
    // ============================================================================
    {
      name: 'cardAppearance',
      type: 'group',
      label: 'Event Card Appearance',
      fields: [
        {
          name: 'showEventImage',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Event Poster/Image',
        },
        {
          name: 'showEventDate',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Event Date & Time',
        },
        {
          name: 'showPlatformIcons',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Platform Icons (Zoom, In-person, etc.)',
        },
        {
          name: 'showLiveNowBadge',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show "Live Now" Badge',
          admin: {
            description: 'Display badge when event is currently live',
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
          defaultValue: 'standard',
          label: 'Card Style',
        },
        {
          name: 'hoverEffect',
          type: 'select',
          options: [
            { label: 'Scale Up', value: 'scale' },
            { label: 'Lift (Shadow)', value: 'lift' },
            { label: 'None', value: 'none' },
          ],
          defaultValue: 'scale',
          label: 'Hover Effect',
        },
      ],
    },

    // ============================================================================
    // Default Filters & Sorting
    // ============================================================================
    {
      name: 'defaultSettings',
      type: 'group',
      label: 'Default Filters & Sorting',
      fields: [
        {
          name: 'defaultTab',
          type: 'select',
          options: [
            { label: 'Upcoming Events', value: 'upcoming' },
            { label: 'Archived Events', value: 'archived' },
            { label: 'All Events', value: 'all' },
          ],
          defaultValue: 'upcoming',
          label: 'Default Tab on Page Load',
        },
        {
          name: 'sortBy',
          type: 'select',
          options: [
            { label: 'Event Date (Soonest First)', value: 'date-asc' },
            { label: 'Event Date (Latest First)', value: 'date-desc' },
            { label: 'Recently Added', value: 'created' },
            { label: 'Title A-Z', value: 'title-asc' },
          ],
          defaultValue: 'date-asc',
          label: 'Default Sort Order',
        },
        {
          name: 'showFeaturedFirst',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Featured Events First',
        },
      ],
    },

    // ============================================================================
    // Request an Event/Lecture Form
    // ============================================================================
    {
      name: 'requestForm',
      type: 'group',
      label: 'Request an Event/Lecture Form',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Request Form',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Request an Event/Lecture',
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'Connect our Masjid for personalized assistance and discover how we can help you.',
          label: 'Form Description',
        },
        {
          name: 'formFields',
          type: 'group',
          label: 'Form Field Labels',
          fields: [
            {
              name: 'fullNameLabel',
              type: 'text',
              defaultValue: 'Full Name *',
              label: 'Full Name Field Label',
            },
            {
              name: 'fullNamePlaceholder',
              type: 'text',
              defaultValue: 'Yousif Hasan',
              label: 'Full Name Placeholder',
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
              name: 'phoneLabel',
              type: 'text',
              defaultValue: 'Phone Number',
              label: 'Phone Field Label',
            },
            {
              name: 'phonePlaceholder',
              type: 'text',
              defaultValue: '+440 123 456 789',
              label: 'Phone Placeholder',
            },
            {
              name: 'commentLabel',
              type: 'text',
              defaultValue: 'Comment',
              label: 'Comment Field Label',
            },
            {
              name: 'commentPlaceholder',
              type: 'text',
              defaultValue: 'Content',
              label: 'Comment Placeholder',
            },
            {
              name: 'submitButtonText',
              type: 'text',
              defaultValue: 'Submit',
              label: 'Submit Button Text',
            },
          ],
        },
        {
          name: 'recipientEmail',
          type: 'email',
          label: 'Form Submissions Email',
          admin: {
            description: 'Email address where event requests will be sent',
          },
        },
        {
          name: 'successMessage',
          type: 'textarea',
          defaultValue: 'Thank you for your request! We will contact you soon.',
          label: 'Success Message',
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
          name: 'noUpcomingEvents',
          type: 'textarea',
          defaultValue: 'No upcoming events at this time. Check back soon!',
          label: 'No Upcoming Events Message',
        },
        {
          name: 'noArchivedEvents',
          type: 'textarea',
          defaultValue: 'No archived events available.',
          label: 'No Archived Events Message',
        },
        {
          name: 'noSearchResults',
          type: 'textarea',
          defaultValue: 'No events found. Try adjusting your filters.',
          label: 'No Search Results Message',
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
    // Calendar View Settings (Optional)
    // ============================================================================
    {
      name: 'calendarSettings',
      type: 'group',
      label: 'Calendar View Settings',
      fields: [
        {
          name: 'defaultCalendarView',
          type: 'select',
          options: [
            { label: 'Month View', value: 'month' },
            { label: 'Week View', value: 'week' },
            { label: 'Day View', value: 'day' },
          ],
          defaultValue: 'month',
          label: 'Default Calendar View',
        },
        {
          name: 'showEventCount',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Event Count on Calendar Days',
        },
        {
          name: 'calendarColorScheme',
          type: 'select',
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
            { label: 'Purple', value: 'purple' },
          ],
          defaultValue: 'blue',
          label: 'Calendar Color Scheme',
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
              'Leave blank to use default "Events & Lectures - Masjid Al-Falah"',
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
