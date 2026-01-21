"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * ImageSequencePlayer Component
 * 
 * Renders a sequence of images based on scroll progress.
 * 
 * FRAME MAPPING:
 * - progress 0.0 → frame 1 (0001.png)
 * - progress 1.0 → frame 161 (0161.png)
 * - Formula: frameIndex = Math.floor(clampedProgress * (frameCount - 1)) + 1
 */

interface ImageSequencePlayerProps {
  progress: number; // Normalized progress 0-1
  frameCount: number;
  basePath?: string;
  frameFormat?: string;
  preloadCount?: number;
  className?: string;
  onPreloadProgress?: (completed: number, total: number) => void;
  onPreloadComplete?: () => void;
}

export function ImageSequencePlayer({
  progress,
  frameCount,
  basePath = "/car/frames",
  frameFormat = "%04d.png",
  preloadCount = 30,
  className = "",
  onPreloadProgress,
  onPreloadComplete,
}: ImageSequencePlayerProps) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(1);
  const [loadedFrames, setLoadedFrames] = useState<Set<number>>(new Set());
  const imageRef = useRef<HTMLImageElement>(null);

  // Generate frame path from index (1-indexed: 1-161)
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
    
    // Frame path generated
    
    return fullPath;
  };

  // Calculate target frame index from progress
  // progress 0.0 → frame 1, progress 1.0 → frame frameCount
  // NOTE: We intentionally "step" one frame at a time to avoid skipping frames.
  const targetFrameRef = useRef<number>(1);
  const animRafRef = useRef<number | null>(null);
  const currentFrameRef = useRef<number>(1);

  useEffect(() => {
    currentFrameRef.current = currentFrameIndex;
  }, [currentFrameIndex]);

  const ensureAnimating = useCallback(() => {
    if (animRafRef.current !== null) return;

    const step = () => {
      animRafRef.current = null;

      const current = currentFrameRef.current;
      const target = targetFrameRef.current;
      if (current === target) return;

      const next = current < target ? current + 1 : current - 1;
      currentFrameRef.current = next;
      setCurrentFrameIndex(next);

      animRafRef.current = requestAnimationFrame(step);
    };

    animRafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const clamped = Math.max(0, Math.min(1, progress));
    const frameIndex = Math.floor(clamped * (frameCount - 1)) + 1;
    const finalIndex = Math.max(1, Math.min(frameCount, frameIndex));
    targetFrameRef.current = finalIndex;
    ensureAnimating();
  }, [progress, frameCount, ensureAnimating]);

  useEffect(() => {
    return () => {
      if (animRafRef.current !== null) {
        cancelAnimationFrame(animRafRef.current);
        animRafRef.current = null;
      }
    };
  }, []);

  // Preload initial frames (load in parallel for faster initial load)
  useEffect(() => {
    let cancelled = false;
    let rafId: number | null = null;

    const preloadImages = async () => {
      const count = Math.min(preloadCount, frameCount);
      const loaded = new Set<number>();
      const loadPromises: Promise<void>[] = [];
      const total = count;
      let completed = 0;

      const scheduleProgress = () => {
        if (!onPreloadProgress) return;
        if (cancelled) return;
        if (rafId !== null) return;
        rafId = requestAnimationFrame(() => {
          rafId = null;
          if (cancelled) return;
          onPreloadProgress(completed, total);
        });
      };

      for (let i = 1; i <= count; i++) {
        const promise = new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            completed += 1;
            loaded.add(i);
            scheduleProgress();
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to load frame ${i}: ${getFramePath(i)}`);
            completed += 1;
            scheduleProgress();
            resolve();
          };
          img.src = getFramePath(i);
        });
        loadPromises.push(promise);
      }

      // Load frames in parallel instead of sequentially
      await Promise.all(loadPromises);
      if (cancelled) return;
      setLoadedFrames(loaded);
      // Final progress + ready signal (even if some frames failed)
      if (onPreloadProgress) onPreloadProgress(completed, total);
      onPreloadComplete?.();
    };

    preloadImages();

    return () => {
      cancelled = true;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  }, [frameCount, preloadCount, basePath, frameFormat, onPreloadComplete, onPreloadProgress]);

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
