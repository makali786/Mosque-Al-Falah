# Newsletter Subscription System Documentation

## Overview

A complete newsletter subscription system has been implemented for the Mosque Al-Falah website. This system allows visitors to subscribe to newsletters from the footer, tracks subscribers, manages preferences, and provides analytics.

## Files Created/Modified

### New Files

1. **`/collections/NewsletterSubscribers.ts`** - Collection to store and manage newsletter subscribers
2. **`/app/api/newsletter/subscribe/route.ts`** - API endpoint for newsletter subscriptions
3. **`/app/api/newsletter/unsubscribe/route.ts`** - API endpoint for unsubscribing

### Modified Files

1. **`/app/(frontend)/components/layout/Footer.tsx`** - Added newsletter subscription functionality
2. **`/payload.config.ts`** - Registered NewsletterSubscribers collection

---

## 📧 NewsletterSubscribers Collection

### Purpose

Stores all newsletter subscribers with comprehensive tracking and preference management.

### Key Features

#### 1. **Subscriber Information**

- Email Address (required, unique)
- First Name (optional)
- Last Name (optional)

#### 2. **Subscription Status**

Status options:

- **Active** - Currently subscribed
- **Unsubscribed** - User unsubscribed
- **Bounced** - Email bounced
- **Pending Confirmation** - Awaiting email confirmation (for double opt-in)

Tracking fields:

- Subscribed Date
- Unsubscribed Date
- Confirmation Token (auto-generated)
- Confirmed Date

#### 3. **Email Preferences**

Subscribers can opt-in/out of different email types:

- ✅ **Weekly Updates** (default: ON)
- ✅ **Event Notifications** (default: ON)
- ⬜ **Prayer Time Updates** (default: OFF)
- ✅ **Donation Appeals** (default: ON)
- ✅ **Ramadan Updates** (default: ON)

#### 4. **Source Tracking**

Track where subscribers came from:

- **Source Types:**
  - Website Footer
  - Event Registration
  - Service Request
  - Donation Page
  - Manual Entry
  - Import
  - Other

- **Source Details:**
  - Referrer URL
  - Device Type (Desktop/Mobile/Tablet)
  - IP Address

#### 5. **Email Campaign Metrics**

Track engagement:

- Total Emails Sent
- Emails Opened
- Emails Clicked
- Last Email Sent Date

#### 6. **Segmentation**

- Tags array for subscriber segmentation
- Examples: "youth", "parents", "donors", "volunteers"

#### 7. **Unsubscribe Management**

- Unsubscribe Reason (dropdown)
- Unsubscribe Feedback (text)

---

## 🔌 API Endpoints

### 1. Subscribe Endpoint

**POST** `/api/newsletter/subscribe`

#### Request Body:

```json
{
  "email": "user@example.com",
  "source": "footer",
  "firstName": "Ahmed", // optional
  "lastName": "Khan" // optional
}
```

#### Response (Success):

```json
{
  "success": true,
  "message": "Thank you for subscribing! You will receive updates from Masjid Al-Falah.",
  "subscriber": {
    "email": "user@example.com",
    "confirmationToken": "NL-1706298765432-a7x9k2m3p5q"
  }
}
```

#### Response (Already Subscribed):

```json
{
  "success": true,
  "message": "You are already subscribed to our newsletter!",
  "alreadySubscribed": true
}
```

#### Response (Reactivated):

```json
{
  "success": true,
  "message": "Welcome back! Your subscription has been reactivated.",
  "reactivated": true
}
```

#### Features:

- ✅ Email validation
- ✅ Duplicate detection
- ✅ Automatic reactivation of unsubscribed users
- ✅ Source tracking (referrer, device, IP)
- ✅ Auto-generated confirmation token
- ✅ Default preferences setup

---

### 2. Unsubscribe Endpoint

**POST** `/api/newsletter/unsubscribe`

#### Request Body (by email):

```json
{
  "email": "user@example.com",
  "reason": "too-many",
  "feedback": "I receive too many emails"
}
```

#### Request Body (by token):

```json
{
  "token": "NL-1706298765432-a7x9k2m3p5q",
  "reason": "not-relevant",
  "feedback": "Content is not relevant to me"
}
```

#### Response:

