# Deployment Guide - VRS Specialists

This guide covers deploying the VRS Specialists website to GitHub, Vercel, and WordPress.com integration for SEO.

## Table of Contents

1. [GitHub Setup](#github-setup)
2. [Vercel Deployment](#vercel-deployment)
3. [WordPress.com Integration](#wordpresscom-integration)
4. [SEO Configuration](#seo-configuration)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)

---

## GitHub Setup

### Initial Setup

1. **Initialize Git Repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: VRS Specialists website"
   ```

2. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it: `vrs-specialists` (or your preferred name)
   - **Do NOT** initialize with README, .gitignore, or license (we already have these)

3. **Connect and Push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/vrs-specialists.git
   git branch -M main
   git push -u origin main
   ```

### Ongoing Updates

```bash
git add .
git commit -m "Your commit message"
git push
```

---

## Vercel Deployment

### Option 1: Deploy via GitHub (Recommended)

1. **Connect GitHub to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Sign in with your GitHub account
   - Click "Add New Project"
   - Import your `vrs-specialists` repository

2. **Configure Project Settings**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

3. **Add Environment Variables** (see [Environment Variables](#environment-variables) section below)

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your site
   - You'll get a URL like: `https://vrs-specialists.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Production Deploy**:
   ```bash
   vercel --prod
   ```

### Custom Domain Setup

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain: `www.vrsspecialists.com`
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_SITE_URL` environment variable to match your domain

---

## WordPress.com Integration

### Getting Your WordPress Site ID

1. **For WordPress.com Sites**:
   - Go to your WordPress.com site dashboard
   - Navigate to: Settings → General
   - Your Site ID is displayed there, OR
   - Check the URL: `wordpress.com/sites/{SITE_ID}`

2. **Alternative Method**:
   - Visit: `https://public-api.wordpress.com/rest/v1.1/me/sites`
   - This will list all your sites with their IDs (requires authentication)

### Setting Up Environment Variables

1. **In Vercel Dashboard**:
   - Go to: Project → Settings → Environment Variables
   - Add the following:

   | Variable | Value | Environment |
   |----------|-------|-------------|
   | `WORDPRESS_SITE_ID` | Your WordPress Site ID | Production, Preview, Development |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.vrsspecialists.com` | Production, Preview, Development |

2. **For Local Development**:
   - Create `.env.local` file in project root:
   ```env
   WORDPRESS_SITE_ID=your-wordpress-site-id-here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### Testing WordPress Connection

After deployment, test the connection:

1. **Health Check Endpoint**:
   - Visit: `https://yourdomain.com/api/wp-posts-health`
   - Should return: `{"ok": true, "siteId": "your-site-id"}`

2. **Blog Page**:
   - Visit: `https://yourdomain.com/blog`
   - Should display your WordPress posts

3. **Individual Post**:
   - Visit: `https://yourdomain.com/blog/your-post-slug`
   - Should display the full post content

---

## SEO Configuration

### Automatic SEO Features

The site includes automatic SEO optimizations:

1. **Sitemap**: Automatically generated at `/sitemap.xml`
   - Includes all static pages
   - Dynamically includes WordPress blog posts
   - Updates automatically when posts are published

2. **Robots.txt**: Automatically generated at `/robots.txt`
   - Allows all search engines
   - Points to sitemap location

3. **Metadata**: Each page has optimized:
   - Title tags
   - Meta descriptions
   - OpenGraph tags (for social sharing)
   - Structured data (Schema.org)

### Submitting to Search Engines

1. **Google Search Console**:
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add your property: `https://www.vrsspecialists.com`
   - Verify ownership
   - Submit sitemap: `https://www.vrsspecialists.com/sitemap.xml`

2. **Bing Webmaster Tools**:
   - Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
   - Add your site
   - Submit sitemap: `https://www.vrsspecialists.com/sitemap.xml`

3. **WordPress.com SEO**:
   - Your WordPress.com blog posts are automatically indexed
   - The headless integration ensures blog content appears on your main site
   - WordPress.com's SEO features still apply to your blog content

### WordPress.com SEO Benefits

- **Content Management**: Easy blog post creation and editing
- **Automatic Indexing**: WordPress.com automatically indexes your blog
- **SEO Plugins**: Use WordPress.com SEO features for blog content
- **Content Syndication**: Blog posts appear on both WordPress.com and your main site

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `WORDPRESS_SITE_ID` | Your WordPress.com Site ID | `12345678` |
| `NEXT_PUBLIC_SITE_URL` | Full production URL | `https://www.vrsspecialists.com` |

### Setting in Vercel

1. Go to: Project → Settings → Environment Variables
2. Add each variable
3. Select environments: Production, Preview, Development
4. Click "Save"
5. Redeploy for changes to take effect

### Setting Locally

Create `.env.local` file:

```env
WORDPRESS_SITE_ID=your-wordpress-site-id-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important**: Never commit `.env.local` to Git (it's in `.gitignore`)

---

## Troubleshooting

### WordPress Connection Issues

**Problem**: Blog posts not showing

**Solutions**:
1. Verify `WORDPRESS_SITE_ID` is correct
2. Check WordPress.com site is public (not private)
3. Test API endpoint: `https://public-api.wordpress.com/rest/v1.1/sites/{SITE_ID}/posts`
4. Check Vercel function logs for errors

### Build Failures

**Problem**: Vercel build fails

**Solutions**:
1. Check build logs in Vercel dashboard
2. Test build locally: `npm run build`
3. Ensure all dependencies are in `package.json`
4. Check for TypeScript errors: `npm run lint`

### Sitemap Not Updating

**Problem**: Sitemap doesn't include new blog posts

**Solutions**:
1. Sitemap uses ISR (Incremental Static Regeneration)
2. Wait up to 1 hour for automatic update, OR
3. Trigger rebuild in Vercel dashboard
4. Check WordPress posts are published (not draft)

### Images Not Loading

**Problem**: Car animation frames or gallery images not showing

**Solutions**:
1. Verify images are in `/public/car/frames/` directory
2. Check file names match expected format: `0001.png`, `0002.png`, etc.
3. Ensure images are committed to Git
4. Check browser console for 404 errors

### Domain Not Working

**Problem**: Custom domain shows error

**Solutions**:
1. Verify DNS settings in Vercel dashboard
2. Wait for DNS propagation (up to 48 hours)
3. Check SSL certificate is active
4. Update `NEXT_PUBLIC_SITE_URL` to match custom domain

---

## Continuous Deployment

### Automatic Deployments

Once connected to GitHub:
- **Push to `main` branch** → Deploys to production
- **Push to other branches** → Creates preview deployment
- **Pull Requests** → Creates preview deployment for review

### Manual Deployment

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments" tab
4. Click "Redeploy" on any deployment

---

## Performance Optimization

### Vercel Optimizations

- **Edge Network**: Automatic CDN distribution
- **Image Optimization**: Next.js Image component automatically optimizes
- **Static Generation**: Pages are pre-rendered for fast loading
- **ISR**: Blog posts use Incremental Static Regeneration

### Monitoring

1. **Vercel Analytics** (if enabled):
   - View in Vercel Dashboard → Analytics
   - Track page views, performance metrics

2. **Google Analytics** (optional):
   - Add `NEXT_PUBLIC_GA_ID` environment variable
   - Implement tracking code in `app/layout.tsx`

---

## Support

For deployment issues:
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **WordPress.com API**: https://developer.wordpress.com/docs/api/

---

## Quick Reference

### Git Commands
```bash
git add .
git commit -m "Your message"
git push
```

### Vercel Commands
```bash
vercel              # Deploy to preview
vercel --prod       # Deploy to production
vercel env add      # Add environment variable
```

### Local Development
```bash
npm install         # Install dependencies
npm run dev         # Start dev server
npm run build       # Test production build
```

---

**Last Updated**: 2024
**Maintained by**: VRS Specialists Development Team
