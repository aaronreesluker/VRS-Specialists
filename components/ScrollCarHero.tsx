"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ImageSequencePlayer } from "./ImageSequencePlayer";
import { VrsDrawLoader } from "./VrsDrawLoader";

interface ScrollCarHeroProps {
  frameCount?: number;
  heroHeight?: number;
  titleMain?: string;
  titleSub?: string;
  flashColor?: string;
  backgroundColor?: string;
  frameBasePath?: string;
  frameFormat?: string;
}

export function ScrollCarHero({
  frameCount = 161,
  heroHeight = 300,
  titleMain = "V.R.S",
  titleSub = "Vehicle Rejuvenation Specialists",
  flashColor = "#929292",
  backgroundColor = "bg-black",
  frameBasePath = "/car/frames",
  frameFormat = "%04d.png",
}: ScrollCarHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [framesReady, setFramesReady] = useState(false);
  const [hideLoader, setHideLoader] = useState(false);
  const [preloadStats, setPreloadStats] = useState<{ completed: number; total: number }>({
    completed: 0,
    total: frameCount,
  });
  const hideLoaderTimeoutRef = useRef<number | null>(null);

  const handlePreloadProgress = useCallback((completed: number, total: number) => {
    setPreloadStats({ completed, total });
  }, []);

  const handlePreloadComplete = useCallback(() => {
    setFramesReady(true);
    if (hideLoaderTimeoutRef.current !== null) {
      window.clearTimeout(hideLoaderTimeoutRef.current);
    }
    hideLoaderTimeoutRef.current = window.setTimeout(() => {
      setHideLoader(true);
      hideLoaderTimeoutRef.current = null;
    }, 550);
  }, []);

  // Check for reduced motion and mobile device
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Check for reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotionChange);
    
    // Check for mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (hideLoaderTimeoutRef.current !== null) {
        window.clearTimeout(hideLoaderTimeoutRef.current);
        hideLoaderTimeoutRef.current = null;
      }
    };
  }, []);

  // Scroll progress: maps container scroll [0, 1]
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Title fades out
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0], { clamp: true });

  // Car fades in quickly, stays visible
  const carOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1], { clamp: true });

  // Car animation: Linear mapping for consistent frame progression
  // Smooth transitions with adjusted input ranges for natural feel
  const carAnimationProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 1],
    { 
      clamp: true
    }
  );

  // Car position: moves from left to center, then slightly right for headlight
  // Adjusted for mobile - less movement to keep car in viewport
  const carX = useTransform(
    scrollYProgress, 
    [0, 0.5, 1.0], 
    isMobile ? [-10, 0, 15] : [-20, 0, 30], 
    { clamp: true }
  );

  // Car scale: grows smoothly, CLAMPED to prevent overshoot
  // Mobile: smaller scale range to ensure car stays visible
  // Desktop: Start at 0.9 so car is visible immediately, grow to 2.2 for close-up
  const carScale = useTransform(
    scrollYProgress, 
    [0, 1.0], 
    isMobile ? [0.8, 1.3] : [0.9, 2.2], 
    { clamp: true }
  );

  // Flash overlay
  const flashOpacity = useTransform(scrollYProgress, [0.9, 1.0], [0, 1], { clamp: true });

  // Reduced motion
  const reducedMotionProgress = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 0.33, 0.66, 1], { clamp: true });

  // Update progress for ImageSequencePlayer
  const effectiveProgress = reducedMotion ? reducedMotionProgress : carAnimationProgress;
  
  // Ultra-smooth progress updates synchronized with browser paint cycles
  const progressUpdateRef = useRef<number | null>(null);
  const pendingProgressRef = useRef<number>(0);
  
  useMotionValueEvent(effectiveProgress, "change", (latest) => {
    pendingProgressRef.current = latest;
    if (progressUpdateRef.current !== null) return;
    progressUpdateRef.current = requestAnimationFrame(() => {
      setCurrentProgress(pendingProgressRef.current);
        progressUpdateRef.current = null;
    });
  });

  // Adjust hero height for mobile - shorter on mobile for better UX
  const adjustedHeroHeight = isMobile ? Math.min(heroHeight, 200) : heroHeight;

  return (
    <div
      ref={containerRef}
      className={`relative ${backgroundColor}`}
      style={{ height: `${adjustedHeroHeight}vh` }}
    >
      <div className="sticky top-0 h-screen w-full relative" style={{ overflow: "hidden" }}>
        {/* VRS loader overlay (shown until frames are ready) */}
        {!hideLoader && (
          <VrsDrawLoader
            title={titleMain}
            subtitle={titleSub}
            progress={
              preloadStats.total > 0 ? preloadStats.completed / preloadStats.total : undefined
            }
            className={`transition-opacity duration-500 ${
              framesReady ? "opacity-0" : "opacity-100"
            }`}
          />
        )}

        {/* Title (after preloading) */}
        {framesReady && (
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4"
          style={{ opacity: titleOpacity }}
        >
          <h1 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl text-white mb-3 md:mb-6 text-center"
            style={{
                fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {titleMain}
          </h1>
          <p 
            className="text-base sm:text-lg md:text-xl lg:text-3xl text-white/80 text-center px-4"
            style={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 300,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {titleSub}
          </p>
        </motion.div>
        )}

        {/* Car Animation */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            paddingTop: isMobile ? "10vh" : "20vh", // Less padding on mobile
          }}
        >
          <motion.div
            style={{
              opacity: framesReady ? carOpacity : 0,
              x: carX,
              scale: carScale,
              transformOrigin: "center center",
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "translateZ(0)",
              WebkitTransform: "translateZ(0)",
              isolation: "isolate",
            }}
          >
            <ImageSequencePlayer
              progress={currentProgress}
              frameCount={frameCount}
              basePath={frameBasePath}
              frameFormat={frameFormat}
              preloadCount={frameCount}
              onPreloadProgress={handlePreloadProgress}
              onPreloadComplete={handlePreloadComplete}
              className=""
            />
          </motion.div>
        </div>

        {/* Flash Overlay */}
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            opacity: flashOpacity,
            background: `radial-gradient(circle at center, ${flashColor} 0%, ${flashColor} 100%)`,
          }}
        />
      </div>
    </div>
  );
}