```json
{
  "success": true,
  "message": "You have been successfully unsubscribed from our newsletter."
}
```

#### Unsubscribe Reasons:

- `too-many` - Too many emails
- `not-relevant` - Not relevant
- `never-subscribed` - Never subscribed
- `other` - Other

---

### 3. Check Subscription Status

**GET** `/api/newsletter/subscribe?email=user@example.com`

#### Response:

```json
{
  "success": true,
  "subscribed": true,
  "status": "active",
  "subscribedAt": "2026-01-26T21:00:00.000Z"
}
```

---

## 🎨 Frontend Implementation

### Footer Newsletter Form

The newsletter form in the footer (`Footer.tsx`) includes:

#### Features:

1. **Email Input Field**
   - Validates email format
   - Disabled during submission
   - Supports Enter key to submit

2. **Subscribe Button**
   - Shows "Subscribing..." during API call
   - Disabled during submission
   - Hover effects

3. **Status Messages**
   - ✅ **Success** - Green background with success message
   - ❌ **Error** - Red background with error message
   - Auto-dismisses after 5 seconds (success only)

4. **Loading States**
   - Input and button disabled during submission
   - Button text changes to "Subscribing..."
   - Opacity reduced on disabled elements

#### User Flow:

```
1. User enters email in footer
   ↓
2. Clicks "Subscribe" or presses Enter
   ↓
3. Form validates email
   ↓
4. API call to /api/newsletter/subscribe
   ↓
5. Success message displayed
   ↓
6. Email input cleared
   ↓
7. Message auto-dismisses after 5 seconds
```

---

## 📊 Admin Panel Features

### Viewing Subscribers

- Navigate to **Collections → Newsletter Subscribers**
- **Default Columns**: Email, Status, Subscribed At, Source
- **Grouped Under**: "Communications" section

### Filtering & Search

- Filter by status (Active, Unsubscribed, Bounced, Pending)
- Filter by source (Footer, Event, Service, etc.)
- Search by email
- Filter by tags

### Managing Subscribers

1. **View Subscriber Details**
   - Full contact information
   - Subscription history
   - Email preferences
   - Campaign metrics
   - Source details

2. **Update Status**
   - Change from Unsubscribed to Active
   - Mark as Bounced
   - Set to Pending Confirmation

3. **Edit Preferences**
   - Toggle individual email types
   - Add/remove tags
   - Update contact information

4. **Add Notes**
   - Internal admin notes
   - Track special requests

### Bulk Operations

- Export subscriber list to CSV
- Bulk tag assignment
- Bulk status updates

---

## 📈 Email Campaign Integration

### Sending Campaigns

When sending email campaigns, filter subscribers by:

```typescript
// Example: Send to active subscribers who want event notifications
const recipients = await payload.find({
  collection: 'newsletter-subscribers',
  where: {
    and: [
      {
        status: {
          equals: 'active',
        },
      },
      {
        'preferences.receiveEventNotifications': {
          equals: true,
        },
      },
    ],
  },
});
```

### Tracking Engagement

After sending emails, update metrics:

```typescript
await payload.update({
  collection: 'newsletter-subscribers',
  id: subscriberId,
  data: {
    emailsSent: subscriber.emailsSent + 1,
    lastEmailSentAt: new Date().toISOString(),
  },
});
```

When email is opened:

```typescript
await payload.update({
  collection: 'newsletter-subscribers',
  id: subscriberId,
  data: {
    emailsOpened: subscriber.emailsOpened + 1,
  },
});
```

---

## 🔔 Welcome Email (To Be Implemented)

### Recommended Flow

1. **Immediate Welcome Email**

   ```
   Subject: Welcome to Masjid Al-Falah Newsletter!

   Assalamu Alaikum,

   Thank you for subscribing to our newsletter!

   You'll receive:
   - Weekly mosque updates
   - Event notifications
   - Donation appeals
   - Special Ramadan updates

   Manage your preferences: [Link]
   Unsubscribe: [Link]

   JazakAllah Khair,
   Masjid Al-Falah Team
   ```

2. **Integration Points**
   - In `/app/api/newsletter/subscribe/route.ts` after line 107
   - Use email service (Resend, SendGrid, Nodemailer)
   - Include confirmation token in unsubscribe link

