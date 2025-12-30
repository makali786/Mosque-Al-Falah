import type { GlobalConfig } from 'payload';

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact Us Page',
  admin: {
    description: 'Manage all content for the Contact Us page',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ============================================================================
    // Hero Section
    // ============================================================================
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Contact Us',
          label: 'Page Title',
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Hero Background Image',
        },
        {
          name: 'breadcrumb',
          type: 'text',
          defaultValue: 'Home > Contact Us',
          label: 'Breadcrumb Text',
        },
      ],
    },

    // ============================================================================
    // Main Contact Information
    // ============================================================================
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Main Contact Information',
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Contact Information',
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            "We're here to serve our community. Feel free to reach out to us for any inquiries, support, or suggestions.",
          label: 'Section Description',
        },
        {
          name: 'mainAddress',
          type: 'group',
          label: 'Main Address',
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Masjid Al-Falah',
              label: 'Location Name',
            },
            {
              name: 'line1',
              type: 'text',
              defaultValue: 'North Ilford Islamic Centre',
              label: 'Address Line 1',
            },
            {
              name: 'line2',
              type: 'text',
              defaultValue: '97 Kensington Gardens, Ilford, Essex, IG1 3EN',
              label: 'Address Line 2',
            },
          ],
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
          admin: {
            description: 'e.g., "020 8518 5868"',
          },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
          admin: {
            description: 'e.g., "info@masjid-alfalah.org.uk"',
          },
        },
        {
          name: 'mapEmbed',
          type: 'textarea',
          label: 'Google Maps Embed URL or Coordinates',
          admin: {
            description: 'Paste Google Maps embed iframe or coordinates',
          },
        },
        {
          name: 'showMap',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Map',
        },
      ],
    },

    // ============================================================================
    // Brothers Entrance
    // ============================================================================
    {
      name: 'brothersEntrance',
      type: 'group',
      label: 'Brothers Entrance',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Brothers Entrance Section',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Brothers Entrance',
          label: 'Section Title',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Entrance Photo',
          admin: {
            description: 'Photo of brothers entrance (arched corridor)',
          },
        },
        {
          name: 'address',
          type: 'group',
          label: 'Address',
          fields: [
            {
              name: 'line1',
              type: 'text',
              defaultValue: 'North Ilford Islamic Centre',
              label: 'Address Line 1',
            },
            {
              name: 'line2',
              type: 'text',
              defaultValue: '97 Kensington Gardens, Ilford, Essex, IG1 3EN',
              label: 'Address Line 2',
            },
          ],
        },
        {
          name: 'googleMapsLink',
          type: 'text',
          label: 'Google Maps Link',
          admin: {
            description: 'Link for "Get Directions" button',
          },
        },
        {
          name: 'whatsappGroup',
          type: 'group',
          label: 'WhatsApp Group',
          fields: [
            {
              name: 'enableButton',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show WhatsApp Button',
            },
            {
              name: 'buttonText',
              type: 'text',
              defaultValue: 'Join Al-Falah Sisters Group',
              label: 'Button Text',
            },
            {
              name: 'groupLink',
              type: 'text',
              label: 'WhatsApp Group Invite Link',
              admin: {
                description: 'https://chat.whatsapp.com/...',
              },
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Sisters Entrance
    // ============================================================================
    {
      name: 'sistersEntrance',
      type: 'group',
      label: 'Sisters Entrance',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Sisters Entrance Section',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Sisters Entrance',
          label: 'Section Title',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Entrance Photo',
          admin: {
            description: 'Photo of sisters entrance (3 doors)',
          },
        },
        {
          name: 'address',
          type: 'group',
          label: 'Address',
          fields: [
            {
              name: 'line1',
              type: 'text',
              defaultValue: 'North Ilford Islamic Centre',
              label: 'Address Line 1',
            },
            {
              name: 'line2',
              type: 'text',
              defaultValue: '170 Wanstead Park Rd, Ilford, Essex, IG1 3TP',
              label: 'Address Line 2',
            },
          ],
        },
        {
          name: 'googleMapsLink',
          type: 'text',
          label: 'Google Maps Link',
          admin: {
            description: 'Link for "Get Directions" button',
          },
        },
        {
          name: 'whatsappGroup',
          type: 'group',
          label: 'WhatsApp Group',
          fields: [
            {
              name: 'enableButton',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show WhatsApp Button',
            },
            {
              name: 'buttonText',
              type: 'text',
              defaultValue: 'Join Al-Falah Sisters Group',
              label: 'Button Text',
            },
            {
              name: 'groupLink',
              type: 'text',
              label: 'WhatsApp Group Invite Link',
              admin: {
                description: 'https://chat.whatsapp.com/...',
              },
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Parking Notice Section
    // ============================================================================
    {
      name: 'parkingNotice',
      type: 'group',
      label: 'Parking Notice Section',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Parking Notice',
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Please Do Not Park Irresponsibly',
          label: 'Notice Title',
        },
        {
          name: 'message',
          type: 'richText',
          required: true,
          label: 'Notice Message',
          admin: {
            description: 'Full parking notice content',
          },
        },
        {
          name: 'hadithQuote',
          type: 'group',
          label: 'Supporting Hadith Quote',
          fields: [
            {
              name: 'showQuote',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show Quote Box',
            },
            {
              name: 'quoteText',
              type: 'textarea',
              label: 'Quote Text',
              admin: {
                description: 'e.g., Hadith about not harming neighbors',
              },
            },
            {
              name: 'source',
              type: 'text',
              label: 'Source',
              admin: {
                description: 'e.g., "Bukhari & Muslim"',
              },
            },
          ],
        },
        {
          name: 'backgroundColor',
          type: 'select',
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Red', value: 'red' },
            { label: 'Orange', value: 'orange' },
          ],
          defaultValue: 'blue',
          label: 'Section Background Color',
        },
      ],
    },

    // ============================================================================
    // Ask a Question Form
    // ============================================================================
    {
      name: 'contactForm',
      type: 'group',
      label: 'Ask a Question Form',
      fields: [
        {
          name: 'enableSection',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Contact Form',
        },
        {
          name: 'sectionTitle',
          type: 'text',
          defaultValue: 'Ask a Question',
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'If you have any questions, you can contact us. Please, fill out the form below.',
          label: 'Form Description',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Form Image',
          admin: {
            description: 'Image shown on left side (person reading Quran)',
          },
        },
        {
          name: 'formSettings',
          type: 'group',
          label: 'Form Settings',
          fields: [
            {
              name: 'nameLabel',
              type: 'text',
              defaultValue: 'Name *',
              label: 'Name Field Label',
            },
            {
              name: 'emailLabel',
              type: 'text',
              defaultValue: 'E-Mail *',
              label: 'Email Field Label',
            },
            {
              name: 'topicLabel',
              type: 'text',
              defaultValue: 'Select Topic',
              label: 'Topic Field Label',
            },
            {
              name: 'messageLabel',
              type: 'text',
              defaultValue: 'Your Message',
              label: 'Message Field Label',
            },
            {
              name: 'submitButtonText',
              type: 'text',
              defaultValue: 'Send Message',
              label: 'Submit Button Text',
            },
          ],
        },
        {
          name: 'topicOptions',
          type: 'array',
          label: 'Topic Dropdown Options',
          fields: [
            {
              name: 'topic',
              type: 'text',
              required: true,
              admin: {
                description:
                  'e.g., "General Inquiry", "Prayer Times", "Events", "Services"',
              },
            },
          ],
        },
        {
          name: 'recipientEmail',
          type: 'email',
          label: 'Form Submissions Email',
          admin: {
            description: 'Email address where form submissions will be sent',
          },
        },
        {
          name: 'successMessage',
          type: 'textarea',
          defaultValue:
            'Thank you for your message! We will get back to you soon.',
          label: 'Success Message',
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
          label: 'Quote Text',
          admin: {
            description: 'Inspirational quote or Hadith',
          },
        },
        {
          name: 'author',
          type: 'text',
          required: true,
          label: 'Quote Author',
          admin: {
            description: 'e.g., "Prophet Muhammad ﷺ"',
          },
        },
        {
          name: 'showShareButton',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Share Button',
        },
        {
          name: 'showDonateButton',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Donate Button',
        },
        {
          name: 'donateButtonUrl',
          type: 'text',
          defaultValue: '/appeals',
          label: 'Donate Button URL',
        },
      ],
    },

    // ============================================================================
    // Additional Contact Methods
    // ============================================================================
    {
      name: 'additionalContacts',
      type: 'group',
      label: 'Additional Contact Methods',
      fields: [
        {
          name: 'emergencyContact',
          type: 'group',
          label: 'Emergency Contact',
          fields: [
            {
              name: 'showEmergency',
              type: 'checkbox',
              defaultValue: false,
              label: 'Show Emergency Contact',
            },
            {
              name: 'phoneNumber',
              type: 'text',
              label: 'Emergency Phone Number',
            },
            {
              name: 'availabilityHours',
              type: 'text',
              label: 'Availability Hours',
              admin: {
                description: 'e.g., "24/7" or "9 AM - 5 PM"',
              },
            },
          ],
        },
        {
          name: 'socialMedia',
          type: 'group',
          label: 'Social Media Links',
          fields: [
            {
              name: 'facebook',
              type: 'text',
              label: 'Facebook Page URL',
            },
            {
              name: 'twitter',
              type: 'text',
              label: 'Twitter/X Handle',
            },
            {
              name: 'instagram',
              type: 'text',
              label: 'Instagram Handle',
            },
            {
              name: 'youtube',
              type: 'text',
              label: 'YouTube Channel URL',
            },
          ],
        },
      ],
    },

    // ============================================================================
    // Operating Hours
    // ============================================================================
    {
      name: 'operatingHours',
      type: 'group',
      label: 'Operating Hours',
      fields: [
        {
          name: 'showHours',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show Operating Hours Section',
        },
        {
          name: 'hoursTitle',
          type: 'text',
          defaultValue: 'Opening Hours',
          label: 'Section Title',
        },
        {
          name: 'weekdayHours',
          type: 'text',
          label: 'Weekday Hours',
          admin: {
            description: 'e.g., "Monday - Friday: 5:00 AM - 10:00 PM"',
          },
        },
        {
          name: 'weekendHours',
          type: 'text',
          label: 'Weekend Hours',
          admin: {
            description: 'e.g., "Saturday - Sunday: 5:00 AM - 11:00 PM"',
          },
        },
        {
          name: 'specialNotes',
          type: 'richText',
          label: 'Special Notes',
          admin: {
            description: 'Any special hour arrangements for Ramadan, etc.',
          },
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
              'Leave blank to use default "Contact Us - Masjid Al-Falah"',
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
