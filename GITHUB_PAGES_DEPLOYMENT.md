# GitHub Pages Automated Deployment Guide

## Overview

This guide explains how to set up automated deployment to GitHub Pages with WordPress webhook integration for your physiotherapy website.

## Architecture

```
WordPress (Headless CMS)
    ↓ (Webhook)
API Endpoint (/api/rebuild)
    ↓ (GitHub API)
GitHub Actions Workflow
    ↓ (Build & Deploy)
GitHub Pages
    ↓ (Static Site)
End Users
```

## Quick Setup

### Step 1: Configure GitHub Repository

1. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Select "GitHub Actions" as the source
   - Save the settings

2. **No token needed**: The built-in `GITHUB_TOKEN` handles deployment automatically

### Step 2: Configure Environment Variables

Add these secrets to your GitHub repository:

```bash
# Required: WordPress site URL (where you write content)
WORDPRESS_URL=https://your-wordpress-site.com

# Optional: Webhook secret for additional security
REBUILD_SECRET=your_webhook_secret
```

**How to add secrets:**
1. Go to your repository **Settings → Secrets and variables → Actions**
2. **Select "Repository secrets"** tab (not environment secrets)
3. Click **"New repository secret"**
4. **Create each secret separately** (one for each variable below)
5. Use the exact names shown for each secret

⚠️ **Important**:
- Use **Repository secrets**, not Environment secrets
- Create **separate secrets** for each variable (don't combine them)
- Each secret name must match exactly

### Required Secrets:

**Secret 1: WordPress Site URL**
- **Name**: `WORDPRESS_URL`
- **Value**: `https://your-wordpress-site.com`
- **Purpose**: Where your content is written (your CMS)

**Secret 2 (Optional): Webhook Security**
- **Name**: `REBUILD_SECRET`
- **Value**: `your_webhook_secret`
- **Purpose**: Optional security for webhook authentication

### Step 3: Configure WordPress Webhook

1. **Install a WordPress webhook plugin** (like "Webhook" or "WP Webhooks")
2. **Set up the webhook**:

   **If using GitHub Pages default URL:**
   - **URL**: `https://your-username.github.io/api/rebuild`
   - **Method**: `POST`
   - **Authorization**: `Bearer your_rebuild_secret` (if using REBUILD_SECRET)
   - **Trigger**: On post publish/update

   **If using custom domain:**
   - **URL**: `https://yourdomain.com/api/rebuild`
   - **Method**: `POST`
   - **Authorization**: `Bearer your_rebuild_secret` (if using REBUILD_SECRET)
   - **Trigger**: On post publish/update

3. **Alternative: Manual webhook setup**:
   ```bash
   # For GitHub Pages default URL:
   curl -X POST https://your-username.github.io/api/rebuild \
     -H "Authorization: Bearer your_rebuild_secret" \
     -H "Content-Type: application/json"

   # For custom domain:
   curl -X POST https://yourdomain.com/api/rebuild \
     -H "Authorization: Bearer your_rebuild_secret" \
     -H "Content-Type: application/json"
   ```

## How It Works

### Automatic Deployment Flow

1. **Content Creation**: You publish/update a post in WordPress
2. **Webhook Trigger**: WordPress sends webhook to `/api/rebuild`
3. **GitHub Actions**: API endpoint triggers GitHub Actions workflow
4. **Build Process**: Astro fetches latest WordPress content and builds static site
5. **Deployment**: GitHub Pages serves the updated static site
6. **Cache Invalidation**: New content is immediately available

### Manual Deployment Options

**Option 1: GitHub Interface**
- Go to Actions tab in your repository
- Click "Deploy to GitHub Pages" workflow
- Click "Run workflow" button

**Option 2: Command Line**
```bash
# Trigger rebuild via API
curl -X POST https://your-username.github.io/api/rebuild \
  -H "Authorization: Bearer your_rebuild_secret"
```

**Option 3: Push to Main**
- Any push to the `main` branch triggers automatic deployment

## Build Optimization

The deployment includes several optimizations:

- **Node.js 18** with npm caching for faster installs
- **Build artifact cleanup** to reduce deployment size
- **Memory optimization** (4GB allocated for large builds)
- **Static generation optimization** for WordPress content

## Monitoring & Troubleshooting

### Check Deployment Status

1. **GitHub Actions**: Repository → Actions tab
2. **Build Logs**: Click on any workflow run to see detailed logs
3. **Deployment URL**: Check the "deploy" job for the live site URL

### Common Issues

**❌ Build Fails**
- Check WordPress URL is accessible
- Verify environment variables are set correctly
- Check GitHub Actions logs for detailed error messages

**❌ WordPress Content Not Updating**
- Verify webhook is configured correctly in WordPress
- Check that posts are published (not draft)
- Confirm WordPress REST API is enabled

**❌ GitHub Pages Not Updating**
- Wait 2-3 minutes for deployment to complete
- Check that GitHub Pages is enabled in repository settings
- Verify the workflow completed successfully

### Debug Mode

Add this to your `.env` for detailed logging:
```bash
DEBUG=wordpress,astro
LOG_LEVEL=debug
```

## Performance Benefits

- **⚡ Fast Builds**: Optimized caching and cleanup scripts
- **🚀 Quick Deployments**: GitHub's global CDN
- **📱 Mobile Optimized**: Responsive design maintained
- **🔍 SEO Ready**: Static generation preserves SEO benefits
- **💰 Cost Effective**: Free hosting with premium performance

## Security Features

- **Webhook Authentication**: Optional secret-based authentication
- **GitHub Token Security**: Scoped permissions for deployment only
- **CORS Protection**: Proper cross-origin request handling
- **Input Validation**: Sanitized webhook payloads

## Customization Options

### Custom Domain (Optional)

1. **Purchase a domain** from any registrar
2. **Configure DNS**:
   - Add CNAME record: `your-username.github.io`
   - Or A records pointing to GitHub Pages IPs
3. **Enable in GitHub**: Settings → Pages → Custom domain

### Build Customization

Modify `.github/workflows/deploy.yml` to:
- Add additional build steps
- Include custom deployment scripts
- Add notification integrations (Slack, Discord, etc.)

## Support & Maintenance

### Regular Updates

- **Dependencies**: Run `npm audit` monthly
- **GitHub Actions**: Update action versions as needed
- **WordPress**: Keep plugins updated for security

### Backup Strategy

- **Repository**: GitHub handles version control
- **WordPress Content**: Use WordPress backup plugins
- **Environment Variables**: Store securely in GitHub Secrets

## Need Help?

1. **Check the logs**: GitHub Actions → Workflow runs
2. **Test webhooks**: Use tools like webhook.site for testing
3. **Community support**: GitHub Discussions or Stack Overflow

---

**🎉 Congratulations!** Your physiotherapy website now has automated deployment with WordPress integration. Every time you publish new content, it will automatically appear on your GitHub Pages site within minutes.
