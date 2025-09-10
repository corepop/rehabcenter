## Brief overview
Guidelines for implementing responsive design patterns with a mobile-first approach, ensuring optimal user experience across all device sizes.

## Mobile-first development
- Always design and implement components starting with mobile layouts first
- Use responsive breakpoints that progressively enhance the layout for larger screens
- Test mobile layouts before implementing desktop-specific features

## Responsive utilities
- Prefer Tailwind's responsive prefixes (sm:, md:, lg:, xl:) for progressive enhancement
- Use flexbox and grid layouts that adapt naturally to different screen sizes
- Implement responsive spacing and typography that scales appropriately

## Layout patterns
- Start with single-column layouts for mobile, then expand to multi-column on larger screens
- Use justify-center for horizontal centering on desktop while maintaining mobile-friendly stacking
- Ensure touch targets meet minimum size requirements on mobile devices

## Testing approach
- Verify mobile layouts work correctly before adding desktop enhancements
- Test intermediate breakpoints (tablet sizes) to ensure smooth transitions
- Validate that responsive changes don't break existing functionality
