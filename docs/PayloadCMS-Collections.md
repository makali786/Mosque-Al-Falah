# Payload CMS Collections Documentation

## Overview

This document describes all the Payload CMS collections created for managing content on the Mosque Al-Falah website. These collections are organized to match the homepage and About Us page structure.

---

## 📚 Content Collections Summary

### **Homepage Collections**

1. **Banners** - Hero carousel slides
2. **Events** - Upcoming events section
3. **Notices** - Notice board announcements
4. **Services** - Mosque services carousel
5. **Imams** - Meet our Imams section
6. **AyatOfTheMonth** - Featured Quranic verses
7. **Sermons** - Featured sermons and lectures
8. **DonationAppeals** - Fundraising campaigns

### **About Page Collections**

9. **CoreValues** - Core values section
10. **Committees** - Mosque committees and members
11. **PageSections** - Flexible content sections (Our History, Mission, etc.)

### **Core Collections**

- **Users** - CMS admin users
- **Media** - File uploads and media library

---

## 📋 Detailed Collection Descriptions

### 1. **Banners** (`/collections/Banners.ts`)

**Purpose**: Manages hero banner slides for the homepage carousel

**Key Fields**:

- `title` - Banner heading
- `description` - Banner text
- `image` - Desktop banner image
- `mobileImage` - Optional mobile-specific image
- `primaryButton` - CTA button (e.g., "Donate")
- `secondaryButton` - Secondary CTA (e.g., "Learn More")
- `order` - Display order (lower numbers first)
- `isActive` - Toggle visibility

**Usage**: Currently displays 4 rotating slides, auto-rotates every 5 seconds

---

### 2. **Events** (`/collections/Events.ts`)

**Purpose**: Manages upcoming events displayed on homepage

**Key Fields**:

- `title` - Event name
- `description` - Short description
- `image` - Event thumbnail
- `videoUrl` - Optional video link
- `eventDate` - Date and time of event
- `location` - Event venue
- `fullDescription` - Detailed information (rich text)
- `registrationUrl` - Link to registration
- `isPublished` - Publish status
- `isFeatured` - Show on homepage

**Features**:

- Date picker with time
- Video integration (YouTube/Vimeo)
- Registration link management
- Featured events highlighting

---

### 3. **Notices** (`/collections/Notices.ts`)

**Purpose**: Notice board for community announcements

**Key Fields**:

- `title` - Notice headline
- `noticeDate` - Publication date
- `category` - Events | News | Announcement
- `content` - Full notice details (rich text)
- `isCancelled` - Mark cancelled events
- `isPinned` - Keep at top of board

**Features**:

- Category-based filtering
- Cancellation badges
- Pin important notices
- Auto-scrolling on desktop

---

### 4. **Services** (`/collections/Services.ts`)

**Purpose**: Mosque services catalog

**Key Fields**:

- `title` - Service name
- `image` - Service image
- `shortDescription` - Card description
- `fullDescription` - Detailed info (rich text)
- `schedule` - When service is available
- `contactPerson` - Service coordinator
- `contactEmail` & `contactPhone` - Contact details
- `order` - Display order

**Current Services**:

- Five Daily Prayers
- Friday Jumu'ah Sermon
- Taraweeh and Eid Prayers
- Food Bank
- Madrasah & Hifdh Class
- Weekly Adult Classes
- Nikaah Marriage Service
- Regular Educational Events
- Youth Activities

---

### 5. **Imams** (`/collections/Imams.ts`)

**Purpose**: Imam profiles and contact information

**Key Fields**:

- `name` - Full name
- `title` - Position (e.g., "Imam & Qari")
- `image` - Profile photo
- `imageStyle` - Custom CSS for positioning
- `biography` - Personal background (rich text)
- `education` - Educational qualifications
- `specializations` - Areas of expertise (array)
- `languages` - Languages spoken (array)
- `email` - Contact email
- `askImamEnabled` - Enable Q&A feature
- `order` - Display order

**Features**:

- Multi-language support
- "Ask Imam" functionality
- Detailed biographies
- Educational background tracking

---

### 6. **AyatOfTheMonth** (`/collections/AyatOfTheMonth.ts`)

**Purpose**: Featured Quranic verses with translations and tafsir

**Key Fields**:

