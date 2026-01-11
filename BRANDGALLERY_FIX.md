# BrandGallery.tsx Fix Instructions

## Problem Summary
The file has a structure issue where `navigateLightboxImages` function was moved but still references variables that may not be in scope correctly. The function needs to access `currentPost` images, but `currentPost` is defined later in the code.

## The Issue
- Line 315-327: `navigateLightboxImages` function uses `currentBrand.examples[selectedExampleIndex].images` 
- Line 329: `currentPost` is defined AFTER the function
- The function is called in the JSX (lines 808, 817) where `currentPost` is used

## Solution
Move `navigateLightboxImages` to AFTER `currentPost` is defined, OR refactor it to use `currentPost` directly from the component scope.

## Quick Fix (Recommended)
Replace lines 314-327 with the version below that uses `currentPost`:

```typescript
  const currentPost = currentBrand.examples[selectedExampleIndex];
  const hasMedia = currentPost && (currentPost.video || (currentPost.images && currentPost.images.length > 0));
  
  // Lightbox navigation function - uses currentPost from closure
  const navigateLightboxImages = (direction: "prev" | "next") => {
    if (lightboxMediaType === "image" && currentPost?.images && currentPost.images.length > 1) {
      const totalImages = currentPost.images.length;
      const newIndex = direction === "next" 
        ? (lightboxImageIndex + 1) % totalImages
        : (lightboxImageIndex - 1 + totalImages) % totalImages;
      setLightboxImageIndex(newIndex);
      if (currentPost.images[newIndex]) {
        setLightboxMediaSrc(currentPost.images[newIndex]);
      }
    }
  };
  
  if (!hasMedia) {
```

This ensures `navigateLightboxImages` has access to `currentPost` which is used in the lightbox JSX.

## File Location
`components/BrandGallery.tsx`

## Build Error
The error was: "Unexpected token `section`. Expected jsx identifier" at line 357/359, but this was likely caused by the function reference issue confusing the TypeScript parser.

