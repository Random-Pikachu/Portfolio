# Animation & Interaction Enhancements

## New Features

### 1. **Filterable Projects Section**
- Added **[ all ]** and **[ featured ]** filter tabs
- Dynamically filters projects based on selection
- Smooth transitions between filter states
- Featured projects highlight your best work

### 2. **GSAP Scroll-Triggered Animations**
The site now uses GSAP's ScrollTrigger plugin for sophisticated animations:

#### Project Cards
- **Fade-in Animation**: Cards fade in and slide up as they enter the viewport
- **Image Parallax**: Images move subtly on scroll for depth perception
- **Staggered Text Reveals**: 
  - Title fades and slides in from left
  - Description fades in
  - Tech stack tags scale in with stagger
  - Action buttons fade in last
- All animations are smooth and performant

#### Section Titles
- Fade in and slide up when scrolled into view
- Creates a sense of hierarchy and flow

#### About Section
- Paragraphs fade in with staggered animation
- Creates a progressive reading experience

### 3. **Parallax Effects**
- Image parallax on project cards (moves at 0.3x scroll speed)
- Creates visual depth and engagement
- Subtle enough not to distract from content

### 4. **Smooth Scroll Navigation**
- Anchor links smoothly scroll to sections
- Works on desktop and mobile menu
- Integrated with Lenis for butter-smooth scrolling

## Technical Implementation

### Dependencies Added
- `gsap@^3.12.2` - Animation library with ScrollTrigger

### New Files
- `/src/hooks/useScrollAnimation.ts` - Custom hooks for animations
  - `useScrollAnimation()` - Basic scroll fade-in
  - `useTextReveal()` - Text line reveals
  - `useParallax()` - Parallax movement
  - `useSplitTextReveal()` - Character-by-character reveals

- `/src/components/ParallaxTitle.tsx` - Reusable parallax title component

### Modified Files
- `/src/components/ProjectCard.tsx` - Added GSAP animations
  - Image parallax effect
  - Staggered text reveals
  - ScrollTrigger integration

- `/src/pages/Home.tsx` - Added filtering system
  - Project filtering by featured/all
  - Enhanced animations throughout
  - Better About section styling

- `/src/components/Navigation.tsx` - Maintained anchor link support

## Usage Examples

### Using Scroll Animations in Components

```tsx
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export function MyComponent() {
  const ref = useScrollAnimation();
  
  return <div ref={ref}>This will fade in on scroll</div>;
}
```

### Using Parallax

```tsx
import { useParallax } from '../hooks/useScrollAnimation';

export function ParallaxImage() {
  const ref = useParallax(0.5); // 0.5 = 50% of scroll speed
  
  return <img ref={ref} src="..." />;
}
```

## Performance Considerations

- **ScrollTrigger Cleanup**: All animations properly clean up triggers on unmount
- **Smooth 60fps**: GSAP's `scrub: 1` ensures smooth parallax without jank
- **Efficient Selectors**: Uses data attributes instead of complex DOM queries
- **Lazy Animations**: Animations only trigger when elements enter viewport

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Consider adding:
- Click-to-expand project details modal
- Horizontal scrolling project showcase
- Category filtering beyond featured/all
- Advanced sorting options
- Project search functionality
