# Event Booking System Documentation

## Overview

A comprehensive event booking and registration system has been added to the Mosque Al-Falah CMS. This system allows admins to configure booking forms for events and track all registrations in a centralized location.

## Files Created/Modified

### New Files

1. **`/collections/EventBookings.ts`** - Collection to store and manage all event bookings

### Modified Files

1. **`/collections/Events.ts`** - Added `bookingFormSettings` group to configure the booking form
2. **`/payload.config.ts`** - Registered the EventBookings collection

---

## 📋 EventBookings Collection

### Purpose

Stores all event registrations and bookings with comprehensive tracking capabilities.

### Key Features

#### 1. **Attendee Information**

- Full Name (required)
- Email Address (required)
- Phone Number (required)
- Number of Guests (default: 1, min: 1)
- Special Requirements (dietary, accessibility, etc.)
- Additional Notes

#### 2. **Booking Status Management**

Status options:

- **Pending** - Initial booking state
- **Confirmed** - Booking confirmed by admin
- **Cancelled** - Booking cancelled
- **Attended** - Attendee showed up
- **No Show** - Attendee didn't show up

#### 3. **Auto-Generated Confirmation Code**

Each booking automatically receives a unique confirmation code:

- Format: `EVT-{timestamp}-{random}`
- Example: `EVT-1706298765432-A7X9K2M`
- Used for check-in and verification

#### 4. **Payment Tracking** (for paid events)

- Payment status (isPaid)
- Amount paid
- Payment method (Online, Cash, Bank Transfer, Other)
- Transaction ID
- Payment date

#### 5. **Communication History**

Track all communications sent to attendees:

- Confirmation emails
- Reminder emails
- Update emails
- Cancellation emails
- Custom communications

Each entry includes:

- Communication type
- Sent timestamp
- Subject
- Notes

#### 6. **Source Tracking**

Track where bookings came from:

- Referrer URL
- Device type (Desktop, Mobile, Tablet)
- IP Address (for fraud prevention)

#### 7. **Admin Features**

- Admin notes (internal only)
- Confirmation email sent status
- Full communication log

### Admin Panel Features

- **Default Columns**: Full Name, Email, Event, Number of Guests, Created At, Status
- **Grouped Under**: "Events" section in admin panel
- **Search & Filter**: By name, email, event, status
- **Export**: Export booking data for reporting

---

## 🎯 Events Collection - Booking Form Settings

### New Field Group: `bookingFormSettings`

Located within the `registration` group, this configuration appears when "Enable Registration" is checked.

### Configuration Options

#### **Basic Settings**

1. **Form Title**
   - Default: "Book a place"
   - Customizable heading for the booking form

2. **Form Description**
   - Optional text shown above the form
   - Use for instructions or event-specific information

#### **Field Configuration**

1. **Require Phone Number**
   - Default: Yes
   - Toggle to make phone number optional

2. **Allow Multiple Guests**
   - Default: Yes
   - Let attendees book for multiple people
   - Shows guest number selector

3. **Max Guests Per Booking**
   - Default: 10
   - Maximum number of guests one person can register
   - Only shown if "Allow Multiple Guests" is enabled

4. **Show Special Requirements Field**
   - Default: No
   - Add a field for dietary/accessibility needs

#### **Custom Fields**

Add unlimited custom fields to the booking form:

- **Field Types:**
  - Text Input
  - Text Area
  - Number
  - Dropdown (with custom options)
  - Checkbox
- **Settings per field:**
  - Field Label
  - Required/Optional
  - Dropdown options (for select fields)

**Example Use Cases:**

- "How did you hear about this event?"
- "T-shirt size" (for events with merchandise)
- "Dietary restrictions"
- "Age group"

#### **Terms & Conditions**

1. **Terms and Conditions**
   - Rich text editor for terms
   - Can include links to privacy policy

2. **Require Terms Acceptance**
   - Force users to accept terms before booking
   - Adds checkbox to form

#### **Confirmation Settings**

1. **Button Text**
   - Default: "Book Now"
   - Customize submit button text

2. **Confirmation Message**
   - Rich text message shown after successful booking
   - Can include next steps, what to expect, etc.

3. **Send Confirmation Email**
   - Default: Yes
   - Toggle automatic confirmation emails

4. **Confirmation Email Template**
   - Rich text email template
   - **Available Placeholders:**
     - `{{name}}` - Attendee's full name
     - `{{event}}` - Event title
     - `{{date}}` - Event date
     - `{{confirmationCode}}` - Unique booking code

   **Example Template:**

   ```
   Dear {{name}},

   Thank you for registering for {{event}}!

   Event Details:
   Date: {{date}}

   Your confirmation code is: {{confirmationCode}}

   Please keep this email for your records.

   JazakAllah Khair,
   Masjid Al-Falah Team
   ```

---

## 🎨 Frontend Implementation Guide

### Booking Form Display

Based on the uploaded image, the booking form should include:

```typescript
// Fetch event data
const event = await payload.findByID({
  collection: 'events',
  id: eventId,
});

// Check if registration is enabled
if (event.registration?.enableRegistration) {
  const formSettings = event.registration.bookingFormSettings;

  // Render booking form with:
  // - Form title (formSettings.formTitle)
  // - Form description (formSettings.formDescription)
  // - Full Name field (required)
  // - Email field (required)
  // - Phone Number field (conditional on formSettings.requirePhoneNumber)
  // - Number of Guests selector (conditional on formSettings.allowMultipleGuests)
  // - Custom fields (formSettings.customFields)
  // - Special requirements (conditional on formSettings.showSpecialRequirements)
  // - Terms checkbox (conditional on formSettings.requireTermsAcceptance)
  // - Submit button (formSettings.buttonText)
}
```

