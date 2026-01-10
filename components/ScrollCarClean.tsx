"use client";

/**
 * ScrollCarClean - Premium cinematic scroll-driven vehicle animation
 * 
 * Uses a realistic SVG car that transforms from dirty to clean as you scroll.
 * No external images needed - the car is rendered as SVG with dynamic filters.
 * 
 * SCROLL DISTANCE:
 * To change the scroll distance, modify the `heightVh` prop (default: 300).
 * This controls how tall the scroll section is (300vh = 3x viewport height).
 * Higher values = longer scroll = slower animation scrub.
 * 
 * BACKGROUND:
 * Optional background image or video can be provided via props:
 *   - bgSrc: Background image path
 *   - bgVideoSrc: Background video path
 */

import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, MotionValue, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import CarSVG from "./CarSVG";

// Wrapper component to sync motion value with SVG
function CarSVGWithProgress({ progress }: { progress: MotionValue<number> }) {
  const [currentProgress, setCurrentProgress] = useState(0);

  useMotionValueEvent(progress, "change", (latest) => {
    setCurrentProgress(latest);
  });

  return <CarSVG progress={currentProgress} />;
}

interface ScrollCarCleanProps {
  title?: string;
  subtitle?: string;
  bgSrc?: string;
  bgVideoSrc?: string;
  heightVh?: number;
  direction?: "ltr" | "rtl";
}

const DEFAULT_BG_SRC = "/scrollcar/bg.jpg";

export default function ScrollCarClean({
  title = "From road grime to showroom finish",
  subtitle = "Scroll to see the transformation",
  bgSrc = DEFAULT_BG_SRC,
  bgVideoSrc,
  heightVh = 350, // Increased for more scroll distance like Terminal Industries
  direction = "ltr",
}: ScrollCarCleanProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Scroll progress from 0 to 1
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transform scroll progress - Terminal Industries pattern
  // Car drives in dirty, transforms while moving, drives away clean
  // Phase 1 (0-0.15): Car enters dirty from left (partially visible)
  // Phase 2 (0.15-0.85): Car moves across center, transforming dirty to clean
  // Phase 3 (0.85-1): Car exits clean to right
  const carX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    direction === "ltr" 
      ? ["-20%", "20%", "60%", "120%"] 
      : ["120%", "60%", "20%", "-20%"],
    {
      clamp: false,
    }
  );

  // Car vertical movement: subtle arc for premium weighty feel
  const carY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["0%", "-4%", "0%"],
    {
      clamp: false,
    }
  );

  // Clean reveal progress: Car is dirty at start, clean by end
  // Transformation happens during the middle phase (15%-85% scroll)
  const cleanReveal = useTransform(
    scrollYProgress,
    [0.15, 0.85],
    [0, 1],
    {
      clamp: true,
    }
  );

  // Text opacity: fade out as car enters and transformation begins
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.2],
    [1, 0],
    {
      clamp: true,
    }
  );

  // Scroll indicator opacity: fade out quickly after car enters
  const indicatorOpacity = useTransform(
    scrollYProgress,
    [0, 0.1],
    [1, 0],
    {
      clamp: true,
    }
  );

  // Background parallax: premium subtle movement
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "15%"],
    {
      clamp: false,
    }
  );

  // Shadow intensity: dynamic change as car moves (premium effect)
  const shadowOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.4, 0.6, 0.5],
    {
      clamp: true,
    }
  );
  const shadowBlur = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [25, 50, 35],
    {
      clamp: true,
    }
  );
  const shadowScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.9, 1.1, 1.0],
    {
      clamp: true,
    }
  );

  // Mist layer opacity: fades out as car gets clean
  const mistOpacity = useTransform(
    scrollYProgress,
    [0, 0.5],
    [0.6, 0],
    {
      clamp: true,
    }
  );

  // Car scale: subtle zoom as it enters, normal size while cleaning, slight zoom out as it exits
  const carScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [0.92, 1.0, 1.0, 1.0, 0.96],
    {
      clamp: true,
    }
  );

  // For reduced motion: show clean version immediately
  const finalCarX = prefersReducedMotion ? "50%" : carX;
  const finalCarY = prefersReducedMotion ? "0%" : carY;
  const finalTextOpacity = prefersReducedMotion ? 0 : textOpacity;
  const finalIndicatorOpacity = prefersReducedMotion ? 0 : indicatorOpacity;

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-slate-900"
      style={{ height: prefersReducedMotion ? "auto" : `${heightVh}vh` }}
    >
      {/* Sticky viewport stage */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Background */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ y: prefersReducedMotion ? 0 : bgY }}
        >
          {bgVideoSrc ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={bgVideoSrc} type="video/mp4" />
            </video>
          ) : bgSrc ? (
            <Image
              src={bgSrc}
              alt=""
              fill
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          )}
          {/* Grain overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHJlc3VsdD0ibm9pc2UiLz48ZmVDb2xvck1hdHJpeCBpbi0ibm9pc2UiIHR5cGU9InNhdHVyYXRlIiB2YWx1ZXM9IjAiLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] pointer-events-none" />
        </motion.div>

        {/* Mist layer */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 pointer-events-none"
            style={{ opacity: mistOpacity }}
          />
        )}

        {/* Car container */}
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            className="relative z-10 w-full max-w-5xl mx-auto px-4"
            style={{
              x: finalCarX,
              y: finalCarY,
              scale: prefersReducedMotion ? 1 : carScale,
            }}
          >
            {/* Premium car shadow with dynamic scaling */}
            <motion.div
              className="absolute bottom-0 left-1/2 w-[80%] h-32 rounded-full"
              style={{
                opacity: shadowOpacity,
                filter: useTransform(shadowBlur, (blur) => `blur(${blur}px)`),
                background: "radial-gradient(ellipse, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 80%)",
                scale: shadowScale,
                x: "-50%",
                y: "50%",
              }}
            />

            {/* Car SVG container */}
            <div className="relative w-full" style={{ height: "min(600px, 70vh)", minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "100%", height: "100%", position: "relative" }}>
                {prefersReducedMotion ? (
                  <CarSVG progress={1} />
                ) : (
                  <CarSVGWithProgress progress={cleanReveal} />
                )}
              </div>
            </div>
          </motion.div>

          {/* Text overlay */}
          <motion.div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 z-20 text-center px-4 w-full max-w-3xl"
            style={{ opacity: finalTextOpacity }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-white/90 drop-shadow-lg">
              {subtitle}
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            style={{ opacity: finalIndicatorOpacity }}
          >
            <span className="text-white/70 text-sm">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-6 h-10 border-2 border-white/70 rounded-full flex items-start justify-center p-1.5"
            >
              <div className="w-1.5 h-1.5 bg-white/70 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Spacer to create scroll height */}
      {!prefersReducedMotion && <div className="h-full" />}
    </section>
  );
}

