# Additional Content Blocks for Services Collection

## Instructions

Add these blocks BEFORE line 891 (before the closing `],` of the scheduleBlock) in `/Users/Macbookpro/Documents/Mosque-Al-Falah/collections/Services.ts`

Insert after the scheduleBlock (around line 891), before the `],` that closes all content block fields.

```typescript
        // FAQs Block
        {
          name: 'faqsBlock',
          type: 'group',
          label: 'FAQs Section Settings',
          admin: {
            condition: (data, siblingData) => siblingData?.blockType === 'faqs',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Frequently Asked Questions (FAQs)',
              label: 'Section Title',
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitle',
              admin: {
                description:
                  'e.g., "Find answers to common questions about our Madrasah programs."',
              },
            },
            {
              name: 'faqs',
              type: 'array',
              label: 'FAQ Items',
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  label: 'Question',
                },
                {
                  name: 'answer',
                  type: 'richText',
                  required: true,
                  label: 'Answer',
                },
              ],
            },
            {
              name: 'backgroundColor',
              type: 'select',
              options: [
                { label: 'Blue', value: 'blue' },
                { label: 'White', value: 'white' },
                { label: 'Gray', value: 'gray' },
              ],
              defaultValue: 'blue',
              label: 'Background Color',
            },
          ],
        },

        // Live Streaming Block
        {
          name: 'liveStreamingBlock',
          type: 'group',
          label: 'Live Streaming Section Settings',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.blockType === 'liveStreaming',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Live Taraweeh Streaming',
              label: 'Section Title',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              admin: {
                description: 'e.g., "For those unable to attend in person..."',
              },
            },
            {
              name: 'videoUrl',
              type: 'text',
              label: 'Stream URL',
            },
            {
              name: 'videoThumbnail',
              type: 'upload',
              relationTo: 'media',
              label: 'Video Thumbnail',
            },
            {
              name: 'isLive',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show "Live" Badge',
            },
          ],
        },

        // Two-Column Content Block
        {
          name: 'twoColumnBlock',
          type: 'group',
          label: 'Two-Column Content Settings',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.blockType === 'twoColumn',
          },
          fields: [
            {
              name: 'heading',
              type: 'text',
              label: 'Section Heading',
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              label: 'Content',
              admin: {
                description: 'Supports bullet points and rich formatting',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Image',
            },
            {
              name: 'imagePosition',
              type: 'select',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
              defaultValue: 'right',
              label: 'Image Position',
            },
          ],
        },

        // Gallery Block
        {
          name: 'galleryBlock',
          type: 'group',
          label: 'Gallery Settings',
          admin: {
            condition: (data, siblingData) => siblingData?.blockType === 'gallery',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Gallery',
              label: 'Section Title',
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitle',
            },
            {
              name: 'images',
              type: 'array',
              label: 'Gallery Images',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Caption (Optional)',
                },
              ],
            },
          ],
        },

        // Email Signup / Notifications Block
        {
          name: 'emailSignupBlock',
          type: 'group',
          label: 'Email Signup / Notifications Settings',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.blockType === 'emailSignup',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              defaultValue: 'Prayer Reminders & Notifications',
              label: 'Section Title',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
            },
            {
              name: 'showCountdown',
              type: 'checkbox',
              defaultValue: false,
              label: 'Show Countdown Timer',
            },
            {
              name: 'countdownLabel',
              type: 'text',
              label: 'Countdown Label',
              admin: {
                description:
                  'e.g., "The time for Taraweeh begins after the Isha prayer"',
                condition: (data, siblingData) => siblingData?.showCountdown,
              },
            },
            {
              name: 'countdownTargetDate',
              type: 'date',
              label: 'Countdown Target Date/Time',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                condition: (data, siblingData) => siblingData?.showCountdown,
              },
            },
            {
              name: 'backgroundColor',
              type: 'select',
              options: [
                { label: 'Dark', value: 'dark' },
                { label: 'Blue', value: 'blue' },
                { label: 'White', value: 'white' },
              ],
              defaultValue: 'dark',
              label: 'Background Color',
            },
          ],
        },

        // Quote with Image Block
        {
          name: 'quoteWithImageBlock',
          type: 'group',
          label: 'Quote with Image Settings',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.blockType === 'quoteWithImage',
          },
          fields: [
            {
              name: 'quote',
              type: 'textarea',
              required: true,
              label: 'Quote Text',
            },
            {
              name: 'attribution',
              type: 'text',
              label: 'Attribution',
              admin: {
                description:
                  'e.g., "Sahih al-Bukhari" or "— Prophet Muhammad ﷺ"',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Image',
            },
            {
              name: 'imagePosition',
              type: 'select',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
              defaultValue: 'right',
              label: 'Image Position',
            },
          ],
        },
```

## Summary of New Blocks

1. **FAQs Block** - Accordion-style FAQ section with blue background option
2. **Live Streaming Block** - Video streaming section with live badge
3. **Two-Column Content Block** - Text content with image (left or right)
4. **Gallery Block** - Photo grid gallery
5. **Email Signup Block** - Newsletter signup with optional countdown timer
6. **Quote with Image Block** - Quote/testimonial with accompanying image

These blocks match the sections visible in the dynamic service detail page screenshots.
