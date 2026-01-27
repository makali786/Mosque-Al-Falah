import type { CollectionConfig } from 'payload';
import { sendEventRequestNotification } from '../lib/email/email-service';

export const EventRequests: CollectionConfig = {
  slug: 'event-requests',
  labels: {
    singular: 'Event/Lecture Request',
    plural: 'Event/Lecture Requests',
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'phoneNumber', 'status', 'createdAt'],
    group: 'Requests',
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    // ============================================================================
    // Contact Information
    // ============================================================================
    {
      type: 'row',
      fields: [
        {
          name: 'fullName',
          type: 'text',
          required: true,
          label: 'Full Name',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          label: 'Email',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      label: 'Phone Number',
      admin: {
        placeholder: '+440 123 456 789',
      },
    },

    // ============================================================================
    // Request Details
    // ============================================================================
    {
      name: 'comments',
      type: 'textarea',
      required: true,
      label: 'Comments/Details',
      admin: {
        description:
          'Please provide details about the event or lecture you are requesting',
        rows: 6,
      },
    },

    // ============================================================================
    // Status & Tracking
    // ============================================================================
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Under Review', value: 'reviewing' },
        { label: 'Approved', value: 'approved' },
        { label: 'Declined', value: 'declined' },
        { label: 'Completed', value: 'completed' },
      ],
      label: 'Status',
      admin: {
        description: 'Current status of the request',
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        description: 'Internal notes (not visible to requester)',
        rows: 4,
      },
    },
    {
      name: 'notificationSent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Admin Notification Sent',
      admin: {
        readOnly: true,
        description: 'Whether admin has been notified about this request',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Only send notification for new requests
        if (operation === 'create' && !doc.notificationSent) {
          try {
            const emailSent = await sendEventRequestNotification({
              fullName: doc.fullName,
              email: doc.email,
              phoneNumber: doc.phoneNumber,
              comments: doc.comments,
              requestId: doc.id,
              date: new Date(doc.createdAt),
            });

            if (emailSent) {
              // Mark notification as sent directly on the doc
              doc.notificationSent = true;
              console.log(`✅ Event request notification sent for ${doc.id}`);
            }
          } catch (error) {
            console.error('Error sending event request notification:', error);
          }
        }
        return doc;
      },
    ],
  },
};
