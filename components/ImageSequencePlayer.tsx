"use client";

import { useEffect, useState, useRef } from "react";

/**
 * ImageSequencePlayer Component
 * 
 * Renders a sequence of images based on scroll progress.
 * 
 * FRAME MAPPING:
 * - progress 0.0 → frame 1 (0001.png)
 * - progress 1.0 → frame 160 (0160.png)
 * - Formula: frameIndex = Math.floor(clampedProgress * (frameCount - 1)) + 1
 */

interface ImageSequencePlayerProps {
  progress: number; // Normalized progress 0-1
  frameCount: number;
  basePath?: string;
  frameFormat?: string;
  preloadCount?: number;
  className?: string;
}

export function ImageSequencePlayer({
  progress,
  frameCount,
  basePath = "/car/frames",
  frameFormat = "%04d.png",
  preloadCount = 30,
  className = "",
}: ImageSequencePlayerProps) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(1);
  const [loadedFrames, setLoadedFrames] = useState<Set<number>>(new Set());
  const imageRef = useRef<HTMLImageElement>(null);

  // Generate frame path from index (1-indexed: 1-160)
  const getFramePath = (index: number): string => {
    const paddedIndex = index.toString().padStart(4, "0");
    // Handle frameFormat - replace %04d with padded index
    // If frameFormat is "%04d.png", this becomes "0001.png", "0002.png", etc.
    let filename: string;
    if (frameFormat.includes("%04d")) {
      filename = frameFormat.replace(/%04d/g, paddedIndex);
    } else {
      // Fallback: if format doesn't contain %04d, just use padded index + .png
      filename = `${paddedIndex}.png`;
    }
    // Ensure basePath starts with /
    const cleanBasePath = basePath.startsWith("/") ? basePath : `/${basePath}`;
    // Remove trailing slash if present
    const normalizedBasePath = cleanBasePath.endsWith("/") ? cleanBasePath.slice(0, -1) : cleanBasePath;
    const fullPath = `${normalizedBasePath}/${filename}`;
    
    if (process.env.NODE_ENV === "development" && index <= 3) {
      console.log(`[ImageSequencePlayer] Frame ${index}: ${fullPath}`);
    }
    
    return fullPath;
  };

  // Calculate frame index from progress - optimized for maximum smoothness
  // progress 0.0 → frame 1, progress 1.0 → frame frameCount
  const frameUpdateRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(1);
  
  useEffect(() => {
    const clamped = Math.max(0, Math.min(1, progress));
    // Use Math.round for smoother interpolation between frames
    // This provides better frame accuracy for smooth animation
    const exactFrame = clamped * (frameCount - 1) + 1;
    const frameIndex = Math.round(exactFrame);
    const finalIndex = Math.max(1, Math.min(frameCount, frameIndex));
    
    // Only update if frame actually changed (reduces unnecessary re-renders)
    if (finalIndex === lastFrameRef.current) {
      return;
    }
    
    // Cancel any pending frame update
    if (frameUpdateRef.current !== null) {
      cancelAnimationFrame(frameUpdateRef.current);
    }
    
    // Use requestAnimationFrame for smooth, synchronized frame updates
    frameUpdateRef.current = requestAnimationFrame(() => {
      lastFrameRef.current = finalIndex;
      setCurrentFrameIndex(finalIndex);
      frameUpdateRef.current = null;
    });
    
    return () => {
      if (frameUpdateRef.current !== null) {
        cancelAnimationFrame(frameUpdateRef.current);
        frameUpdateRef.current = null;
      }
    };
  }, [progress, frameCount]);

  // Preload initial frames (load in parallel for faster initial load)
  useEffect(() => {
    const preloadImages = async () => {
      const count = Math.min(preloadCount, frameCount);
      const loaded = new Set<number>();
      const loadPromises: Promise<void>[] = [];

      for (let i = 1; i <= count; i++) {
        const promise = new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            loaded.add(i);
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to load frame ${i}: ${getFramePath(i)}`);
            resolve();
          };
          img.src = getFramePath(i);
        });
        loadPromises.push(promise);
      }

      // Load frames in parallel instead of sequentially
      await Promise.all(loadPromises);
      setLoadedFrames(loaded);
    };

    preloadImages();
  }, [frameCount, preloadCount, basePath, frameFormat]);

  // Lazy load frames as we approach them (preload more frames for smoother playback)
  useEffect(() => {
    const framesToLoad = [
      currentFrameIndex,
      currentFrameIndex + 1,
      currentFrameIndex + 2,
      currentFrameIndex + 3,
      currentFrameIndex + 4,
      currentFrameIndex + 5,
      currentFrameIndex + 6,
      currentFrameIndex + 7,
      currentFrameIndex + 8,
      currentFrameIndex - 1,
      currentFrameIndex - 2,
      currentFrameIndex - 3,
      currentFrameIndex - 4,
      currentFrameIndex - 5,
      currentFrameIndex - 6,
    ].filter((idx) => idx >= 1 && idx <= frameCount && !loadedFrames.has(idx));

    framesToLoad.forEach((idx) => {
      const img = new Image();
      img.onload = () => {
        setLoadedFrames((prev) => new Set([...prev, idx]));
      };
      img.onerror = () => {
        console.error(`Failed to load frame ${idx}: ${getFramePath(idx)}`);
      };
      img.src = getFramePath(idx);
    });
  }, [currentFrameIndex, frameCount, loadedFrames, basePath, frameFormat]);

  const currentFramePath = getFramePath(currentFrameIndex);
  const isLoaded = loadedFrames.has(currentFrameIndex);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`} style={{ display: "inline-block" }}>
      {hasError ? (
        <div style={{ 
          width: "600px", 
          height: "400px", 
          backgroundColor: "#1a1a1a", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "white",
          fontSize: "14px"
        }}>
          Frame {currentFrameIndex} failed to load
          <br />
          <span style={{ fontSize: "12px", opacity: 0.7 }}>{currentFramePath}</span>
        </div>
      ) : (
        <img
          ref={imageRef}
          src={currentFramePath}
          alt={`Car animation frame ${currentFrameIndex}`}
          style={{
            display: "block",
            width: "auto",
            height: "auto",
            maxWidth: "95vw",
            maxHeight: "85vh",
            minWidth: "280px", // Ensure car is visible on mobile
            minHeight: "180px", // Minimum height for visibility
            opacity: isLoaded ? 1 : 0.3,
            transition: "opacity 0.03s linear",
            imageRendering: "crisp-edges",
            willChange: "contents",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
            WebkitBackfaceVisibility: "hidden",
            isolation: "isolate",
            objectFit: "contain", // Ensure entire car is visible
          }}
          loading="eager"
          draggable={false}
          onError={(e) => {
            console.error(`Failed to display frame ${currentFrameIndex}: ${currentFramePath}`);
            setHasError(true);
          }}
          onLoad={() => {
            setHasError(false);
          }}
        />
      )}
    </div>
  );
}
