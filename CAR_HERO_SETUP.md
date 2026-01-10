# Scroll-Driven Car Hero Setup Guide

## Overview

This implementation provides a cinematic scroll-driven hero section that scrubs through a sequence of PNG frames as the user scrolls, creating a smooth animation effect.

## File Structure

```
/public/car/frames/
  ├── frame_0001.png
  ├── frame_0002.png
  ├── ...
  └── frame_0140.png

/components/
  ├── ImageSequencePlayer.tsx  # Handles frame loading and display
  └── ScrollCarHero.tsx        # Main hero component with scroll logic
```

## Setup Instructions

### 1. Prepare Your Frames

1. Export your Blender animation as PNG frames with:
   - **RGBA** format (transparency enabled)
   - **Film Transparent** enabled in Blender
   - Consistent naming: `frame_0001.png`, `frame_0002.png`, etc.

2. Place all frames in: `/public/car/frames/`

### 2. Configure Frame Count

In `app/page.tsx`, update the `frameCount` prop:

```tsx
<ScrollCarHero
  frameCount={140}  // Change to match your total frames
  // ... other props
/>
```

### 3. Adjust File Naming (if different)

If your frames use a different naming pattern, update the `frameFormat` prop:

```tsx
<ScrollCarHero
  frameFormat="car_%04d.png"  // Custom format
  // ... other props
/>
```

The format uses `%04d` as a placeholder for the zero-padded frame number.

### 4. Customize Scroll Ranges

Edit the `config` object in `components/ScrollCarHero.tsx`:

```tsx
const config = {
  titleFadeRange: [0, 0.15],      // Title fades out 0-15% scroll
  carFadeRange: [0.1, 0.3],       // Car fades in 10-30% scroll
  carAnimationRange: [0.2, 0.95], // Animation scrubs 20-95% scroll
  flashRange: [0.85, 1.0],        // Flash appears 85-100% scroll
};
```

### 5. Match Flash Color to Next Section

The flash overlay should seamlessly transition into your next section:

```tsx
<ScrollCarHero
  flashColor="#0f172a"  // Must match next section background
  // ...
/>

<section style={{ backgroundColor: "#0f172a" }}>
  {/* Next section content */}
</section>
```

## Performance Optimization

### When to Use PNG vs WebP

- **PNG (Current)**: Best for development and when file size is manageable
  - Good for: <50 frames, <5MB total
  - Pros: Perfect transparency, no conversion needed
  - Cons: Larger file sizes

- **WebP (Recommended for Production)**: 30-50% smaller files
  - Good for: 50-200 frames, 5-20MB total
  - Convert using: ImageMagick, Squoosh, or online tools
  - Update `frameFormat` to `"frame_%04d.webp"`

### When to Consider Alternatives

- **Video with Scrubbing**: For >200 frames or >20MB
  - Better performance, single file
  - Use libraries like `react-player` or custom video scrubbing

- **Sprite Sheet**: For very large sequences
  - Single image file, CSS background-position animation
  - More complex setup but excellent performance

- **CDN Hosting**: For production deployments
  - Move frames to S3, Cloudflare R2, or similar
  - Update `frameBasePath` to CDN URL
  - Reduces Next.js build size

### Mobile Optimization

The component automatically:
- Preloads fewer frames on initial load
- Lazy-loads frames as user scrolls
- Respects `prefers-reduced-motion` (shows key stills instead of scrubbing)

For further mobile optimization:
- Consider reducing frame count for mobile (use `useMediaQuery`)
- Use WebP format
- Implement frame skipping (show every 2nd or 3rd frame)

## Customization

### Change Hero Height

```tsx
<ScrollCarHero
  heroHeight={350}  // Default: 300 (300vh)
  // ...
/>
```

### Change Titles

```tsx
<ScrollCarHero
  titleMain="V.R.S"
  titleSub="Vehicle Rejuvenation Specialists"
  // ...
/>
```

### Change Background

```tsx
<ScrollCarHero
  backgroundColor="bg-slate-900"  // Any Tailwind class
  // ...
/>
```

## Accessibility

The component automatically:
- Respects `prefers-reduced-motion`
- Shows 3 key stills (entry, mid, final) instead of scrubbing when reduced motion is enabled
- Maintains proper semantic HTML structure

## Troubleshooting

### Frames Not Loading

1. Check file paths match `frameBasePath` prop
2. Verify naming matches `frameFormat` prop
3. Check browser console for 404 errors
4. Ensure files are in `/public/` directory (not `/app/` or `/components/`)

### Animation Not Smooth

1. Reduce `preloadCount` if experiencing lag
2. Check total file size - consider WebP conversion
3. Verify frames are sequential and numbered correctly

### Flash Transition Not Seamless

1. Ensure `flashColor` exactly matches next section background
2. Check both use the same color format (hex, rgb, etc.)
3. Verify no other elements are interfering with z-index

### Performance Issues

1. Convert PNG to WebP
2. Reduce frame count if possible
3. Implement frame skipping for mobile
4. Move frames to CDN
5. Consider using video instead

## Example Usage

See `app/page.tsx` for a complete example with:
- Hero section with car animation
- Seamless transition to next section
- Proper color matching

## Next Steps

1. Add your PNG frames to `/public/car/frames/`
2. Update `frameCount` in `app/page.tsx`
3. Test scroll behavior
4. Adjust scroll ranges if needed
5. Match flash color to your next section
6. (Optional) Convert to WebP for production
7. (Optional) Move to CDN for production

