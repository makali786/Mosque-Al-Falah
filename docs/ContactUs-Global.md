# Contact Us Page - Payload CMS Global Documentation

## 📊 **Overview**

The Contact Us page is managed through a single comprehensive global: **ContactPage**

**Location**: `globals/ContactPage.ts`

---

## 🎯 **All Sections Managed**

### **1. Hero Section**

- Page title ("Contact Us")
- Background image
- Breadcrumb navigation

---

### **2. Main Contact Information**

✅ Section title  
✅ Description text  
✅ Main address:

- Location name ("Masjid Al-Falah")
- Address line 1 ("North Ilford Islamic Centre")
- Address line 2 ("97 Kensington Gardens, Ilford, Essex, IG1 3EN")

✅ Phone number (020 8518 5868)  
✅ Email address (info@masjid-alfalah.org.uk)  
✅ Google Maps embed/coordinates  
✅ Show/hide map toggle

---

### **3. Brothers Entrance**

✅ Enable/disable section  
✅ Section title  
✅ Entrance photo (arched corridor)  
✅ Address:

- North Ilford Islamic Centre
- 97 Kensington Gardens, Ilford, Essex, IG1 3EN

✅ **Get Directions** button (Google Maps link)  
✅ **WhatsApp Group** button:

- Enable/disable toggle
- Custom button text
- WhatsApp group invite link

---

### **4. Sisters Entrance**

✅ Enable/disable section  
✅ Section title  
✅ Entrance photo (3 doors)  
✅ Address:

- North Ilford Islamic Centre
- 170 Wanstead Park Rd, Ilford, Essex, IG1 3TP

✅ **Get Directions** button (Google Maps link)  
✅ **WhatsApp Group** button:

- Enable/disable toggle
- Custom button text ("Join Al-Falah Sisters Group")
- WhatsApp group invite link

---

### **5. Parking Notice Section**

✅ Enable/disable section  
✅ Notice title ("Please Do Not Park Irresponsibly")  
✅ Rich text message  
✅ **Supporting Hadith Quote**:

- Show/hide toggle
- Quote text
- Source attribution (e.g., "Bukhari & Muslim")

✅ Background color options:

- Blue
- Red
- Orange

**Example Content**:

> "Please DO NOT block any exits, driveways, Junctions or cause any other inconvenience to our neighbours when attending the Masjid"

**Example Hadith**:

> "He Will not enter Jannah Whose neighbour is not secure from his wrongful conduct."  
> — Bukhari & Muslim

---

### **6. Ask a Question Form**

✅ Enable/disable section  
✅ Section title ("Ask a Question")  
✅ Description text  
✅ Form image (person reading Quran)

#### **Form Fields**:

- **Name\*** (required)
- **E-Mail\*** (required)
- **Select Topic** (dropdown)
- **Your Message** (textarea)
- **Submit button** (customizable text)

#### **Form Settings**:

✅ Custom field labels  
✅ Topic dropdown options (configurable)  
✅ Recipient email (where submissions go)  
✅ Success message

**Example Topics**:

- General Inquiry
- Prayer Times
- Events
- Services
- Marriage Services
- Donations
- Educational Programs

---

### **7. Bottom Quote Section**

✅ Enable/disable section  
✅ Quote text (Hadith/inspirational)  
✅ Author attribution  
✅ Show Share button (toggle)  
✅ Show Donate button (toggle)  
✅ Donate button URL

**Example Quote**:

> "Whoever guides someone to goodness will have a reward like the one who did it."  
> — Prophet Muhammad ﷺ

---

### **8. Additional Contact Methods**

#### **Emergency Contact**:

✅ Show/hide toggle  
✅ Emergency phone number  
✅ Availability hours (e.g., "24/7" or "9 AM - 5 PM")

#### **Social Media Links**:

✅ Facebook page URL  
✅ Twitter/X handle  
✅ Instagram handle  
✅ YouTube channel URL

---

### **9. Operating Hours** (Optional)

✅ Show/hide section  
✅ Section title  
✅ Weekday hours  
✅ Weekend hours  
✅ Special notes (rich text)

**Example**:

- Monday - Friday: 5:00 AM - 10:00 PM
- Saturday - Sunday: 5:00 AM - 11:00 PM
- Special Ramadan hours available

---

### **10. SEO Settings**

✅ Meta title  
✅ Meta description  
✅ Social share image (OG image)

---

## 🎨 **Page Structure**

```
┌─────────────────────────────────────┐
│ HERO                                │
│ • Background image                  │
│ • "Contact Us" title                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ CONTACT INFORMATION                 │
│ • Description                       │
│ • Address                           │
│ • Phone: 020 8518 5868             │
│ • Email: info@...                   │
│ • [MAP]                            │
└─────────────────────────────────────┘

┌──────────────────┬──────────────────┐
│ BROTHERS         │ SISTERS          │
│ ENTRANCE         │ ENTRANCE         │
│ [Photo]          │ [Photo]          │
│ Address          │ Address          │
│ [Get Directions] │ [Get Directions] │
│ [WhatsApp Group] │ [WhatsApp Group] │
└──────────────────┴──────────────────┘

┌─────────────────────────────────────┐
│ PARKING NOTICE (Blue Background)    │
│ • Title                             │
│ •  Message                           │
│ • [Quote Box with Hadith]           │
└─────────────────────────────────────┘

┌──────────────────┬──────────────────┐
│ [Form Image]     │ ASK A QUESTION   │
│                  │ Name: _________  │
│ Person reading   │ Email: ________  │
│ Quran            │ Topic: [v]       │
│                  │ Message:         │
│                  │ ___________      │
│                  │ [Send Message]   │
└──────────────────┴──────────────────┘

┌─────────────────────────────────────┐
│ QUOTE                               │
│ "Whoever guides someone..."         │
│ — Prophet Muhammad ﷺ               │
│ [Share] [Donate Now]                │
└─────────────────────────────────────┘
```

---

## 🚀 **How to Use**

### **Edit Contact Page**:

```
Admin Panel → Globals → Contact Us Page
```

### **Update Main Contact Info**:

1. Go to "Main Contact Information" section
2. Edit address, phone, email
3. Update map embed code
4. Save

### **Update Entrances**:

1. Go to "Brothers Entrance" or "Sisters Entrance"
2. Upload entrance photo
3. Set address
4. Add Google Maps link
5. Add WhatsApp group invite link
6. Save

### **Update Form**:

1. Go to "Ask a Question Form"
2. Update form labels
3. Add/remove topic options
4. Set recipient email
5. Save

---

## 📱 **Frontend API Call**

```typescript
// Fetch Contact Page data
const contactPage = await fetch('/api/globals/contact-page').then(r =>
  r.json()
);

// Access sections:
contactPage.contactInfo.mainAddress;
contactPage.brothersEntrance.googleMapsLink;
contactPage.sistersEntrance.whatsappGroup.groupLink;
contactPage.parkingNotice.hadithQuote;
contactPage.contactForm.topicOptions;
```

---

## ✅ **All Features Included**

### **✅ Multi-Location Support**:

- Main address with map
- Brothers entrance with directions
- Sisters entrance with directions
- Each with separate WhatsApp groups

### **✅ Contact Form**:

- Customizable fields
- Topic dropdown
- Email submissions
- Success messages

### **✅ Community Features**:

- WhatsApp group integration
- Parking etiquette notice
- Hadith quotes
- Social media links

### **✅ Flexibility**:

- Enable/disable any section
- Custom background colors
- Custom button text
- Operating hours (optional)
- Emergency contact (optional)

---

Your Contact Us page is now **fully manageable** through Payload CMS! 🎉
