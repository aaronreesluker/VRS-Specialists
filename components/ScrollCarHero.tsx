"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ImageSequencePlayer } from "./ImageSequencePlayer";

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
  frameCount = 160,
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

  // Check for reduced motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
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
  // Linear ensures frames advance evenly with scroll
  const carAnimationProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 1],
    { 
      clamp: true
    }
  );

  // Car position: moves from left to center, then slightly right for headlight
  const carX = useTransform(scrollYProgress, [0, 0.5, 1.0], [-20, 0, 30], { clamp: true });

  // Car scale: grows smoothly, CLAMPED to prevent overshoot
  // Start at 0.9 so car is visible immediately, grow to 2.2 for close-up
  const carScale = useTransform(scrollYProgress, [0, 1.0], [0.9, 2.2], { clamp: true });

  // Flash overlay
  const flashOpacity = useTransform(scrollYProgress, [0.9, 1.0], [0, 1], { clamp: true });

  // Reduced motion
  const reducedMotionProgress = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 0.33, 0.66, 1], { clamp: true });

  // Update progress for ImageSequencePlayer
  const effectiveProgress = reducedMotion ? reducedMotionProgress : carAnimationProgress;
  
  // Throttle progress updates for smoother frame transitions
  const progressUpdateRef = useRef<number | null>(null);
  
  useMotionValueEvent(effectiveProgress, "change", (latest) => {
    // Cancel any pending update
    if (progressUpdateRef.current !== null) {
      cancelAnimationFrame(progressUpdateRef.current);
    }
    
    // Use requestAnimationFrame to sync with browser paint cycles
    progressUpdateRef.current = requestAnimationFrame(() => {
      setCurrentProgress(latest);
      progressUpdateRef.current = null;
    });
  });

  return (
    <div
      ref={containerRef}
      className={`relative ${backgroundColor}`}
      style={{ height: `${heroHeight}vh` }}
    >
      <div className="sticky top-0 h-screen w-full" style={{ overflow: "hidden" }}>
        {/* Title */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
          style={{ opacity: titleOpacity }}
        >
          <h1 
            className="text-7xl md:text-9xl text-white mb-6"
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {titleMain}
          </h1>
          <p 
            className="text-xl md:text-3xl text-white/80"
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

        {/* Car Animation */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            paddingTop: "20vh", // Push car down more
          }}
        >
          <motion.div
            style={{
              opacity: carOpacity,
              x: carX,
              scale: carScale,
              transformOrigin: "center center",
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
            }}
          >
            <ImageSequencePlayer
              progress={currentProgress}
              frameCount={frameCount}
              basePath={frameBasePath}
              frameFormat={frameFormat}
              preloadCount={30}
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
