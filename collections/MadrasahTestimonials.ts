import type { CollectionConfig } from 'payload';

export const MadrasahTestimonials: CollectionConfig = {
  slug: 'madrasah-testimonials',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'rating', 'order', 'isActive'],
    description: 'Parent and student testimonials for Madrasah',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ============================================================================
    // Testimonial Content
    // ============================================================================
    {
      name: 'title',
      type: 'text',
      label: 'Testimonial Title',
      admin: {
        description: 'e.g., "A Truly Transformative Experience"',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Testimonial Text',
      admin: {
        description: 'The full testimonial quote',
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
      label: 'Star Rating',
      admin: {
        description: 'Rating out of 5 stars',
      },
    },

    // ============================================================================
    // Author Information
    // ============================================================================
    {
      name: 'authorName',
      type: 'text',
      required: true,
      label: 'Author Name',
      admin: {
        description: 'Full name or "Guardian Name" if anonymous',
      },
    },
    {
      name: 'authorInitials',
      type: 'text',
      label: 'Author Initials',
      admin: {
        description: 'e.g., "GN" for Guardian Name - used in avatar',
      },
    },
    {
      name: 'authorRole',
      type: 'text',
      defaultValue: 'Parent',
      label: 'Author Role',
      admin: {
        description: 'e.g., "Parent", "Guardian", "Student", "Mohammed S."',
      },
    },
    {
      name: 'authorPhoto',
      type: 'upload',
      relationTo: 'media',
      label: 'Author Photo (Optional)',
      admin: {
        description: 'Profile photo - if not provided, initials will be shown',
      },
    },

    // ============================================================================
    // Display Settings
    // ============================================================================
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        description: 'Order in testimonials carousel (lower numbers first)',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Testimonial',
      admin: {
        description: 'Show this testimonial prominently',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Show this testimonial on the website',
      },
    },
  ],
};
