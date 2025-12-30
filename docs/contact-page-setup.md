# Contact Page Components - Image Requirements

## Required Images

To complete the Contact Us page, please add the following images to your project:

### 1. Brothers Entrance Image
- **Path**: `/public/assets/contact/brothers-entrance.jpg`
- **Recommended dimensions**: 1200x400px (or similar 3:1 aspect ratio)
- **Content**: Photo of the brothers' entrance to the mosque (similar to the reference image showing the mosque corridor/archway)

### 2. Sisters Entrance Image
- **Path**: `/public/assets/contact/sisters-entrance.jpg`
- **Recommended dimensions**: 1200x400px (or similar 3:1 aspect ratio)
- **Content**: Photo of the sisters' entrance to the mosque

## WhatsApp Group Links

Update the WhatsApp group links in the components:

### Brothers Entrance
- **File**: `/app/components/contact/BrothersEntrance.tsx`
- **Line**: Find `href="https://chat.whatsapp.com/your-group-link"`
- **Replace with**: Your actual WhatsApp group invite link

### Sisters Entrance
- **File**: `/app/components/contact/SistersEntrance.tsx`
- **Line**: Find `href="https://chat.whatsapp.com/your-sisters-group-link"`
- **Replace with**: Your actual WhatsApp group invite link

## Component Features

All components are now pixel-perfect replicas with:

✅ **ContactInformation Component**
- Two-column layout (contact details + map)
- Phone and email buttons with icons
- Embedded OpenStreetMap showing mosque location
- Fully responsive (stacks on mobile)

✅ **BrothersEntrance Component**
- Full-width hero image
- "Brothers Entrance" heading with exact typography
- ADDRESS label and address block
- Blue "Get Directions" button with map icon
- Gray "Join Al-Falah Sisters Group" button with WhatsApp icon
- Fully responsive

✅ **SistersEntrance Component**
- Identical structure to BrothersEntrance
- Separate WhatsApp group link for sisters

## Next Steps

1. Add the entrance images to `/public/assets/contact/`
2. Update WhatsApp group links in both entrance components
3. Test the page responsiveness on different screen sizes
4. Verify all links work correctly
