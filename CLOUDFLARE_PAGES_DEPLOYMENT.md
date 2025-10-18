# Cloudflare Pages Deployment Guide

## Overview

This guide explains how to set up automated deployment to Cloudflare Pages with WordPress webhook integration for your physiotherapy website. With Cloudflare Pages, the build process happens directly on Cloudflare's infrastructure for optimal performance.

## Architecture

```
WordPress (Headless CMS)
    ↓ (Webhook)
API Endpoint (/api/rebuild)
    ↓ (Optional: Direct API trigger)
Cloudflare Pages
    ↓ (Build & Deploy)
Static Site + Global CDN
    ↓
End Users
```

## Quick Setup

### Step 1: Set up Cloudflare Pages Project

1. **Create Cloudflare Account**:
   - Go to [Cloudflare Pages](https://pages.cloudflare.com)
   - Sign up or log in to your Cloudflare account

2. **Create Pages Project**:
   - Click "Create a project"
   - Choose "Connect to Git"
   - Connect your GitHub repository (`corepop/rehabcenter`)
   - Select the `main` branch

3. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty)
   - **Node.js version**: 18

4. **Environment Variables**:
   Add these environment variables in your Cloudflare Pages dashboard:
   ```bash
   WORDPRESS_URL=https://your-wordpress-site.com
   REBUILD_SECRET=your_webhook_secret
   ```

### Step 2: Configure GitHub Repository Secrets (Optional)

Add these secrets to your GitHub repository if you want webhook-triggered rebuilds:

```bash
# Optional: For direct Cloudflare API triggers
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_PROJECT_NAME=your_project_name

# Required: WordPress site URL
WORDPRESS_URL=https://your-wordpress-site.com

# Optional: Webhook secret for additional security
REBUILD_SECRET=your_webhook_secret
```

**How to get Cloudflare credentials:**

1. **API Token**:
   - Go to Cloudflare Dashboard → My Profile → API Tokens
   - Click "Create Token"
   - Use "Edit Cloudflare Workers" template or create custom token
   - Required permissions: Account:Cloudflare Pages:Edit, Zone:Page Rules:Edit

2. **Account ID**:
   - Go to Cloudflare Dashboard → Account Home
   - Copy your Account ID from the right sidebar

3. **Project Name**:
   - Go to Cloudflare Pages in your dashboard
   - Copy the project name from the project list

### Step 3: Configure WordPress Webhook

1. **Install a WordPress webhook plugin** (like "Webhook" or "WP Webhooks")
2. **Set up the webhook**:

   **For Cloudflare Pages deployment:**
   - **URL**: `https://your-project.pages.dev/api/rebuild`
   - **Method**: `POST`
   - **Authorization**: `Bearer your_rebuild_secret` (if using REBUILD_SECRET)
   - **Trigger**: On post publish/update

3. **Alternative: Manual webhook setup**:
   ```bash
   # Trigger rebuild via API
   curl -X POST https://your-project.pages.dev/api/rebuild \
     -H "Authorization: Bearer your_rebuild_secret" \
     -H "Content-Type: application/json"
   ```

## Deployment Methods

### Method 1: Automatic (Git Push)
Cloudflare Pages automatically rebuilds when you push to the main branch:
- ✅ **Pros**: Simple, reliable, no external dependencies
- ❌ **Cons**: Requires git push for each rebuild

### Method 2: Webhook Triggered (Recommended)
Webhook triggers rebuild via API endpoint:
- ✅ **Pros**: Instant rebuilds, no manual intervention needed
- ✅ **Pros**: Works with WordPress publishing workflow
- ❌ **Cons**: Requires API tokens for direct triggering

### Method 3: Manual Trigger
Manual rebuild via Cloudflare Pages dashboard:
- ✅ **Pros**: Full control, good for testing
- ❌ **Cons**: Manual process required

## How It Works

### Automatic Deployment Flow (Git Push)

1. **Content Creation**: You publish/update a post in WordPress
2. **Webhook Trigger**: WordPress sends webhook to `/api/rebuild`
3. **Git Commit**: API endpoint could trigger a git commit (optional)
4. **Cloudflare Build**: Git push triggers Cloudflare Pages automatic build
5. **Global Deployment**: Cloudflare serves the updated site globally

### Direct API Deployment Flow (Webhook)

1. **Content Creation**: You publish/update a post in WordPress
2. **Webhook Trigger**: WordPress sends webhook to `/api/rebuild`
3. **Cloudflare API**: API endpoint triggers Cloudflare Pages rebuild directly
4. **Build Process**: Cloudflare builds the site with latest WordPress content
5. **Global Deployment**: Updated site served globally via CDN