- `surahName` & `surahNumber` - Surah identification
- `ayahNumber` - Verse number
- `arabicText` - Arabic verse
- `arabicCalligraphyImage` - SVG calligraphy
- `englishTranslation` - Translation
- `transliteration` - Romanized text
- `tafsir` - Explanation (rich text)
- `monthYear` - Featured month
- `videoUrl` & `videoTitle` - Video tafsir
- `videoThumbnail` - Video preview image
- `audioUrl` - Recitation audio
- `reciter` - Reciter name
- `isActive` - Current month's ayat

**Features**:

- Multiple view modes (default, video, audio)
- Arabic calligraphy display
- Video tafsir integration
- Audio recitation player
- Monthly rotation

---

### 7. **Sermons** (`/collections/Sermons.ts`)

**Purpose**: Khutbahs and Islamic lectures library

**Key Fields**:

- `title` - Sermon title
- `speaker` - Link to Imam (relationship)
- `guestSpeaker` - Guest speaker details (if not from Imams)
  - `name`, `title`, `avatar`, `bio`, `email`
- `sermonDate` - Delivery date/time
- `image` - Sermon thumbnail
- `description` - Short description
- `content` - Full notes (rich text)
- `videoUrl` - Video recording
- `audioUrl` - Audio recording
- `category` - Jummah | Taraweeh | Eid | Lecture | Series | Other
- `tags` - Searchable tags (array)
- `language` - English | Arabic | Urdu | Bengali | Mixed
- `duration` - Length of sermon
- `isFeatured` - Homepage display
- `isPublished` - Visibility control

**Features**:

- Speaker relationships
- Multi-format support (video/audio)
- Category and tag filtering
- Multi-language support
- Duration tracking

---

### 8. **DonationAppeals** (`/collections/DonationAppeals.ts`)

**Purpose**: Fundraising campaigns and donation tracking

**Key Fields**:

- `title` - Campaign name
- `shortDescription` - Card description
- `fullDescription` - Detailed campaign info (rich text)
- `images` - Multiple campaign images (array)
- `targetAmount` - Fundraising goal (£)
- `currentAmount` - Amount raised (£)
- `totalDonors` - Number of contributors
- `startDate` & `endDate` - Campaign duration
- `donationUrl` - Payment page link
- `category` - General | Development | Education | Community | Zakat | Sadaqah | Emergency
- `isFeatured` - Homepage display
- `isActive` - Campaign status
- `order` - Display priority

**Features**:

- Progress tracking
- Donor count
- Multiple images support
- Category classification
- End date management

---

### 9. **CoreValues** (`/collections/CoreValues.ts`)

**Purpose**: Mosque core values for About Us page

**Key Fields**:

- `title` - Value name
- `description` - Value description
- `icon` - Icon image (SVG/media)
- `iconName` - React Icons name (alternative)
- `order` - Display order
- `isActive` - Visibility

**Features**:

- Flexible icon system (upload or React Icons)
- Order management
- Active/inactive toggle

---

### 10. **Committees** (`/collections/Committees.ts`)

**Purpose**: Mosque committees and member management

**Key Fields**:

- `name` - Committee name
- `description` - Committee purpose (rich text)
- `members` - Array of members:
  - `name` - Member name
  - `role` - Position (Chairman, Secretary, etc.)
  - `photo` - Member photo
  - `bio` - Short biography
  - `email` - Contact email
- `responsibilities` - Key duties (rich text)
- `meetingSchedule` - When committee meets
- `order` - Display order
- `isActive` - Status

**Features**:

- Multiple members per committee
- Role-based organization
- Contact information
- Meeting schedule tracking

---

### 11. **PageSections** (`/collections/PageSections.ts`)

**Purpose**: Flexible, reusable content sections (Our History, Mission, etc.)

**Key Fields**:

- `sectionTitle` - Section heading
- `pageName` - About Us | Home | Services | Contact | Other
- `sectionType` - Image Right | Image Left | Text Only | Hero | Quote
- `heading` - Main heading
- `subheading` - Optional subheading
- `content` - Main content (rich text)
- `image` - Section image
- `imageAlt` - Alt text
- `backgroundColor` - Custom background color
- `buttons` - CTA buttons (array, max 2):
  - `text`, `url`, `style` (Primary/Secondary/Outline)
- `order` - Section order on page
- `isPublished` - Visibility

**Features**:

- Multiple layout types
- Rich text content
- Multi-button support
- Background customization
- Page-specific filtering

**Current Uses**:

- "Our History" section
- "Our Mission" section
- Other dynamic About Us content

---

## 🔗 Collection Relationships

```
Sermons
  └─> speaker (relationship to Imams)

DonationAppeals
  └─> images (array of Media)

All collections with images
  └─> relationTo: 'media'
```

---

## 🎨 Frontend Integration Guide

### Fetching Data Example

```typescript
// Example: Fetch banners for homepage
const response = await fetch(
  '/api/banners?where[isActive][equals]=true&sort=order'
);
const { docs: banners } = await response.json();

// Example: Fetch featured events
const response = await fetch(
  '/api/events?where[isFeatured][equals]=true&where[isPublished][equals]=true'
);
const { docs: events } = await response.json();

// Example: Get current month's Ayat
const response = await fetch(
  '/api/ayat-of-the-month?where[isActive][equals]=true&limit=1'
);
const {
  docs: [currentAyat],
} = await response.json();
```

### API Endpoints

All collections are available via REST API:

- `GET /api/{collection-slug}` - List items
- `GET /api/{collection-slug}/{id}` - Get single item
- `POST /api/{collection-slug}` - Create (requires auth)
- `PATCH /api/{collection-slug}/{id}` - Update (requires auth)
- `DELETE /api/{collection-slug}/{id}` - Delete (requires auth)

---

## 🛠️ Admin Panel Access

**URL**: `http://localhost:3000/admin`

**Collections Organization**:

- **Core Collections**: Users, Media
- **Homepage Content**: Banners, Events, Notices, Services, Imams, Ayat, Sermons, Donations
- **About Page Content**: Core Values, Committees, Page Sections

---

## 🔄 Migration Steps

### Step 1: Update Frontend Components

Replace hardcoded data with API calls:

1. **HeroBanner.tsx** → Fetch from `Banners` collection
2. **NewsAndUpdates.tsx** → Fetch from `Events` & `Notices` collections
3. **Services.tsx** → Fetch from `Services` collection
4. **MeetOurImams.tsx** → Fetch from `Imams` collection
5. **AyatOfTheMonth.tsx** → Fetch from `AyatOfTheMonth` collection
6. **Sermons.tsx** → Fetch from `Sermons` collection
7. **DonationAppeal.tsx** → Fetch from `DonationAppeals` collection

### Step 2: About Us Page

Update `about-us/page.tsx`:

- Fetch from `PageSections` collection for History & Mission
- Fetch from `CoreValues` collection
- Fetch from `Committees` collection

### Step 3: Create Initial Content

Use the admin panel to create initial content based on existing hardcoded data.

---

## 📊 Collection Statistics

| Collection      | Estimated Items | Update Frequency |
| --------------- | --------------- | ---------------- |
| Banners         | 4               | Monthly          |
| Events          | 10-20           | Weekly           |
| Notices         | 5-10            | Daily            |
| Services        | 9               | Yearly           |
| Imams           | 2-5             | Yearly           |
| AyatOfTheMonth  | 12              | Monthly          |
| Sermons         | 50+             | Weekly           |
| DonationAppeals | 3-5             | Monthly          |
| CoreValues      | 5-7             | Yearly           |
| Committees      | 3-8             | Yearly           |
| PageSections    | 10-15           | Quarterly        |

---

## ✅ Best Practices

1. **Always set meaningful `order` values** for consistent display
2. **Use `isActive/isPublished` flags** to control visibility without deleting
3. **Upload high-quality images** with appropriate alt text
4. **Use rich text** for formatted content (bold, lists, links)
5. **Set proper relationships** (e.g., link sermons to imams)
6. **Regular content updates** keep the site fresh and engaging
7. **Test on mobile** after content changes

---

## 🚀 Next Steps

1. ✅ Collections created and configured
2. ⏳ Update frontend to fetch from CMS
3. ⏳ Seed initial content via admin panel
4. ⏳ Create API helper functions
5. ⏳ Add loading states and error handling
6. ⏳ Implement caching strategy
7. ⏳ Add content preview feature

---

## 📞 Support

For questions about the CMS structure or modifications, refer to:

- Payload CMS Documentation: https://payloadcms.com/docs
- This project's README.md
- Collection source files in `/collections/`