### Creating a Booking

```typescript
// API endpoint to create booking
async function createBooking(formData) {
  const booking = await payload.create({
    collection: 'event-bookings',
    data: {
      event: eventId,
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      numberOfGuests: formData.numberOfGuests,
      specialRequirements: formData.specialRequirements,
      status: 'pending',
      source: {
        referrer: document.referrer,
        device: getDeviceType(),
        ipAddress: await getClientIP(),
      },
    },
  });

  // Update event registration count
  await payload.update({
    collection: 'events',
    id: eventId,
    data: {
      'registration.currentRegistrations':
        event.registration.currentRegistrations + formData.numberOfGuests,
    },
  });

  // Send confirmation email if enabled
  if (event.registration.bookingFormSettings.sendConfirmationEmail) {
    await sendConfirmationEmail(booking, event);
  }

  return booking;
}
```

### Checking Availability

```typescript
function isEventFull(event) {
  const { maxAttendees, currentRegistrations } = event.registration;

  if (!maxAttendees) return false; // Unlimited

  return currentRegistrations >= maxAttendees;
}

function getAvailableSpots(event) {
  const { maxAttendees, currentRegistrations } = event.registration;

  if (!maxAttendees) return Infinity;

  return Math.max(0, maxAttendees - currentRegistrations);
}
```

---

## 📊 Admin Workflows

### Managing Bookings

1. **View All Bookings**
   - Navigate to Collections → Event Bookings
   - Filter by event, status, date
   - Export to CSV for reporting

2. **Confirm a Booking**
   - Open booking record
   - Change status to "Confirmed"
   - Optionally send confirmation email

3. **Track Attendance**
   - On event day, search by confirmation code
   - Mark as "Attended" or "No Show"

4. **Handle Cancellations**
   - Change status to "Cancelled"
   - Decrease event's currentRegistrations count
   - Send cancellation email

5. **View Communication History**
   - See all emails sent to attendee
   - Add manual communication logs

### Reports & Analytics

Access booking data for:

- Total registrations per event
- Attendance rates
- Popular events
- Booking sources
- Payment tracking (for paid events)

---

## 🔔 Email Notifications

### Automatic Emails

1. **Confirmation Email** - Sent immediately after booking
2. **Reminder Email** - Can be sent before event (manual/scheduled)
3. **Update Email** - For event changes
4. **Cancellation Email** - If event is cancelled

### Email Template Variables

- `{{name}}` - Attendee name
- `{{event}}` - Event title
- `{{date}}` - Event date/time
- `{{confirmationCode}}` - Booking confirmation code
- `{{venue}}` - Event venue
- `{{numberOfGuests}}` - Number of guests

---

## ✅ Benefits

### For Admins

✅ **Centralized Management** - All bookings in one place  
✅ **Flexible Forms** - Customize per event  
✅ **Attendance Tracking** - Know who attended  
✅ **Communication Log** - Track all emails sent  
✅ **Payment Tracking** - For paid events  
✅ **Capacity Management** - Prevent overbooking

### For Attendees

✅ **Easy Registration** - Simple booking form  
✅ **Instant Confirmation** - Automatic confirmation email  
✅ **Confirmation Code** - Easy check-in  
✅ **Multiple Guests** - Book for family/friends  
✅ **Special Needs** - Specify requirements

---

## 🚀 Next Steps

### Frontend Implementation

1. Create booking form component
2. Implement form validation
3. Add API endpoint for booking creation
4. Create confirmation page
5. Implement email sending service
6. Add booking management dashboard for users

### Optional Enhancements

- SMS notifications
- QR code generation for check-in
- Waiting list for full events
- Recurring event bookings
- Group booking discounts
- Integration with calendar apps (Google Calendar, iCal)

---

## Example: Complete Booking Flow

### 1. User Views Event

```
Event Page → Shows "Book a place" section
```

### 2. User Fills Form

```
- Full Name: Ahmed Khan
- Email: ahmed@example.com
- Phone: +44 7123 456789
- Guests: 3
```

### 3. Form Submitted

```
✓ Validation passes
✓ Check availability (3 spots available)
✓ Create booking record
✓ Generate confirmation code: EVT-1706298765432-A7X9K2M
✓ Update event registration count (+3)
✓ Send confirmation email
```

### 4. Confirmation Shown

```
"Thank you for booking!
Your confirmation code is: EVT-1706298765432-A7X9K2M
Check your email for details."
```

### 5. Admin Receives Notification

```
New booking for "Quran: A Path to Paradise"
- Ahmed Khan
- 3 guests
- Status: Pending
```

### 6. Event Day

```
Admin searches: EVT-1706298765432-A7X9K2M
Marks as: Attended ✓
```

---

## Database Schema

### EventBookings Collection

```typescript
{
  id: string;
  event: Event; // Relationship
  fullName: string;
  email: string;
  phoneNumber: string;
  numberOfGuests: number;
  specialRequirements?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended' | 'no-show';
  confirmationSent: boolean;
  confirmationCode: string; // Auto-generated
  payment: {
    isPaid: boolean;
    amount?: number;
    paymentMethod?: string;
    transactionId?: string;
    paymentDate?: Date;
  };
  communications: Array<{
    type: string;
    sentAt: Date;
    subject?: string;
    notes?: string;
  }>;
  adminNotes?: string;
  source: {
    referrer?: string;
    device?: 'desktop' | 'mobile' | 'tablet';
    ipAddress?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

This comprehensive booking system provides everything needed to manage event registrations efficiently! 🎉
