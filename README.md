# VRS Specialists Website

Premium, modern, conversion-focused website for V.R.S - Vehicle Rejuvenation Specialists.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Headless WordPress** (Blog CMS)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- WordPress.com account or self-hosted WordPress (for blog functionality)

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Copy the example environment file:
```bash
cp .env.example .env.local
```

3. Configure environment variables in `.env.local`:
```env
WORDPRESS_SITE_ID=your-wordpress-site-id-here
NEXT_PUBLIC_SITE_URL=https://www.vrsspecialists.com
```

### Running Locally

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Gallery Images

To add or replace gallery images:

1. Add images to the `/public/gallery/` directory
2. Update `/data/gallery.json` with your image metadata:

```json
[
  {
    "id": 1,
    "src": "/gallery/your-image.jpg",
    "alt": "Descriptive alt text",
    "category": "Detailing"
  }
]
```

3. Categories should match: `"Detailing"`, `"Correction"`, `"Coating"`, or `"PPF"`

**Note:** Currently using placeholder images from Unsplash. Replace with actual images from your website and Instagram.

## WordPress Blog Setup

The site includes a fully functional headless WordPress blog system.

### Connecting WordPress on Vercel

1. **Get your WordPress Site ID:**
   - For WordPress.com: Go to your site settings and find the Site ID
   - For self-hosted: Use your site's URL (contact developer for API setup)

2. **Add Environment Variables in Vercel:**
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add:
     - `WORDPRESS_SITE_ID` = your WordPress site ID
     - `NEXT_PUBLIC_SITE_URL` = https://www.vrsspecialists.com

3. **Test the Connection:**
   - After deployment, visit: `https://yourdomain.com/api/wp-posts-health`
   - Should return JSON with `"ok": true` if connected correctly

### Blog Infrastructure

The blog system includes:

- **API Layer:** `lib/wordpress.ts` - Single source of truth for WordPress data
- **Blog Listing:** `/blog` - Displays all published posts with pagination
- **Blog Posts:** `/blog/[slug]` - Individual post pages with ISR
- **Homepage Preview:** Blog section on homepage (shows latest 3 posts)
- **Health Check:** `/api/wp-posts-health` - Debug endpoint to verify connection

All blog routes use ISR (Incremental Static Regeneration) with 60-second revalidation.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── blog/              # Blog listing and post pages
│   ├── api/               # API routes (health check)
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── faq/               # FAQ page
│   ├── gallery/           # Gallery page
│   ├── services/          # Services pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── home/             # Homepage sections
│   ├── services/         # Service components
│   ├── contact/          # Contact form
│   ├── BlogSection.tsx   # Server component (fetches data)
│   └── BlogSection.client.tsx  # Client component (UI)
├── lib/                   # Utilities
│   └── wordpress.ts      # WordPress API layer
├── data/                  # Static data
│   └── gallery.json      # Gallery image manifest
└── public/                # Static assets
    ├── gallery/          # Gallery images
    └── videos/           # Video files (hero video)
```

## Pre-Launch Checklist

### Content
- [ ] Replace placeholder images with actual images from website/Instagram
- [ ] Add hero video to `/public/videos/hero.mp4` (or remove video component)
- [ ] Review and update all service descriptions and pricing
- [ ] Verify contact information (email, phone, WhatsApp)
- [ ] Update testimonials with real client reviews
- [ ] Review FAQ answers for accuracy

### Configuration
- [ ] Set up WordPress environment variables in Vercel
- [ ] Test WordPress connection via `/api/wp-posts-health`
- [ ] Verify `NEXT_PUBLIC_SITE_URL` matches production domain
- [ ] Update schema markup with actual business address (if available)

### SEO
- [ ] Verify all page metadata (titles, descriptions)
- [ ] Check OpenGraph tags
- [ ] Verify schema markup renders correctly
- [ ] Submit sitemap to search engines
- [ ] Set up Google Analytics (if required)

### Functionality
- [ ] Test contact form submission
- [ ] Test all navigation links
- [ ] Test mobile responsive design
- [ ] Test mobile CTA bar (Call/WhatsApp)
- [ ] Verify gallery filtering works
- [ ] Test blog listing and individual posts (if WordPress connected)

### Performance
- [ ] Run Lighthouse audit
- [ ] Optimize images (WebP format recommended)
- [ ] Test page load speeds
- [ ] Verify ISR is working correctly

### Deployment
- [ ] Deploy to Vercel (or preferred hosting)
- [ ] Set up custom domain
- [ ] Configure SSL certificate
- [ ] Set up redirects (if migrating from old site)
- [ ] Test production build locally: `npm run build`

## Deployment

For detailed deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

### Quick Start

1. **GitHub**: Push your code to a GitHub repository
2. **Vercel**: Connect your GitHub repo to Vercel for automatic deployments
3. **WordPress.com**: Add your WordPress Site ID as an environment variable
4. **SEO**: Sitemap and robots.txt are automatically generated

### Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

- `WORDPRESS_SITE_ID` - Your WordPress.com Site ID
- `NEXT_PUBLIC_SITE_URL` - Your production URL (e.g., https://www.vrsspecialists.com)

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `WORDPRESS_SITE_ID` | Yes (for blog) | WordPress.com Site ID or self-hosted site identifier |
| `NEXT_PUBLIC_SITE_URL` | Yes | Full production URL (e.g., https://www.vrsspecialists.com) |

## Support

For issues or questions:
- Email: info@vrsspecialists.com
- Website: https://www.vrsspecialists.com

## License

Proprietary - All rights reserved.

