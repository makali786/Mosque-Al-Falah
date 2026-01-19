# Services Collection Schema Update

## Overview

The Services collection schema has been updated to support dynamic service detail pages through a flexible content blocks system.

## What Changed

### New Field: `contentBlocks`

A new array field has been added that allows building service detail pages with flexible, reorderable content blocks.

### Available Block Types

1. **Hero Section** (`hero`)
   - Heading
   - Rich text content
   - Image (left or right positioned)
   - Optional button (text + URL)

2. **Media Section** (`media`)
   - Section title and description
   - Video URL with thumbnail
   - Live badge option
   - Supports Video/Photos/Audio tabs

3. **Venue Information** (`venue`)
   - Venue name
   - Full address
   - Google Maps link

4. **Donation Section** (`donation`)
   - Custom title and description
   - Suggested donation amounts

5. **Testimonials Carousel** (`testimonials`)
   - Multiple testimonial items
   - Quote, author, author title, photo

6. **Requirements/Steps Carousel** (`requirements`)
   - Section title
   - Numbered steps with title, description, and optional image
   - Perfect for processes like marriage requirements

7. **Rich Content** (`richContent`)
   - Optional section title
   - Rich text editor
   - Background color options (white, gray, blue)

8. **Call to Action** (`cta`)
   - Title and description
   - Button with customizable text, URL, and style

9. **Schedule Display** (`schedule`)
   - Schedule type (daily, weekly, monthly, seasonal, on-request)
   - Schedule description
   - Multiple time slots with labels and additional info

## How to Use

### For New Services

1. Go to the Services collection in Payload CMS
2. Create or edit a service
3. Scroll to "Service Detail Content Blocks"
4. Click "Add Content Block"
5. Select the block type you want
6. Fill in the block-specific fields
7. Drag blocks to reorder them
8. Save

### For Existing Services

- All existing fields remain intact (backward compatible)
- Legacy fields like `nikaah`, `taraweehEid`, `media`, `venue`, `donation`, `testimonials` still work
- You can gradually migrate to the new content blocks system

## Benefits

1. **Flexibility**: Mix and match any content sections in any order
2. **Reusability**: Same block types can be used across different services
3. **Scalability**: Easy to add new block types in the future
4. **No Code Changes**: Content editors can build complex pages without developer intervention
5. **Backward Compatible**: Existing services continue to work

## Example Use Cases

### Nikaah Marriage Service

```
1. Hero Block (image + description)
2. Media Block (video with venue info)
3. Requirements Block (marriage steps carousel)
4. Venue Block (location details)
5. Donation Block
6. CTA Block (Register your interest)
```

### Taraweeh & Eid Prayers

```
1. Hero Block
2. Schedule Block (prayer times)
3. Media Block (live stream)
4. Venue Block
5. Testimonials Block
6. Donation Block
```

### Food Bank Service

```
1. Hero Block
2. Rich Content Block (eligibility criteria)
3. Schedule Block (distribution times)
4. Venue Block
5. CTA Block (Apply now)
```

## Next Steps

To fully utilize this new system, you'll need to:

1. **Create a Dynamic Service Detail Component** that renders these blocks
2. **Update the service detail page** (`/app/(frontend)/our-services/[slug]/page.tsx`) to use the new component
3. **Migrate existing services** to use content blocks (optional, can be done gradually)

## Technical Notes

- Block types are conditional - fields only show when the relevant block type is selected
- All blocks support drag-and-drop reordering
- The schema uses Payload CMS's array field with conditional groups
- Legacy fields are preserved for backward compatibility
