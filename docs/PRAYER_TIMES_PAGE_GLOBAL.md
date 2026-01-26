# Prayer Times Page Global Configuration

## Overview

Created a comprehensive global configuration for the Prayer Times page that allows admins to manage all content and settings through the Payload CMS admin panel.

## File Created

- `/globals/PrayerTimesPage.ts` - Main global configuration file

## Configuration Registered

- Added import in `payload.config.ts`
- Registered in globals array

## Features & Sections

### 1. **Page Header Section**

- Toggle to show/hide page header
- Customizable page title (default: "Prayer Times")
- Optional subtitle/description

### 2. **Prayer Times Widget Settings**

Comprehensive widget configuration including:

- **Layout Options:**
  - Side by Side (Calendar + Times)
  - Stacked (Calendar above Times)
  - Times Only
  - Calendar Only

- **Calendar Widget:**
  - Toggle calendar visibility
  - Custom background image upload
  - Next prayer countdown timer
  - Countdown format options (HH:MM:SS or HH:MM)

- **Prayer Times Table:**
  - Display mode options (Both, Begins only, Jamaah only)
  - Highlight current/next prayer
  - Date navigation (Previous/Next day)
  - Month/Timetable dropdown selector

### 3. **Location Information Display**

- Toggle location info visibility
- Customizable location text (default: "Ilford, Essex IG1 3EN")
- Optional calculation method display

### 4. **Quote Section** ✨

Based on the image showing: _"The best of you is the one who is the best to his family." — Prophet Muhammad ﷺ_

- Toggle quote section visibility
- Customizable quote text
- Quote attribution (who said it)
- Optional source reference (e.g., "Sahih al-Bukhari")
- Background color options (Gray, White, Blue, Dark)
- Text alignment options (Left, Center, Right)

### 5. **Call-to-Action Buttons** 🎯

Based on the image showing "Share this page" and "Donate Now" buttons:

- Toggle CTA buttons visibility
- Multiple button support (max 4)
- **Button Configuration:**
  - Custom button text
  - URL or action type
  - Action types:
    - Navigate to URL
    - Share Page
    - Download Timetable
    - Print Page
  - Style options (Primary, Secondary, Dark)
  - Optional icon support
- Buttons alignment (Left, Center, Right)

### 6. **Additional Information Section**

- Toggle additional info section
- Customizable section title
- Rich text content editor
- Optional FAQs subsection with Q&A pairs

### 7. **Prayer Reminders Section**

- Toggle notification signup
- Customizable title and description
- Multiple notification methods:
  - Email
  - SMS
  - WhatsApp
  - Push Notifications
- Individual method enable/disable

### 8. **Related Links Section**

- Toggle related links visibility
- Customizable section title
- Multiple links with:
  - Title
  - Description
  - URL
  - Optional icon

### 9. **SEO Settings**

- Meta title (default: "Prayer Times - Masjid Al-Falah")
- Meta description with prayer times focus
- Keywords array
- Social share image upload

## Default Configuration

The global comes pre-configured with sensible defaults matching the current Prayer Times page:

```typescript
{
  pageHeader: {
    title: "Prayer Times",
    showHeader: true
  },
  prayerWidget: {
    widgetLayout: "side-by-side",
    showCalendar: true,
    showCountdown: true,
    showPrayerTimes: true,
    timesDisplayMode: "both",
    highlightCurrentPrayer: true
  },
  quoteSection: {
    showQuote: true,
    quoteText: "The best of you is the one who is the best to his family.",
    quoteAttribution: "Prophet Muhammad ﷺ",
    quoteBackgroundColor: "gray",
    quoteTextAlignment: "left"
  },
  ctaButtons: {
    showCTAButtons: true,
    buttonsAlignment: "center"
  }
}
```

## How to Use

1. **Access the Global:**
   - Navigate to Payload CMS Admin
   - Go to "Globals" section
   - Select "Prayer Times Page"

2. **Configure Content:**
   - Adjust widget layout and display options
   - Customize the quote section with Islamic quotes/hadith
   - Add CTA buttons (Share, Donate, Download, etc.)
   - Set up prayer reminders if needed
   - Add FAQs or additional information

3. **Frontend Integration:**
   - Fetch the global data in your Prayer Times page component
   - Use the configuration to conditionally render sections
   - Apply the styling options (colors, alignments, etc.)

## Example Usage in Frontend

```typescript
// Fetch the global configuration
const prayerTimesPageConfig = await payload.findGlobal({
  slug: 'prayer-times-page',
});

// Use in component
{prayerTimesPageConfig.quoteSection?.showQuote && (
  <QuoteSection
    quote={prayerTimesPageConfig.quoteSection.quoteText}
    attribution={prayerTimesPageConfig.quoteSection.quoteAttribution}
    source={prayerTimesPageConfig.quoteSection.quoteSource}
    backgroundColor={prayerTimesPageConfig.quoteSection.quoteBackgroundColor}
    alignment={prayerTimesPageConfig.quoteSection.quoteTextAlignment}
  />
)}

{prayerTimesPageConfig.ctaButtons?.showCTAButtons && (
  <CTAButtons
    buttons={prayerTimesPageConfig.ctaButtons.buttons}
    alignment={prayerTimesPageConfig.ctaButtons.buttonsAlignment}
  />
)}
```

## Benefits

✅ **Centralized Content Management** - All Prayer Times page content in one place
✅ **Flexible Layout Options** - Multiple widget and display configurations
✅ **Islamic Content Ready** - Quote section for hadith and Quranic verses
✅ **User Engagement** - CTA buttons for sharing, donations, downloads
✅ **SEO Optimized** - Built-in SEO settings for better search visibility
✅ **Extensible** - Easy to add more sections as needed

## Next Steps

To complete the integration:

1. Update the frontend Prayer Times page to fetch this global
2. Create React components for each section (QuoteSection, CTAButtons, etc.)
3. Implement the action handlers (share, download, print)
4. Style the components according to the design system
5. Test all configurations in the admin panel
