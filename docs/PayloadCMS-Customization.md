# Payload CMS Theme & Styling Customization Guide

## Overview

This guide explains how to customize the Payload CMS admin panel to match your Masjid Al-Falah branding.

---

## 🎨 **Current Customizations Applied**

### ✅ **1. Custom Branding (payload.config.ts)**

```typescript
admin: {
  meta: {
    titleSuffix: '- Masjid Al-Falah CMS',
    favicon: '/assets/header/logo.svg',
    ogImage: '/assets/hero/banner-1.jpg',
  },
}
```

**Features:**

- Custom browser tab title
- Custom favicon
- Social media preview image

---

### ✅ **2. Custom CSS Styling (custom.scss)**

**Location**: `/app/(payload)/custom.scss`

**What's Customized:**

- ✅ Brand colors matching your website (#006fee, #06b7db, #001731)
- ✅ Gradient sidebar background
- ✅ Smooth animations and transitions
- ✅ Rounded corners (modern UI)
- ✅ Hover effects on cards and buttons
- ✅ Custom table styling
- ✅ Enhanced form inputs
- ✅ Upload dropzone styling
- ✅ Login page customization
- ✅ Dashboard widgets
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Accessibility features

**Color Scheme:**

```scss
--color-primary: #006fee; /* Primary Blue */
--color-primary-dark: #0056cc; /* Hover Blue */
--color-accent: #06b7db; /* Accent Blue */
--color-dark: #001731; /* Dark Blue */
```

---

## 🔧 **Additional Customization Options**

### **3. Custom Logo Component**

Create a custom logo to replace the default Payload logo:

**Step 1**: Create logo component:

```tsx
// app/(payload)/components/Logo.tsx
export default function Logo() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <img
        src="/assets/header/logo.svg"
        alt="Masjid Al-Falah"
        style={{ height: '40px', width: 'auto' }}
      />
    </div>
  );
}
```

**Step 2**: Update `payload.config.ts`:

```typescript
admin: {
  components: {
    graphics: {
      Logo: '/app/(payload)/components/Logo',
      Icon: '/app/(payload)/components/Icon',
    },
  },
}
```

---

### **4. Custom Dashboard**

Create a custom dashboard with stats and quick actions:

```tsx
// app/(payload)/components/Dashboard.tsx
export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Welcome to Masjid Al-Falah CMS</h1>
      {/* Your custom dashboard content */}
    </div>
  );
}
```

Then add to config:

```typescript
admin: {
  components: {
    views: {
      Dashboard: '/app/(payload)/components/Dashboard',
    },
  },
}
```

---

### **5. Custom Header Actions**

Add custom buttons to the header:

```typescript
admin: {
  components: {
    actions: ['/app/(payload)/components/CustomAction'],
  },
}
```

---

### **6. Dark Mode Support**

Payload CMS v3 has built-in dark mode. Customize it:

```scss
// In custom.scss
[data-theme='dark'] {
  --color-primary: #3b82f6;
  --background: #111827;
  /* Add more dark mode variables */
}
```

---

### **7. Custom Field Components**

Create custom input components for specific fields:

```tsx
// collections/Banners.ts
{
  name: 'customField',
  type: 'text',
  admin: {
    components: {
      Field: '/app/(payload)/components/CustomField',
    },
  },
}
```

---

### **8. Custom Collection Icons**

Add icons to collection navigation:

```typescript
// collections/Events.ts
export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    // Custom icon (React Icons or SVG)
    // Requires creating a custom component
  },
};
```

---

## 📁 **File Structure for Customization**

```
app/
└── (payload)/
    ├── custom.scss              ← Main styling file
    ├── layout.tsx               ← Imports custom.scss
    └── components/              ← Custom components (create this)
        ├── Logo.tsx
        ├── Icon.tsx
        ├── Dashboard.tsx
        └── CustomField.tsx
```

---

## 🎨 **CSS Variables You Can Customize**

### **Colors**

```scss
:root {
  --color-primary: #006fee;
  --color-primary-dark: #0056cc;
  --color-accent: #06b7db;
  --color-dark: #001731;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #f31260;
}
```

### **Spacing**

```scss
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

### **Typography**

```scss
:root {
  --font-family: 'Inter', -apple-system, sans-serif;
  --font-size-sm: 13px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
}
```

### **Border Radius**

```scss
:root {
  --border-radius-sm: 6px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
}
```

---

## 🚀 **Quick Style Updates**

### **Change Primary Color**

Edit in `custom.scss`:

```scss
:root {
  --color-primary: #YOUR_COLOR;
}
```

### **Change Sidebar Background**

```scss
.nav {
  background: linear-gradient(180deg, #YOUR_START, #YOUR_END) !important;
}
```

### **Change Card Hover Effects**

```scss
.dashboard__card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}
```

---

## 🔍 **Testing Your Customizations**

1. **Save changes** to `custom.scss` or `payload.config.ts`
2. **Reload the admin panel** (Ctrl/Cmd + R)
3. **Check different pages**:
   - Dashboard
   - Collection list views
   - Edit/create forms
   - Login page

---

## 📚 **Full Customization Capabilities**

| Feature        | Customizable | How                            |
| -------------- | ------------ | ------------------------------ |
| **Colors**     | ✅ Yes       | CSS variables in custom.scss   |
| **Logo**       | ✅ Yes       | Custom component + config      |
| **Favicon**    | ✅ Yes       | meta.favicon in config         |
| **Typography** | ✅ Yes       | CSS font families              |
| **Spacing**    | ✅ Yes       | CSS variables                  |
| **Layout**     | ✅ Yes       | Custom dashboard component     |
| **Navigation** | ✅ Yes       | Collection config + CSS        |
| **Login Page** | ✅ Yes       | CSS styling + beforeLogin hook |
| **Dashboard**  | ✅ Yes       | Custom component               |
| **Forms**      | ✅ Yes       | Custom field components        |
| **Tables**     | ✅ Yes       | CSS styling                    |
| **Buttons**    | ✅ Yes       | CSS styling                    |
| **Animations** | ✅ Yes       | CSS keyframes                  |
| **Dark Mode**  | ✅ Yes       | CSS for [data-theme='dark']    |
| **Responsive** | ✅ Yes       | Media queries in CSS           |

---

## 💡 **Pro Tips**

1. **Browser DevTools**: Use Chrome/Firefox DevTools to inspect Payload classes and test styles live
2. **Gradual Changes**: Test one change at a time
3. **CSS Specificity**: Use `!important` sparingly, prefer more specific selectors
4. **Backup**: Keep a copy of your custom.scss before major changes
5. **Performance**: Avoid heavy animations on large tables
6. **Accessibility**: Always maintain sufficient color contrast
7. **Mobile First**: Test on mobile devices

---

## 🔗 **Official Resources**

- [Payload CMS Docs - Admin Configuration](https://payloadcms.com/docs/admin/overview)
- [Custom Components](https://payloadcms.com/docs/admin/components)
- [Theming Guide](https://payloadcms.com/docs/admin/theming)

---

## 🎯 **Next Steps**

1. ✅ Custom colors applied
2. ✅ Custom branding added
3. ✅ Comprehensive SCSS created
4. ⏳ Create custom logo component (optional)
5. ⏳ Build custom dashboard (optional)
6. ⏳ Add collection icons (optional)

---

## 📝 **Example: Complete Custom Config**

```typescript
export default buildConfig({
  admin: {
    user: Users.slug,

    // Meta
    meta: {
      titleSuffix: '- Masjid Al-Falah CMS',
      favicon: '/assets/header/logo.svg',
      ogImage: '/assets/hero/banner-1.jpg',
    },

    // Custom Components
    components: {
      graphics: {
        Logo: '/app/(payload)/components/Logo',
        Icon: '/app/(payload)/components/Icon',
      },
      views: {
        Dashboard: '/app/(payload)/components/Dashboard',
      },
      actions: ['/app/(payload)/components/QuickActions'],
    },

    // Import Map
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // ... rest of config
});
```

---

Your Payload admin panel is now **fully customized** with Masjid Al-Falah branding! 🎉
