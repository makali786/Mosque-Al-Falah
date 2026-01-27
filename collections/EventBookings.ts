import type { CollectionConfig } from 'payload';

export const EventBookings: CollectionConfig = {
  slug: 'event-bookings',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: [
      'fullName',
      'email',
      'event',
      'numberOfGuests',
      'createdAt',
      'status',
    ],
    description: 'Track event bookings and registrations',
    group: 'Events',
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    // ============================================================================
    // Event Reference
    // ============================================================================
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
      label: 'Event',
      admin: {
        description: 'The event this booking is for',
      },
    },

    // ============================================================================
    // Attendee Information
    // ============================================================================
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Full Name',
      admin: {
        description: "Attendee's full name",
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email Address',
      admin: {
        description: 'Contact email for confirmation and updates',
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      label: 'Phone Number',
      admin: {
        description: 'Contact phone number',
      },
    },
    {
      name: 'numberOfGuests',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
      label: 'Number of Guests',
      admin: {
        description: 'Total number of attendees including the registrant',
      },
    },

    // ============================================================================
    // Additional Information
    // ============================================================================
    {
      name: 'specialRequirements',
      type: 'textarea',
      label: 'Special Requirements',
      admin: {
        description: 'Dietary requirements, accessibility needs, etc.',
        rows: 3,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Additional Notes',
      admin: {
        description: 'Any additional information from the attendee',
        rows: 3,
      },
    },

    // ============================================================================
    // Booking Status
    // ============================================================================
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Attended', value: 'attended' },
        { label: 'No Show', value: 'no-show' },
      ],
      label: 'Booking Status',
      admin: {
        description: 'Current status of this booking',
      },
    },
    {
      name: 'confirmationSent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Confirmation Email Sent',
      admin: {
        description: 'Whether confirmation email has been sent',
      },
    },
    {
      name: 'confirmationCode',
      type: 'text',
      label: 'Confirmation Code',
      admin: {
        description: 'Unique code for this booking',
        readOnly: true,
      },
    },

    // ============================================================================
    // Payment Information (for paid events)
    // ============================================================================
    {
      name: 'payment',
      type: 'group',
      label: 'Payment Information',
      fields: [
        {
          name: 'isPaid',
          type: 'checkbox',
          defaultValue: false,
          label: 'Payment Received',
        },
        {
          name: 'amount',
          type: 'number',
          label: 'Amount Paid (£)',
          admin: {
            condition: (data, siblingData) => siblingData?.isPaid,
          },
        },
        {
          name: 'paymentMethod',
          type: 'select',
          options: [
            { label: 'Online Payment', value: 'online' },
            { label: 'Cash', value: 'cash' },
            { label: 'Bank Transfer', value: 'bank-transfer' },
            { label: 'Other', value: 'other' },
          ],
          label: 'Payment Method',
          admin: {
            condition: (data, siblingData) => siblingData?.isPaid,
          },
        },
        {
          name: 'transactionId',
          type: 'text',
          label: 'Transaction ID',
          admin: {
            description: 'Payment gateway transaction reference',
            condition: (data, siblingData) => siblingData?.isPaid,
          },
        },
        {
          name: 'paymentDate',
          type: 'date',
          label: 'Payment Date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            condition: (data, siblingData) => siblingData?.isPaid,
          },
        },
      ],
    },

    // ============================================================================
    // Communication Log
    // ============================================================================
    {
      name: 'communications',
      type: 'array',
      label: 'Communication History',
      admin: {
        description: 'Log of emails and messages sent to this attendee',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Confirmation Email', value: 'confirmation' },
            { label: 'Reminder Email', value: 'reminder' },
            { label: 'Update Email', value: 'update' },
            { label: 'Cancellation Email', value: 'cancellation' },
            { label: 'Other', value: 'other' },
          ],
          required: true,
          label: 'Communication Type',
        },
        {
          name: 'sentAt',
          type: 'date',
          required: true,
          label: 'Sent At',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'subject',
          type: 'text',
          label: 'Subject',
        },
        {
          name: 'notes',
          type: 'textarea',
          label: 'Notes',
          admin: {
            rows: 2,
          },
        },
      ],
    },

    // ============================================================================
    // Admin Notes
    // ============================================================================
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        description: 'Internal notes (not visible to attendee)',
        rows: 3,
      },
    },

    // ============================================================================
    // Source Information
    // ============================================================================
    {
      name: 'source',
      type: 'group',
      label: 'Booking Source',
      fields: [
        {
          name: 'referrer',
          type: 'text',
          label: 'Referrer URL',
          admin: {
            description: 'Where the user came from',
          },
        },
        {
          name: 'device',
          type: 'select',
          options: [
            { label: 'Desktop', value: 'desktop' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Tablet', value: 'tablet' },
          ],
          label: 'Device Type',
        },
        {
          name: 'ipAddress',
          type: 'text',
          label: 'IP Address',
          admin: {
            description: 'For fraud prevention',
          },
        },
      ],
    },

    // ============================================================================
    // Timestamps (auto-managed by Payload)
    // ============================================================================
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Generate confirmation code for new bookings
        if (operation === 'create' && !data.confirmationCode) {
          data.confirmationCode = `EVT-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        }
        return data;
      },
    ],
  },
};
