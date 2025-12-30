# About Us Page - Payload CMS Collections & Global Documentation

## 📊 **Collections Overview**

The About Us page uses these key parts:

1. **AboutPage Global** - All page content sections
2. **CoreValues Collection** - FAQ accordion
3. **Committees Collection** - Team member cards

---

## 🌍 **AboutPage Global**

**Location**: `globals/AboutPage.ts`

### **All Sections**:

1. **Hero** - Page title, background image, breadcrumb
2. **Our History** - Timeline, content, image
3. **Our Mission** - Mission points, image
4. **Core Values** - Section settings
5. **Committees** - Section settings
6. **Connect with Us** - Message, CTAs, image
7. **Quote** - Inspirational quote section

---

## ❓ **CoreValues Collection** (FAQ Accordion)

**Slug**: `core-values`

### Fields:

- `question` - FAQ question
- `answer` - Rich text answer
- `category` - Question grouping
- `order` - Display order
- `isActive` - Show/hide

### Example Questions:

- "What is the Masjid Al-Falah (MAF)?"
- "How is MAF Organised?"
- "How was MCB Founded?"
- "How is the MCB Funded?"
- "How Do You Relate to ordinary British Muslim individuals?"

---

## 👥 **Committees Collection** (Team Members)

**Slug**: `committees`

### Team Member Card Features:

#### **Basic Info**:

- Full name
- Role/Position (Chairman, Vice Chair, etc.)
- Committee type
- Profile photo
- Short bio
- Full biography

#### **Contact Buttons**:

- ✅ WhatsApp contact (with phone number)
- ✅ Email contact
- 📞 Alternative phone

#### **Additional**:

- Specializations
- Qualifications
- Joined date
- Social links (LinkedIn, Twitter, Website)
- Display order

### Example Team Members:

1. Muhammad Ashraf - Chairman
2. Imtiaz AbuBaker - Vice Chair
3. Ismail Parekh - Secretary
4. Iqbal Shaikh - Coordinator
5. Abudur Rahman Patel - Mawlana & Imam
6. Mawlana Farooq Suleman - Imam
7. Adil Muhammad Yusuf - Qari & Imam

---

## 🎨 **How It Works Together**

### **About Us Page Structure**:

```
┌─────────────────────────────────────┐
│ HERO (Global)                       │
│ • Background image                  │
│ • "About Us" title                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ OUR HISTORY (Global)                │
│ • Timeline entries                  │
│ • Rich text content                 │
│ • Feature image                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ OUR MISSION (Global)                │
│ • Mission statement                 │
│ •  Inspiring faith                   │
│ • 📚 Educating                       │
│ • ❤️ Fostering well-being           │
│ • 🤝 Serving                         │
│ • ☮️ Promoting                       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ OUR CORE VALUES (Collection)        │
│ • FAQ Accordion                     │
│ • Questions with rich text answers  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ MEET OUR COMMITTEES (Collection)    │
│ • Grid of team member cards         │
│ • [Photo] [Name] [Role]            │
│ • [Bio] [WhatsApp] [Email]         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ CONNECT WITH US (Global)            │
│ • Image + message                   │
│ • "Contact Us" button               │
│ • "Join Our Community" button       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ QUOTE SECTION (Global)              │
│ • Hadith/inspirational quote        │
│ • Share + Donate buttons            │
└─────────────────────────────────────┘
```

---

## 🚀 **Usage Guide**

### **To Update Page Content**:

1. Go to **Globals > About Us Page** in admin
2. Edit sections as needed
3. Save

### **To Add FAQ Questions**:

1. Go to **Collections > Core Values**
2. Create new entry
3. Set question, answer, order
4. Publish

### **To Add Team Members**:

1. Go to **Collections > Committees**
2. Create new member
3. Upload photo
4. Add contact details (WhatsApp, Email)
5. Set display order
6. Publish

---

## 📱 **Frontend Integration**

### **Fetch About Page**:

```typescript
const aboutPage = await fetch('/api/globals/about-page').then(r => r.json());

// Access sections:
aboutPage.hero.backgroundImage;
aboutPage.history.timeline;
aboutPage.mission.missionPoints;
aboutPage.connect.primaryButton;
```

### **Fetch Core Values**:

```typescript
const coreValues = await fetch('/api/core-values?sort=order').then(r =>
  r.json()
);
// Display as FAQ accordion
```

### **Fetch Committee Members**:

```typescript
const committees = await fetch(
  '/api/committees?where[isActive][equals]=true&sort=order'
).then(r => r.json());
// Display as team member grid
```

---

## ✅ **All Features Included**

### **✅ AboutPage Global**:

- Hero with custom background
- Timeline-based history
- Mission with bullet points
- Configurable section visibility
- Custom CTAs
- SEO settings

### **✅ CoreValues Collection**:

- Question/Answer pairs
- Category grouping
- Rich text answers
- Ordering
- Active/inactive toggle

### **✅ Committees Collection**:

- Profile photos
- Multiple roles
- WhatsApp integration
- Email integration
- Specializations
- Social media links
- Featured members
- Team grouping

---

Your About Us page is now **fully manageable** through Payload CMS! 🎉