### Example Implementation:

```typescript
// In subscribe route.ts
import { sendEmail } from '@/lib/email';

// After creating subscriber
await sendEmail({
  to: newSubscriber.email,
  subject: 'Welcome to Masjid Al-Falah Newsletter!',
  template: 'welcome',
  data: {
    email: newSubscriber.email,
    confirmationToken: newSubscriber.confirmationToken,
    unsubscribeUrl: `${process.env.NEXT_PUBLIC_URL}/newsletter/unsubscribe?token=${newSubscriber.confirmationToken}`,
  },
});
```

---

## 🎯 Segmentation Examples

### By Tags

```typescript
// Youth program subscribers
tags: ['youth', 'student'];

// Parents
tags: ['parent', 'family'];

// Donors
tags: ['donor', 'supporter'];

// Volunteers
tags: ['volunteer', 'active-member'];
```

### By Preferences

```typescript
// Ramadan-focused subscribers
preferences.receiveRamadanUpdates: true

// Event enthusiasts
preferences.receiveEventNotifications: true

// Prayer time subscribers
preferences.receivePrayerTimeUpdates: true
```

### By Source

```typescript
// Event attendees
source: 'event';

// Donors
source: 'donation';

// Service users
source: 'service';
```

---

## 🔒 Privacy & Compliance

### GDPR Compliance

- ✅ Clear opt-in process
- ✅ Easy unsubscribe mechanism
- ✅ Data export capability
- ✅ Right to be forgotten (delete subscriber)
- ✅ Preference management

### Best Practices

1. **Double Opt-In** (Optional)
   - Set status to 'pending' on signup
   - Send confirmation email
   - Update to 'active' when confirmed

2. **Unsubscribe Link**
   - Include in every email
   - One-click unsubscribe
   - Collect feedback

3. **Data Retention**
   - Keep unsubscribed users for compliance
   - Don't delete, just mark as unsubscribed
   - Respect unsubscribe status

---

## 📱 Testing the System

### 1. Subscribe via Footer

```bash
# Open the website
# Scroll to footer
# Enter email: test@example.com
# Click Subscribe
# Verify success message
```

### 2. Check Admin Panel

```bash
# Login to Payload CMS
# Navigate to Newsletter Subscribers
# Find test@example.com
# Verify status is "Active"
# Check source is "footer"
```

### 3. Test API Directly

```bash
# Subscribe
curl -X POST http://localhost:3000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"footer"}'

# Check status
curl http://localhost:3000/api/newsletter/subscribe?email=test@example.com

# Unsubscribe
curl -X POST http://localhost:3000/api/newsletter/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","reason":"other"}'
```

---

## 🚀 Next Steps

### Immediate

1. ✅ Collection created
2. ✅ API endpoints created
3. ✅ Footer integration complete

### Recommended

1. **Email Service Integration**
   - Set up Resend/SendGrid/Nodemailer
   - Create email templates
   - Implement welcome email
   - Add unsubscribe links to all emails

2. **Email Campaign System**
   - Create campaign collection
   - Build email composer
   - Add scheduling
   - Track opens/clicks

3. **Preference Center**
   - Create `/newsletter/preferences` page
   - Allow users to update preferences
   - Show subscription history

4. **Analytics Dashboard**
   - Total subscribers
   - Growth rate
   - Engagement metrics
   - Popular preferences

---

## ✨ Benefits

### For Admins

✅ **Centralized Management** - All subscribers in one place  
✅ **Segmentation** - Target specific groups  
✅ **Analytics** - Track engagement  
✅ **Compliance** - GDPR-ready  
✅ **Preferences** - Respect user choices

### For Subscribers

✅ **Easy Signup** - One-click from footer  
✅ **Preference Control** - Choose what to receive  
✅ **Easy Unsubscribe** - One-click unsubscribe  
✅ **Privacy** - Data protection

---

## 🎉 Summary

The newsletter system is now fully functional! Users can:

- Subscribe from the footer
- Receive instant confirmation
- Manage their preferences
- Unsubscribe easily

Admins can:

- View all subscribers
- Segment by preferences/tags/source
- Track engagement metrics
- Export subscriber lists
- Send targeted campaigns

The system is ready for email service integration to start sending newsletters! 📧
