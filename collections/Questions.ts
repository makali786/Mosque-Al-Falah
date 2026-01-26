import type { CollectionConfig } from 'payload';
import { sendQuestionNotification } from '../lib/email/email-service';

export const Questions: CollectionConfig = {
  slug: 'questions',
  labels: {
    singular: 'Question',
    plural: 'Questions',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'topic', 'status', 'createdAt'],
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
          name: 'name',
          type: 'text',
          required: true,
          label: 'Name',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          label: 'E-Mail',
          admin: {
            width: '50%',
          },
        },
      ],
    },

    // ============================================================================
    // Question Details
    // ============================================================================
    {
      name: 'topic',
      type: 'select',
      required: true,
      label: 'Select Topic',
      options: [
        { label: 'General Inquiry', value: 'general' },
        { label: 'Prayer Times', value: 'prayer-times' },
        { label: 'Events & Programs', value: 'events' },
        { label: 'Donations', value: 'donations' },
        { label: 'Madrasah', value: 'madrasah' },
        { label: 'Services', value: 'services' },
        { label: 'Islamic Guidance', value: 'islamic-guidance' },
        { label: 'Facilities', value: 'facilities' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Select the topic that best matches your question',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Your Message',
      admin: {
        description: 'Please provide your question or message',
        rows: 8,
      },
    },

    // ============================================================================
    // Status & Response
    // ============================================================================
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Under Review', value: 'reviewing' },
        { label: 'Answered', value: 'answered' },
        { label: 'Closed', value: 'closed' },
      ],
      label: 'Status',
      admin: {
        description: 'Current status of the question',
      },
    },
    {
      name: 'response',
      type: 'textarea',
      label: 'Admin Response',
      admin: {
        description: 'Response to the question (will be sent to the user)',
        rows: 6,
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        description: 'Internal notes (not visible to user)',
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
        description: 'Whether admin has been notified about this question',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Only send notification for new questions
        if (operation === 'create' && !doc.notificationSent) {
          try {
            const emailSent = await sendQuestionNotification({
              name: doc.name,
              email: doc.email,
              topic: doc.topic,
              message: doc.message,
              questionId: doc.id,
              date: new Date(doc.createdAt),
            });

            if (emailSent) {
              // Mark notification as sent directly on the doc
              doc.notificationSent = true;
              console.log(`✅ Question notification sent for ${doc.id}`);
            }
          } catch (error) {
            console.error('Error sending question notification:', error);
          }
        }
        return doc;
      },
    ],
  },
};
