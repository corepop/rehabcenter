# Page Load Speed Optimization Guide for Enköpings Rehabcenter

## Animation Control System 🎨

This website includes several animation systems that can be controlled for performance or accessibility reasons.

### Animation Types Currently Active:

1. **Fade-in animations**: Elements animate in when scrolled into view (using `animate-fade` class)
2. **View transitions**: Smooth page transitions between routes (Astro ClientRouter)
3. **Intersection Observer animations**: Staggered element reveals on scroll
4. **CSS transitions**: Hover and interaction transitions

### Quick Disable/Enable Guide:

#### To Disable Animations:

1. **View Transitions** (`src/layouts/Layout.astro`):
   ```typescript
   // Remove or comment out:
   import { ClientRouter } from 'astro:transitions';
   <ClientRouter fallback="swap" />
   ```

2. **Tailwind Animations** (`tailwind.config.js`):
   ```javascript
   // Comment out the animation section:
   animation: {
     fade: 'fadeInUp 1s both',
   },
   ```

3. **Intersection Observer Animations** (`src/components/common/BasicScripts.astro`):
   ```javascript
   // Comment out these lines:
   // Observer.start();
   // Inside astro:after-swap event: Observer.start();
   ```

#### To Enable Animations:

Simply uncomment the relevant sections mentioned above in reverse order.

### Global Animation Override (Optional):

Add to `src/assets/styles/tailwind.css` for permanent disable:

```css
/* Disable all animations globally */
*, *::before, *::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}
```

### Animation Classes Used:

- `intersect-once intersect-quarter`: Triggers animation once when 25% visible
- `motion-safe:md:intersect:animate-fade`: Fade animation on medium+ screens
- `motion-safe:md:opacity-0`: Initial opacity for fade effect

### Accessibility Note:

Animations respect `prefers-reduced-motion` media query automatically through Tailwind's `motion-safe:` prefix.

---

## Current Performance Status ✅

Your Astro website is already well-optimized with:
- **Static generation** enabled for all pages
- **Image optimization** with WebP format and responsive sizes
- **Compression** enabled for CSS, HTML, and JavaScript
- **Lazy loading** for images via rehype plugin
- Reasonable bundle sizes (81KB CSS, 15KB JS)

## Key Optimization Recommendations

### 1. Enable Partytown for Analytics 🚀
**Impact**: Reduces main thread blocking, improves Core Web Vitals

Your analytics scripts are currently disabled. Enable Partytown to move Google Analytics to a web worker:

```typescript
// In astro.config.ts
const hasExternalScripts = true; // Change to true
```

### 2. Optimize Font Loading ⚡
**Impact**: Prevents invisible text during font load

Add font-display swap and preload critical fonts:

```typescript
// In astro.config.ts, add to vite config
vite: {
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "~@fontsource-variable/inter/index.css";`
      }
    }
  }
}
```

### 3. Implement Critical CSS Extraction 🎯
**Impact**: Faster first paint, better LCP scores

Add critical CSS inlining for above-the-fold content:

```bash
npm install astro-critical-css
```

```typescript
// In astro.config.ts
import { criticalCss } from 'astro-critical-css';

export default defineConfig({
  integrations: [
    // ... existing integrations
    criticalCss({
      width: 1200,
      height: 800,
    }),
  ],
});
```

### 4. Add Resource Hints 🔗
**Impact**: Reduces connection time for external resources

Preload critical resources in your Layout:

```astro
<!-- In Layout.astro head -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="/_astro/johny.webp" as="image" type="image/webp">
```

### 5. Optimize GDPR Banner ⚖️
**Impact**: Reduces initial JavaScript execution time

Your GDPR component is heavy (large JavaScript bundle). Consider:

- **Lazy load** the GDPR banner
- **Reduce JavaScript** by simplifying the banner logic
- **Use CSS-only** solution for basic banner functionality

### 6. Add Service Worker for Caching 💾
**Impact**: Faster repeat visits, offline capability

Implement caching for static assets:

```typescript
// Create src/sw.ts
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

// In Layout.astro
<script>
  import { registerSW } from 'virtual:pwa-register';
  registerSW();
</script>
```

### 7. Optimize Images Further 🖼️
**Impact**: Reduced bandwidth usage

Your images are already optimized, but consider:

- **Convert remaining images** to WebP/AVIF
- **Use next-gen formats** for hero images
- **Implement blur placeholders** for better UX

### 8. Bundle Analysis & Code Splitting 📦
**Impact**: Identify and reduce large dependencies

Monitor bundle sizes and split large components:

```bash
# Analyze bundle
npm install --save-dev rollup-plugin-visualizer
```

### 9. Contact Form Optimization 📧
**Impact**: Maintains functionality with static generation

Since you need form functionality with static generation:

**Option A: Netlify Forms**
```html
<form name="contact" method="POST" data-netlify="true">
  <!-- Your form fields -->
</form>
```

**Option B: Formspree**
```html
<form action="https://formspree.io/f/your-form-id" method="POST">
  <!-- Your form fields -->
</form>
```

### 10. Performance Monitoring 📊
**Impact**: Track improvements and identify issues

Add performance monitoring:

```typescript
// Add to Layout.astro
<script>
  // Core Web Vitals tracking
  import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

  onCLS(console.log);
  onFID(console.log);
  onFCP(console.log);
  onLCP(console.log);
  onTTFB(console.log);
</script>
```

## Implementation Priority

### High Impact (Implement First):
1. ✅ Enable Partytown for analytics
2. ⏳ Add critical CSS extraction
3. ⏳ Optimize font loading
4. ⏳ Implement resource hints

### Medium Impact:
5. ⏳ Optimize GDPR banner
6. ⏳ Add service worker
7. ⏳ Convert contact form to static solution

### Low Impact:
8. ⏳ Bundle analysis
9. ⏳ Performance monitoring
10. ⏳ Advanced image optimization

## Expected Results

With these optimizations, you should see:
- **20-40% improvement** in First Contentful Paint (FCP)
- **15-30% improvement** in Largest Contentful Paint (LCP)
- **Better Core Web Vitals** scores
- **Improved user experience** on slower connections

## Quick Wins (5-15 minutes each)

1. **Enable Partytown**: Change `hasExternalScripts = true` in astro.config.ts
2. **Add resource hints**: Add preload links to Layout.astro
3. **Optimize fonts**: Add font-display: swap to font imports
4. **Compress images**: Use WebP for all hero images

## Monitoring Tools

- **Lighthouse**: Run in Chrome DevTools
- **PageSpeed Insights**: Google's performance tool
- **WebPageTest**: Detailed performance analysis
- **Core Web Vitals**: Monitor in Google Search Console

## Maintenance

- Run Lighthouse audits monthly
- Monitor Core Web Vitals in Google Search Console
- Update dependencies regularly
- Re-optimize images when adding new content

---

*Generated on: September 10, 2025*
*For Enköpings Rehabcenter Astro website*