## Build Configuration

### Cloudflare Pages Build Settings

```
Build command: npm run build
Build output directory: dist
Root directory: (leave empty)
Node.js version: 18
```

### Environment Variables Setup

In Cloudflare Pages dashboard, add these environment variables:

**Production Environment:**
```bash
WORDPRESS_URL=https://your-wordpress-site.com
REBUILD_SECRET=your_secure_webhook_secret
```

**Optional (for API triggers):**
```bash
CLOUDFLARE_API_TOKEN=your_api_token
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_PROJECT_NAME=your_project_name
```

## Monitoring & Troubleshooting

### Check Deployment Status

1. **Cloudflare Pages Dashboard**: Pages → Your project → Deployments
2. **Build Logs**: Click on any deployment to see detailed logs
3. **Live Site**: `https://your-project.pages.dev`

### Common Issues

**❌ Build Fails**
- Check WordPress URL is accessible
- Verify environment variables are set correctly
- Check build logs for detailed error messages

**❌ WordPress Content Not Updating**
- Verify webhook is configured correctly in WordPress
- Check that posts are published (not draft)
- Confirm WordPress REST API is enabled

**❌ Cloudflare Pages Not Updating**
- Wait 2-3 minutes for deployment to complete
- Check that project is properly connected to GitHub
- Verify build settings are correct

### Debug Mode

Add this to your Cloudflare Pages environment variables for detailed logging:
```bash
DEBUG=wordpress,astro
LOG_LEVEL=debug
```

## Performance Benefits

- **⚡ Fast Builds**: Cloudflare's optimized build infrastructure
- **🚀 Global CDN**: 300+ data centers worldwide
- **📱 Mobile Optimized**: Responsive design maintained
- **🔍 SEO Ready**: Static generation preserves SEO benefits
- **💰 Cost Effective**: Generous free tier with premium performance

## Advanced Features

### Preview Deployments

Cloudflare Pages automatically creates preview deployments for pull requests:
- Test changes before merging to production
- Share preview URLs with stakeholders
- Run automated tests on preview environments

### Custom Domains

1. **Add Domain in Cloudflare**:
   - Go to Cloudflare Dashboard → Websites
   - Add your domain and complete DNS setup

2. **Configure in Pages**:
   - Go to Pages dashboard → Your project → Custom domains
   - Click "Set up a custom domain"
   - Select your domain from the list

### Analytics & Monitoring

- **Web Analytics**: Built-in analytics for page views and performance
- **Real User Monitoring**: Core Web Vitals and performance metrics
- **Error Tracking**: JavaScript error reporting and monitoring

## Security Features

- **Webhook Authentication**: Optional secret-based authentication
- **CORS Protection**: Proper cross-origin request handling
- **Input Validation**: Sanitized webhook payloads
- **Environment Variable Protection**: Secrets not exposed in client-side code

## Customization Options

### Build Customization

You can customize the build process by modifying:
- **Build command**: Change `npm run build` if needed
- **Environment variables**: Add custom variables for your build process
- **Node.js version**: Update to newer versions as needed

### Webhook Integration

The API endpoint (`/api/rebuild`) can be extended to:
- Trigger additional build steps
- Send notifications (Slack, Discord, etc.)
- Update external services
- Trigger cache purging

## Support & Maintenance

### Regular Updates

- **Dependencies**: Run `npm audit` monthly
- **WordPress**: Keep plugins updated for security
- **Cloudflare**: Monitor for new features and updates

### Backup Strategy

- **Repository**: GitHub handles version control
- **WordPress Content**: Use WordPress backup plugins
- **Environment Variables**: Store securely in Cloudflare Pages

## Need Help?

1. **Check the logs**: Cloudflare Pages → Deployments tab
2. **Test webhooks**: Use tools like webhook.site for testing
3. **Community support**: Cloudflare Community or Stack Overflow

---

**🎉 Congratulations!** Your physiotherapy website is now set up with Cloudflare Pages deployment. Enjoy the performance benefits of Cloudflare's global CDN and edge computing capabilities.

## Migration Checklist

- [ ] Set up Cloudflare Pages project
- [ ] Configure build settings in Cloudflare Pages
- [ ] Set up environment variables in Cloudflare Pages
- [ ] Configure WordPress webhook (optional)
- [ ] Test deployment process
- [ ] Update DNS (if using custom domain)
- [ ] Verify all functionality works correctly
