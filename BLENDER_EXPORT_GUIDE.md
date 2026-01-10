# Blender Export Guide for VRS Specialists Car Hero

## Export Settings

### File Path in Blender

When exporting your animation sequence in Blender, use this exact path:

```
C:\Users\aaron\OneDrive\Desktop\Websites\To DO\VRS Specialists\public\car\frames\
```

### File Naming Pattern

**Output Format:** `frame_####.png`

Where `####` is a 4-digit zero-padded frame number:
- Frame 1: `frame_0001.png`
- Frame 2: `frame_0002.png`
- ...
- Frame 160: `frame_0160.png`

### Blender Render Settings

1. **Output Properties Tab:**
   - **File Format:** PNG
   - **Color:** RGBA (with Alpha/Transparency)
   - **Color Depth:** 8 bit (or 16 bit if needed)
   - **Compression:** 0-15% (lower = faster, higher = smaller files)

2. **Film/Transparent:**
   - Enable **Film Transparent** in Render Properties
   - This ensures the background is transparent (RGBA)

3. **Frame Range:**
   - **Start Frame:** 1
   - **End Frame:** 160
   - **Frame Step:** 1

4. **Output Settings:**
   - **File Path:** `C:\Users\aaron\OneDrive\Desktop\Websites\To DO\VRS Specialists\public\car\frames\`
   - **File Name:** `frame_####.png` (Blender will auto-number with `####`)

### Quick Checklist

- [ ] Output path points to: `...\VRS Specialists\public\car\frames\`
- [ ] File format: PNG
- [ ] Color mode: RGBA (with Alpha)
- [ ] Film Transparent: Enabled
- [ ] Frame range: 1 to 160
- [ ] File naming: `frame_####.png`
- [ ] Resolution: Your desired resolution (1920x1080 or higher recommended)

### After Export

1. Verify all 160 frames are in the folder
2. Check that files are named correctly: `frame_0001.png` through `frame_0160.png`
3. Test the website - the animation should work automatically!

### File Size Optimization (Optional)

If your PNG files are very large (>10MB total), consider:

1. **Reduce Resolution:** If frames are 4K, consider 1920x1080 for web
2. **Compression:** Increase PNG compression in Blender (15-30%)
3. **After Export:** Convert to WebP using:
   - [Squoosh.app](https://squoosh.app) (browser-based)
   - ImageMagick: `magick convert frame_*.png -quality 90 frame_%04d.webp`
   - Then update `frameFormat` in code to `"frame_%04d.webp"`

### Troubleshooting

**Frames not appearing on website:**
- Check file path is exactly: `public\car\frames\`
- Verify naming: `frame_0001.png` (not `frame_1.png` or `frame_001.png`)
- Check browser console for 404 errors
- Ensure files are actually in the `public` folder (not `app` or `components`)

**Animation not smooth:**
- Verify all 160 frames exist
- Check frame numbers are sequential (no gaps)
- Ensure files aren't corrupted

**Large file sizes:**
- See "File Size Optimization" above
- Consider WebP conversion for production

