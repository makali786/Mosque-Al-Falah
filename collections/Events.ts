import { createRevalidateHook } from '../lib/revalidation';
import { createNewsletterHook } from '@lib/email/newsletter-notifier';
import type { CollectionConfig } from 'payload';

export const Events: CollectionConfig = {
  slug: 'events',
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'startDate',
      'endDate',
      'isPublished',
      'isFeatured',
    ],
    description:
      'Comprehensive event management with booking, donations, and media',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Autofill venue details from selected location
        if (data.venue?.locationPreset) {
          try {
            const locationId =
              typeof data.venue.locationPreset === 'object'
                ? data.venue.locationPreset.id
                : data.venue.locationPreset;

            const location = await req.payload.findByID({
              // @ts-expect-error - Collection slug will be valid after types regeneration
              collection: 'locations',
              id: locationId,
            });

            if (location) {
              data.venue = {
                ...data.venue,
                name: location.name,
                fullAddress: location.fullAddress,
                googleMapsLink: location.googleMapsLink,
                coordinates: {
                  latitude: location.coordinates?.latitude,
                  longitude: location.coordinates?.longitude,
                },
              };
            }
          } catch (error) {
            console.error('Error autofilling location details:', error);
          }
        }
        return data;
      },
    ],
    afterChange: [createRevalidateHook('events'), createNewsletterHook('event', 'isPublished')],
  },
  fields: [
    // ============================================================================
    // Basic Information
    // ============================================================================
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Event Title',
      admin: {
        description: 'Main event title (e.g., "Quran: A Path to Paradise")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description:
          'URL-friendly version of title (e.g., "quran-path-to-paradise")',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Event Subtitle',
      admin: {
        description: 'Short tagline (e.g., "an uplifting event for all!")',
      },
    },

    // ============================================================================
    // Date & Time
    // ============================================================================
    {
      name: 'timing',
      type: 'group',
      label: 'Event Timing',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          label: 'Start Date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          required: false,
          label: 'End Date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            description: 'Optional. If left blank, recurring events will be treated as "Indefinite".',
          },
        },
        {
          name: 'timezone',
          type: 'select',
          defaultValue: 'Europe/London',
          options: [
            { label: 'London (GMT/BST)', value: 'Europe/London' },
            { label: 'New York (EST/EDT)', value: 'America/New_York' },
            { label: 'Dubai (GST)', value: 'Asia/Dubai' },
          ],
        },
      ],
    },

    // ============================================================================
    // Event Recurrence
    // ============================================================================
    {
      name: 'recurrence',
      type: 'group',
      label: 'Event Recurrence',
      fields: [
        {
          name: 'isRecurring',
          type: 'checkbox',
          defaultValue: false,
          label: 'Recurring Event',
          admin: {
            description: 'Enable if this event repeats on a schedule',
          },
        },
        {
          name: 'frequency',
          type: 'select',
          options: [
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
          ],
          label: 'Repeat Frequency',
          admin: {
            condition: (data, siblingData) => siblingData?.isRecurring,
            description: 'How often the event repeats',
          },
        },
        {
          name: 'weeklyPattern',
          type: 'select',
          options: [
            { label: 'Sunday', value: '0' },
            { label: 'Monday', value: '1' },
            { label: 'Tuesday', value: '2' },
            { label: 'Wednesday', value: '3' },
            { label: 'Thursday', value: '4' },
            { label: 'Friday', value: '5' },
            { label: 'Saturday', value: '6' },
          ],
          hasMany: true,
          label: 'Days of Week',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.isRecurring && siblingData?.frequency === 'weekly',
            description: 'Select which days of the week the event repeats',
          },
        },
        {
          name: 'monthlyDay',
          type: 'number',
          min: 1,
          max: 31,
          label: 'Day of Month',
          admin: {
            description: 'Which day of the month (1-31)',
            condition: (data, siblingData) =>
              siblingData?.isRecurring && siblingData?.frequency === 'monthly',
          },
        },
        {
          name: 'recurrenceEnd',
          type: 'group',
          label: 'Recurrence End',
          admin: {
            condition: (data, siblingData) => siblingData?.isRecurring,
            description: 'When should the recurring event stop',
          },
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                {
                  label: 'No end date (continues indefinitely)',
                  value: 'never',
                },
                { label: 'End on a specific date', value: 'date' },
                { label: 'End after a number of occurrences', value: 'count' },
              ],
              defaultValue: 'never',
              label: 'End Type',
            },
            {
              name: 'endDate',
              type: 'date',
              label: 'End Date',
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                },
                condition: (data, siblingData) => siblingData?.type === 'date',
                description: 'Last date the event will occur',
              },
            },
            {
              name: 'occurrences',
              type: 'number',
              min: 1,
              label: 'Number of Occurrences',
              admin: {
                condition: (data, siblingData) => siblingData?.type === 'count',
                description: 'How many times the event will repeat',
              },
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Platform & Format
    // ============================================================================
    {
      name: 'platforms',
      type: 'array',
      label: 'Event Platforms',
      admin: {
        description: 'Where attendees can join (in-person, online, etc.)',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'In-person', value: 'in-person' },
            { label: 'Zoom', value: 'zoom' },
            { label: 'eMasjid Live', value: 'emasjid-live' },
            { label: 'YouTube Live', value: 'youtube-live' },
            { label: 'Facebook Live', value: 'facebook-live' },
          ],
        },
        {
          name: 'link',
          type: 'text',
          label: 'Platform Link',
          admin: {
            description: 'Zoom link, YouTube URL, etc.',
          },
        },
      ],
    },

    // ============================================================================
    // Location Details
    // ============================================================================
    {
      name: 'venue',
      type: 'group',
      label: 'Venue Information',
      fields: [
        {
          name: 'locationPreset',
          type: 'relationship',
          // @ts-expect-error - Collection slug will be valid after types regeneration
          relationTo: 'locations',
          label: 'Select Preset Location',
          admin: {
            description:
              'Select a saved location to autofill the details below',
          },
        },
        {
          name: 'name',
          type: 'text',
          label: 'Venue Name',
          defaultValue: 'Masjid Al Falah',
          admin: {
            description: 'e.g., "Masjid Al Falah, Main Hall"',
          },
        },
        {
          name: 'fullAddress',
          type: 'textarea',
          label: 'Full Address',
          defaultValue: 'Masjid Al Falah, Ilford IG1 3EN',
          admin: {
            description: 'Complete address with postcode',
          },
        },
        {
          name: 'coordinates',
          type: 'group',
          label: 'Map Coordinates (Optional)',
          fields: [
            {
              name: 'latitude',
              type: 'number',
              defaultValue: 51.563795040478006,
            },
            {
              name: 'longitude',
              type: 'number',
              defaultValue: 0.05737356006436694,
            },
          ],
        },
        {
          name: 'googleMapsLink',
          type: 'text',
          label: 'Google Maps Link',
          defaultValue:
            'https://www.google.com/maps/place/Masjid+al-Falah/@51.563806,0.0574431,88m/data=!3m1!1e3!4m14!1m7!3m6!1s0x47d8a6fa41d25b75:0xd86791fb8e907094!2sMasjid+al-Falah!8m2!3d51.5638059!4d0.0573901!16s%2Fg%2F1w04jc6h!3m5!1s0x47d8a6fa41d25b75:0xd86791fb8e907094!8m2!3d51.5638059!4d0.0573901!16s%2Fg%2F1w04jc6h?entry=ttu&g_ep=EgoyMDI2MDMwNS4wIKXMDSoASAFQAw%3D%3D',
        },
      ],
    },

    // ============================================================================
    // Speaker/Imam Information
    // ============================================================================
    {
      name: 'speakers',
      type: 'array',
      label: 'Speakers',
      fields: [
        {
          name: 'speakerType',
          type: 'select',
          options: [
            { label: 'From Imams Collection', value: 'imam' },
            { label: 'Guest Speaker', value: 'guest' },
          ],
          defaultValue: 'guest',
        },
        {
          name: 'imam',
          type: 'relationship',
          relationTo: 'imams',
          label: 'Select Imam',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.speakerType === 'imam',
          },
        },
        {
          name: 'guestSpeaker',
          type: 'group',
          label: 'Guest Speaker Details',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.speakerType === 'guest',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Speaker Name',
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title/Role',
              admin: {
                description: 'e.g., "Imam", "Sheikh", "Guest Reciter"',
              },
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              label: 'Speaker Photo',
            },
            {
              name: 'bio',
              type: 'richText',
              label: 'Biography',
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Event Content
    // ============================================================================
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Event Description',
      admin: {
        description: 'Full event description/details',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Short Description',
      admin: {
        description:
          'Brief summary for cards and previews (max 200 characters)',
      },
    },

    // ============================================================================
    // Media Assets
    // ============================================================================
    {
      name: 'media',
      type: 'group',
      label: 'Event Media',
      fields: [
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Featured Event Poster',
          admin: {
            description: 'Main event poster/banner image',
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: 'Live Stream / Video URL',
          admin: {
            description: 'YouTube, Vimeo, or custom stream URL',
          },
        },
        {
          name: 'isLive',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show "Live" Indicator',
        },
        {
          name: 'photos',
          type: 'array',
          label: 'Event Photos',
          fields: [
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          name: 'audioRecordings',
          type: 'array',
          label: 'Audio Recordings',
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'audioFile',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Registration & Booking
    // ============================================================================
    {
      name: 'registration',
      type: 'group',
      label: 'Event Registration',
      fields: [
        {
          name: 'enableRegistration',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Registration',
        },
        {
          name: 'registrationType',
          type: 'select',
          options: [
            { label: 'Free Event', value: 'free' },
            { label: 'Paid Event', value: 'paid' },
            { label: 'Donation-based', value: 'donation' },
          ],
          defaultValue: 'free',
        },
        {
          name: 'ticketPrice',
          type: 'number',
          label: 'Ticket Price (£)',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.registrationType === 'paid',
          },
        },
        {
          name: 'maxAttendees',
          type: 'number',
          label: 'Maximum Attendees',
          admin: {
            description: 'Leave blank for unlimited',
          },
        },
        {
          name: 'currentRegistrations',
          type: 'number',
          defaultValue: 0,
          label: 'Current Registrations',
          admin: {
            description: 'Auto-increments with each booking',
          },
        },
        {
          name: 'registrationDeadline',
          type: 'date',
          label: 'Registration Deadline',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'externalBookingUrl',
          type: 'text',
          label: 'External Booking URL',
          admin: {
            description: 'If using external booking system (Eventbrite, etc.)',
          },
        },
        {
          name: 'bookingFormSettings',
          type: 'group',
          label: 'Booking Form Settings',
          admin: {
            description: 'Configure the "Book a place" form',
            condition: (data, siblingData) => siblingData?.enableRegistration,
          },
          fields: [
            {
              name: 'formTitle',
              type: 'text',
              defaultValue: 'Book a place',
              label: 'Form Title',
            },
            {
              name: 'formDescription',
              type: 'textarea',
              label: 'Form Description',
              admin: {
                description: 'Text shown above the booking form',
                rows: 2,
              },
            },
            {
              name: 'requirePhoneNumber',
              type: 'checkbox',
              defaultValue: true,
              label: 'Require Phone Number',
            },
            {
              name: 'allowMultipleGuests',
              type: 'checkbox',
              defaultValue: true,
              label: 'Allow Multiple Guests',
              admin: {
                description: 'Let attendees book for multiple people',
              },
            },
            {
              name: 'maxGuestsPerBooking',
              type: 'number',
              defaultValue: 10,
              label: 'Max Guests Per Booking',
              admin: {
                description: 'Maximum number of guests one person can book for',
                condition: (data, siblingData) =>
                  siblingData?.allowMultipleGuests,
              },
            },
            {
              name: 'showSpecialRequirements',
              type: 'checkbox',
              defaultValue: false,
              label: 'Show Special Requirements Field',
              admin: {
                description:
                  'Allow attendees to specify dietary/accessibility needs',
              },
            },
            {
              name: 'customFields',
              type: 'array',
              label: 'Custom Form Fields',
              admin: {
                description: 'Add additional fields to the booking form',
              },
              fields: [
                {
                  name: 'fieldLabel',
                  type: 'text',
                  required: true,
                  label: 'Field Label',
                },
                {
                  name: 'fieldType',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Text Input', value: 'text' },
                    { label: 'Text Area', value: 'textarea' },
                    { label: 'Number', value: 'number' },
                    { label: 'Dropdown', value: 'select' },
                    { label: 'Checkbox', value: 'checkbox' },
                  ],
                  defaultValue: 'text',
                  label: 'Field Type',
                },
                {
                  name: 'required',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Required Field',
                },
                {
                  name: 'options',
                  type: 'array',
                  label: 'Dropdown Options',
                  admin: {
                    condition: (data, siblingData) =>
                      siblingData?.fieldType === 'select',
                  },
                  fields: [
                    {
                      name: 'option',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
              ],
            },
            {
              name: 'termsAndConditions',
              type: 'richText',
              label: 'Terms and Conditions',
              admin: {
                description: 'Terms that attendees must agree to',
              },
            },
            {
              name: 'requireTermsAcceptance',
              type: 'checkbox',
              defaultValue: false,
              label: 'Require Terms Acceptance',
            },
            {
              name: 'buttonText',
              type: 'text',
              defaultValue: 'Book Now',
              label: 'Submit Button Text',
            },
            {
              name: 'confirmationMessage',
              type: 'richText',
              label: 'Confirmation Message',
              admin: {
                description: 'Message shown after successful booking',
              },
            },
            {
              name: 'sendConfirmationEmail',
              type: 'checkbox',
              defaultValue: true,
              label: 'Send Confirmation Email',
            },
            {
              name: 'confirmationEmailTemplate',
              type: 'richText',
              label: 'Confirmation Email Template',
              admin: {
                description:
                  'Email sent to attendees. Use {{name}}, {{event}}, {{date}}, {{confirmationCode}} as placeholders',
                condition: (data, siblingData) =>
                  siblingData?.sendConfirmationEmail,
              },
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Donation Settings
    // ============================================================================
    {
      name: 'donation',
      type: 'group',
      label: 'Donation Settings',
      fields: [
        {
          name: 'enableDonations',
          type: 'checkbox',
          defaultValue: false,
          label: 'Enable Donations',
        },
        {
          name: 'donationTitle',
          type: 'text',
          label: 'Donation Section Title',
          defaultValue: 'Donate to Masjid Al Falah',
        },
        {
          name: 'donationDescription',
          type: 'textarea',
          label: 'Donation Description',
          admin: {
            description: 'Short text explaining the donation (max 40 words)',
          },
        },
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
      ],
    },

    // ============================================================================
    // Additional Settings
    // ============================================================================
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Lecture', value: 'lecture' },
        { label: 'Jummah', value: 'jummah' },
        { label: 'Ramadan', value: 'ramadan' },
        { label: 'Youth Program', value: 'youth' },
        { label: 'Community Event', value: 'community' },
        { label: 'Educational', value: 'educational' },
        { label: 'Fundraising', value: 'fundraising' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'lecture',
      label: 'Event Category',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Event Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'relatedEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      label: 'Related Events',
    },

    // ============================================================================
    // SEO & Sharing
    // ============================================================================
    {
      name: 'seo',
      type: 'group',
      label: 'SEO & Social Sharing',
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
          name: 'shareImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Social Share Image',
        },
      ],
    },

    // ============================================================================
    // Publishing Controls
    // ============================================================================
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Event',
      admin: {
        description: 'Show prominently on homepage and event pages',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: true,
      label: 'Published',
    },
    {
      name: 'publishDate',
      type: 'date',
      label: 'Publish Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Schedule event to be published at a specific time',
      },
    },
  ],
};
