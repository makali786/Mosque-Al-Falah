# ContentImageSection Component

A fully reusable, pixel-perfect component for creating text + image layouts following the Mosque Al-Falah design system.

## Features

✅ **Flexible Layout**: Image on left or right  
✅ **Rich Content Support**: Plain text, JSX, or custom formatting  
✅ **Responsive Design**: Mobile-first with perfect breakpoints  
✅ **Customizable Styling**: Background colors, image styles, spacing  
✅ **TypeScript Support**: Full type safety  
✅ **Pixel-Perfect**: Matches existing design patterns exactly  

---

## Basic Usage

```tsx
import ContentImageSection from "@/app/components/common/ContentImageSection";

export default function YourComponent() {
  return (
    <ContentImageSection
      heading="Your Section Title"
      imageSrc="/path/to/image.jpg"
      imageAlt="Description of image"
      content={
        <p>
          Your content here. Use <strong>bold text</strong> for emphasis.
        </p>
      }
    />
  );
}
```

---

## Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `heading` | `string` | ✅ Yes | - | Main section heading |
| `content` | `ReactNode` | ✅ Yes | - | Content to display (text, JSX, etc.) |
| `imageSrc` | `string` | ✅ Yes | - | Path to the image |
| `imageAlt` | `string` | ✅ Yes | - | Alt text for accessibility |
| `layout` | `"image-right"` \| `"image-left"` | ❌ No | `"image-right"` | Image position |
| `backgroundColor` | `string` | ❌ No | `"#ffffff"` | Section background color |
| `className` | `string` | ❌ No | `""` | Additional CSS classes |
| `imageStyle` | `"rounded"` \| `"square"` | ❌ No | `"rounded"` | Image border style |

---

## Examples

### 1. Simple Text Content

```tsx
<ContentImageSection
  heading="Welcome to Our Mosque"
  imageSrc="/assets/mosque-exterior.jpg"
  imageAlt="Mosque exterior view"
  content={
    <p>
      We are a vibrant Islamic community center serving the local area
      since 1996.
    </p>
  }
/>
```

### 2. Multiple Paragraphs with Bold Highlights

```tsx
<ContentImageSection
  heading="Our History"
  imageSrc="/assets/about-us/mosque-history.jpg"
  imageAlt="Masjid Al-Falah"
  content={
    <>
      <p>
        In <strong>1996</strong>, a building at{" "}
        <strong>97 Empress Avenue, Ilford</strong> was purchased by
        dedicated Muslims to establish a Masjid.
      </p>
      <p>
        In <strong>2007</strong>, they secured a purpose-built property
        at <strong>97 Kensington Gardens</strong>.
      </p>
    </>
  }
/>
```

### 3. Image on Left Side

```tsx
<ContentImageSection
  heading="Our Mission"
  imageSrc="/assets/mission.jpg"
  imageAlt="Community gathering"
  layout="image-left"
  content={
    <p>
      To serve the Muslim community through education, worship, and
      social support.
    </p>
  }
/>
```

### 4. Custom Background Color

```tsx
<ContentImageSection
  heading="Community Services"
  imageSrc="/assets/services.jpg"
  imageAlt="Community services"
  backgroundColor="#f4f4f5"
  content={
    <p>
      We offer a wide range of services including education, food bank,
      and youth programs.
    </p>
  }
/>
```

### 5. Square Image Style

```tsx
<ContentImageSection
  heading="Our Facilities"
  imageSrc="/assets/facilities.jpg"
  imageAlt="Prayer hall"
  imageStyle="square"
  content={
    <p>
      Our state-of-the-art facilities include a main prayer hall,
      classrooms, and community spaces.
    </p>
  }
/>
```

### 6. Rich Content with Lists

```tsx
<ContentImageSection
  heading="What We Offer"
  imageSrc="/assets/programs.jpg"
  imageAlt="Educational programs"
  content={
    <>
      <p>
        Our mosque provides comprehensive services for the entire family:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Five daily prayers</li>
        <li>Friday Jumu'ah sermons</li>
        <li>Islamic education for children</li>
        <li>Youth activities and programs</li>
      </ul>
    </>
  }
/>
```

### 7. Multiple Sections on Same Page

