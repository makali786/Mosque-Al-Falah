# Reusable Entrance Section Component

## Overview

I've created a fully reusable `EntranceSection` component that maintains the **exact same styling** as your `BrothersEntrance` component, without changing any of your existing code.

## Component Location

- **Reusable Component**: `/app/components/contact/EntranceSection.tsx`

## Current Usage

### ✅ BrothersEntrance
- **Status**: Uses original code (unchanged)
- **File**: `/app/components/contact/BrothersEntrance.tsx`
- Contains a comment at the bottom showing how to optionally switch to the reusable component

### ✅ SistersEntrance
- **Status**: Now uses the reusable `EntranceSection` component
- **File**: `/app/components/contact/SistersEntrance.tsx`
- Simplified to just pass props to `EntranceSection`

## EntranceSection Props

```tsx
interface EntranceSectionProps {
  title: string;                    // e.g., "Brothers Entrance"
  imageSrc: string;                 // e.g., "/assets/contact-us/brother-enterence.png"
  imageAlt: string;                 // e.g., "Brothers Entrance - Masjid Al-Falah"
  whatsappGroupLabel: string;       // e.g., "Join Al-Falah Sisters Group"
  directionsUrl?: string;           // Optional, defaults to mosque address
  whatsappUrl?: string;             // Optional, defaults to "#"
}
```

## Example Usage

```tsx
import EntranceSection from "./EntranceSection";

const MyEntrance = () => {
  return (
    <EntranceSection
      title="Brothers Entrance"
      imageSrc="/assets/contact-us/brother-enterence.png"
      imageAlt="Brothers Entrance - Masjid Al-Falah"
      whatsappGroupLabel="Join Al-Falah Brothers Group"
      directionsUrl="https://maps.google.com/?q=97+Kensington+Gardens,+Ilford,+Essex,+IG1+3EN"
      whatsappUrl="https://chat.whatsapp.com/your-group-link"
    />
  );
};
```

## Styling Details (Pixel-Perfect Match)

The `EntranceSection` component uses the **exact same classes** as your `BrothersEntrance`:

- ✅ Image: `w-full h-auto object-cover lg:w-[624px] lg:h-[380px]`
- ✅ Title: `text-3xl md:text-4xl lg:text-5xl font-bold text-black`
- ✅ Address Label: `text-sm md:text-base font-bold text-black uppercase`
- ✅ Address Text: `text-base md:text-lg text-black`
- ✅ Get Directions Button: `bg-[#006FEE33] text-[#006FEE]`
- ✅ WhatsApp Button: `bg-[#D4D4D866]`
- ✅ Button spacing: `gap-3 sm:gap-4`
- ✅ All padding, margins, and responsive breakpoints match exactly

## Benefits

1. **No Code Duplication**: Both entrances share the same component logic
2. **Easy Maintenance**: Update styling in one place
3. **Consistency**: Guaranteed identical styling across all entrance sections
4. **Flexibility**: Easy to add more entrance types (e.g., "Main Entrance", "Side Entrance")
5. **Your Code Unchanged**: `BrothersEntrance.tsx` remains exactly as you wrote it

## Future Additions

To add a new entrance section (e.g., "Main Entrance"):

```tsx
// app/components/contact/MainEntrance.tsx
import EntranceSection from "./EntranceSection";

const MainEntrance = () => {
  return (
    <EntranceSection
      title="Main Entrance"
      imageSrc="/assets/contact-us/main-entrance.png"
      imageAlt="Main Entrance - Masjid Al-Falah"
      whatsappGroupLabel="Join Al-Falah Community"
      whatsappUrl="https://chat.whatsapp.com/your-main-group-link"
    />
  );
};

export default MainEntrance;
```

## Summary

✅ **BrothersEntrance**: Original code preserved (with optional comment)  
✅ **SistersEntrance**: Now uses reusable component  
✅ **EntranceSection**: New reusable component with identical styling  
✅ **Zero visual changes**: Everything looks exactly the same  
✅ **Production ready**: Clean, maintainable, and scalable
