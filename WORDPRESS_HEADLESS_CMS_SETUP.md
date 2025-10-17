# WordPress Headless CMS Setup Guide

## Overview

This Astro site is configured to use WordPress as a headless CMS. Content is fetched from WordPress during build time and generates static HTML files for optimal performance.

## How It Works

1. **Build Time Fetching**: During `npm run build`, the site fetches all posts from `https://rygg.nu/blogg/wordpress/wp-json/wp/v2/posts`
2. **Static Generation**: Each WordPress post is converted to a static HTML page
3. **Permalink Structure**: Posts are accessible at `/blogg/[slug]/` (e.g., `/blogg/hej-varlden/`)

## Production Deployment Strategy

Since this is a static site, new WordPress posts won't appear automatically. Here are simple solutions for manual deployments:

### Option 1: Manual Rebuild (Simplest)

**When you publish a new WordPress post:**

1. **Run the build command:**
   ```bash
   npm run build
   ```

2. **Deploy the updated files** from the `dist/` folder to your web server

3. **That's it!** Your new post will be live immediately.

### Option 2: WordPress Webhook (Optional Enhancement)

If you want notifications when it's time to rebuild:

1. **Set up environment variables** (optional):
   ```bash
   REBUILD_SECRET=your-optional-secret
   ```

2. **Configure WordPress webhook** in your WordPress admin:
   - Install a webhook plugin or use WordPress settings
   - Set webhook URL to: `https://yourdomain.com/api/rebuild`
   - Method: `POST`
   - Header: `Authorization: Bearer your-optional-secret`

3. **Webhook will log requests** - check your server logs for rebuild notifications

### Option 3: Simple Automation Script

Create a script for easy rebuilding:

```bash
#!/bin/bash
# wordpress-rebuild.sh
echo "🔄 Fetching latest WordPress content..."
npm run build
echo "✅ Build complete! Deploy the dist/ folder to your server."
```

**Usage:** `./wordpress-rebuild.sh` after publishing new WordPress content.

## WordPress Configuration

Ensure your WordPress site has:
- REST API enabled (default in modern WordPress)
- Permalinks set to "Post name" structure
- CORS headers allowing your domain (if needed)

## Current Implementation

- ✅ **Static Generation**: `prerender = true` on all blog pages
- ✅ **WordPress Integration**: Fetches from `/wp-json/wp/v2/posts?_embed=true`
- ✅ **Permalink Pattern**: `/blogg/%slug%` structure
- ✅ **Pagination**: Automatic pagination for blog listing
- ✅ **SEO**: Proper metadata for all posts

## File Structure

```
src/
├── pages/blogg/
│   ├── index.astro          # Blog listing page
│   └── [slug].astro         # Individual blog posts
├── lib/
│   ├── wordpress.ts         # WordPress API client
│   └── blog-wordpress.ts    # Blog logic and static paths
└── config.yaml              # Blog configuration
```

## Testing

1. **Local Development**:
   ```bash
   npm run dev
   # Visit http://localhost:4321/blogg/
   ```

2. **Production Build**:
   ```bash
   npm run build
   # Check dist/blogg/ for generated HTML files
   ```

## Troubleshooting

**Blog posts not appearing:**
- Check WordPress URL in `.env`
- Verify WordPress REST API is accessible
- Check browser console for errors

**Build fails:**
- Ensure WordPress site is online
- Check network connectivity to `https://rygg.nu/blogg/wordpress/`
- Verify WordPress has posts with "publish" status

## Security Notes

- The rebuild webhook requires proper authentication
- Use a strong, random secret for `REBUILD_SECRET`
- Consider IP restrictions on your deployment platform