```tsx
export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Us"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about-us" },
        ]}
        backgroundImage="/assets/hero/about-us.jpg"
      />

      {/* Section 1: Our History */}
      <ContentImageSection
        heading="Our History"
        imageSrc="/assets/about-us/history.jpg"
        imageAlt="Historical photo"
        layout="image-right"
        content={<p>Founded in 1996...</p>}
      />

      {/* Section 2: Our Mission */}
      <ContentImageSection
        heading="Our Mission"
        imageSrc="/assets/about-us/mission.jpg"
        imageAlt="Mission statement"
        layout="image-left"
        backgroundColor="#f9fafb"
        content={<p>To serve the community...</p>}
      />

      {/* Section 3: Our Vision */}
      <ContentImageSection
        heading="Our Vision"
        imageSrc="/assets/about-us/vision.jpg"
        imageAlt="Vision for the future"
        layout="image-right"
        content={<p>Building a stronger community...</p>}
      />
    </>
  );
}
```

---

## Responsive Breakpoints

The component automatically adjusts across these breakpoints:

| Breakpoint | Screen Size | Heading Size | Text Size | Padding |
|------------|-------------|--------------|-----------|---------|
| Mobile | < 640px | 2xl (32px) | sm (14px) | 16px |
| SM | 640px+ | 3xl (30px) | base (16px) | 24px |
| MD | 768px+ | 4xl (36px) | base (16px) | 32px |
| LG | 1024px+ | 5xl (48px) | lg (18px) | 48px |
| XL | 1280px+ | 5xl (48px) | lg (18px) | 200px |

---

## Styling Guidelines

### Text Formatting

- Use `<strong>` for bold text (e.g., years, locations, names)
- Use `<em>` for italic text
- Use `<p>` tags for paragraphs (automatic spacing applied)
- Use `<ul>` or `<ol>` for lists

### Color Palette

- **Heading**: `#18181b` (dark gray)
- **Body Text**: `#3f3f46` (medium gray)
- **Background**: `#ffffff` (white) or `#f4f4f5` (light gray)

### Image Guidelines

- **Aspect Ratio**: 4:3 (automatically applied)
- **Recommended Size**: At least 800x600px
- **Format**: JPG or PNG
- **Optimization**: Use Next.js Image optimization

---

## Best Practices

1. **Keep headings concise**: 2-5 words for maximum impact
2. **Use bold sparingly**: Only for key information (dates, names, locations)
3. **Alternate layouts**: Use `image-left` and `image-right` alternately for visual variety
4. **Consistent spacing**: Let the component handle spacing automatically
5. **Accessibility**: Always provide meaningful `imageAlt` text
6. **Content length**: 2-4 paragraphs per section for optimal readability

---

## Complete Example: About Us Page

```tsx
import PageHero from "@/app/components/common/PageHero";
import ContentImageSection from "@/app/components/common/ContentImageSection";

export default function AboutUsPage() {
  return (
    <>
      <PageHero
        title="About Us"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about-us" },
        ]}
        backgroundImage="/assets/hero/about-us.jpg"
      />

      <ContentImageSection
        heading="Our History"
        imageSrc="/assets/about-us/mosque-history.jpg"
        imageAlt="Masjid Al-Falah"
        layout="image-right"
        content={
          <>
            <p>
              In <strong>1996</strong>, a building at{" "}
              <strong>97 Empress Avenue, Ilford</strong> was purchased by
              a few dedicated Muslims to establish a Masjid for the local
              community.
            </p>
            <p>
              Undeterred, the founders sought a new location.{" "}
              <strong>Alhamdulillah, in 2007</strong>, they secured a
              purpose-built property at <strong>97 Kensington Gardens</strong>.
            </p>
          </>
        }
      />

      <ContentImageSection
        heading="Our Mission"
        imageSrc="/assets/about-us/mission.jpg"
        imageAlt="Community prayer"
        layout="image-left"
        backgroundColor="#f9fafb"
        content={
          <p>
            To serve the Muslim community through worship, education, and
            social support, fostering a strong connection to Islamic values.
          </p>
        }
      />
    </>
  );
}
```

---

## Notes

- The component uses the same design tokens as other components (spacing, typography, colors)
- Images are automatically optimized by Next.js
- The component is fully accessible with proper semantic HTML
- Responsive design works seamlessly across all devices
