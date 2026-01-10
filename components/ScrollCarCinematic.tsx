"use client";

/**
 * ScrollCarCinematic - Premium 3-phase scroll-driven car animation
 * 
 * ASSETS SETUP:
 * Place your frame sequences in /public/scrollcar/:
 *   - /public/scrollcar/phaseA/frame_0001.webp ... frame_0120.webp
 *   - /public/scrollcar/phaseB/frame_0001.webp ... frame_0120.webp
 *   - /public/scrollcar/phaseC/frame_0001.webp ... frame_0120.webp
 * 
 * SCROLL DISTANCE:
 * Modify `heightVh` prop to change scroll distance (default: 380vh).
 * 
 * PHASE RANGES:
 * - Phase A (side view): 0.00 to 0.35
 * - Phase B (rotation): 0.35 to 0.70
 * - Phase C (zoom in): 0.70 to 1.00
 * 
 * PAINTWORK REVEAL:
 * The next section is revealed through a paintwork mask effect
 * during Phase C from 0.85 to 1.00.
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

interface ScrollCarCinematicProps {
  heightVh?: number;
  phaseAFrames?: number;
  phaseBFrames?: number;
  phaseCFrames?: number;
  phaseARoot?: string;
  phaseBRoot?: string;
  phaseCRoot?: string;
  title?: string;
  subtitle?: string;
}

// Phase boundaries
const PHASE_A_END = 0.35;
const PHASE_B_END = 0.70;
const PAINTWORK_REVEAL_START = 0.85;

export default function ScrollCarCinematic({
  heightVh = 380,
  phaseAFrames = 120,
  phaseBFrames = 120,
  phaseCFrames = 120,
  phaseARoot = "/scrollcar/phaseA",
  phaseBRoot = "/scrollcar/phaseB",
  phaseCRoot = "/scrollcar/phaseC",
  title = "From road grime to showroom finish",
  subtitle = "Scroll to experience the transformation",
}: ScrollCarCinematicProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Scroll progress from 0 to 1
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Determine current phase and phase progress
  const currentPhase = useTransform(scrollYProgress, (progress) => {
    if (progress < PHASE_A_END) return "A";
    if (progress < PHASE_B_END) return "B";
    return "C";
  });

  const phaseAProgress = useTransform(
    scrollYProgress,
    [0, PHASE_A_END],
    [0, 1],
    { clamp: true }
  );

  const phaseBProgress = useTransform(
    scrollYProgress,
    [PHASE_A_END, PHASE_B_END],
    [0, 1],
    { clamp: true }
  );

  const phaseCProgress = useTransform(
    scrollYProgress,
    [PHASE_B_END, 1],
    [0, 1],
    { clamp: true }
  );

  // Frame indices for each phase
  const frameA = useTransform(phaseAProgress, (p) =>
    Math.floor(p * (phaseAFrames - 1))
  );
  const frameB = useTransform(phaseBProgress, (p) =>
    Math.floor(p * (phaseBFrames - 1))
  );
  const frameC = useTransform(phaseCProgress, (p) =>
    Math.floor(p * (phaseCFrames - 1))
  );

  // Paintwork reveal progress (0.85 to 1.00)
  const paintworkReveal = useTransform(
    scrollYProgress,
    [PAINTWORK_REVEAL_START, 1],
    [0, 1],
    { clamp: true }
  );

  // Text opacity
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0], {
    clamp: true,
  });

  // VRS Detailing indicator (Phase B only)
  const detailingOpacity = useTransform(
    scrollYProgress,
    [PHASE_A_END, PHASE_A_END + 0.05, PHASE_B_END - 0.05, PHASE_B_END],
    [0, 1, 1, 0],
    { clamp: true }
  );

  // Canvas state
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [currentPhaseState, setCurrentPhaseState] = useState<"A" | "B" | "C">(
    "A"
  );
  const [loadedFrames, setLoadedFrames] = useState<
    Map<string, HTMLImageElement>
  >(new Map());
  const [frameLoadErrors, setFrameLoadErrors] = useState<Set<string>>(
    new Set()
  );

  // Frame preloading
  const preloadFrames = useCallback(
    async (phase: "A" | "B" | "C", startIndex: number, count: number = 10) => {
      const root =
        phase === "A" ? phaseARoot : phase === "B" ? phaseBRoot : phaseCRoot;
      const totalFrames =
        phase === "A" ? phaseAFrames : phase === "B" ? phaseBFrames : phaseCFrames;

      const framesToLoad: Promise<void>[] = [];

      for (let i = startIndex; i < Math.min(startIndex + count, totalFrames); i++) {
        const frameNum = String(i + 1).padStart(4, "0");
        const frameKey = `${phase}_${frameNum}`;
        const framePath = `${root}/frame_${frameNum}.webp`;

        // Skip if already loaded or errored
        if (loadedFrames.has(frameKey) || frameLoadErrors.has(frameKey)) {
          continue;
        }

        const loadPromise = new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            setLoadedFrames((prev) => new Map(prev).set(frameKey, img));
            resolve();
          };
          img.onerror = () => {
            setFrameLoadErrors((prev) => new Set(prev).add(frameKey));
            resolve();
          };
          img.src = framePath;
        });

        framesToLoad.push(loadPromise);
      }

      await Promise.all(framesToLoad);
    },
    [phaseARoot, phaseBRoot, phaseCRoot, phaseAFrames, phaseBFrames, phaseCFrames, loadedFrames, frameLoadErrors]
  );

  // Update canvas with current frame
  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const updateCanvas = () => {
      const phase = currentPhaseState;
      const frameIndex = currentFrameIndex;
      const frameNum = String(frameIndex + 1).padStart(4, "0");
      const frameKey = `${phase}_${frameNum}`;

      const img = loadedFrames.get(frameKey);

      // Set canvas size with device pixel ratio
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      if (img && img.complete) {
        // Clear and draw
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      } else if (!frameLoadErrors.has(frameKey)) {
        // Show placeholder if frame not loaded yet
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(
          "Loading frames...",
          rect.width / 2,
          rect.height / 2
        );
      } else {
        // Show error placeholder
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.fillStyle = "#888888";
        ctx.font = "14px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(
          `Add frames to ${phase === "A" ? phaseARoot : phase === "B" ? phaseBRoot : phaseCRoot}/frame_${frameNum}.webp`,
          rect.width / 2,
          rect.height / 2
        );
      }
    };

    updateCanvas();
  }, [currentFrameIndex, currentPhaseState, loadedFrames, frameLoadErrors, prefersReducedMotion, phaseARoot, phaseBRoot, phaseCRoot]);

  // Sync scroll progress to frame index
  useEffect(() => {
    if (prefersReducedMotion) return;

    const unsubscribePhase = currentPhase.on("change", (phase: "A" | "B" | "C") => {
      setCurrentPhaseState(phase);
    });

    const unsubscribeFrameA = frameA.on("change", (index: number) => {
      if (currentPhaseState === "A") {
        setCurrentFrameIndex(index);
        // Preload nearby frames
        preloadFrames("A", Math.max(0, index - 5), 15);
      }
    });

    const unsubscribeFrameB = frameB.on("change", (index: number) => {
      if (currentPhaseState === "B") {
        setCurrentFrameIndex(index);
        preloadFrames("B", Math.max(0, index - 5), 15);
      }
    });

    const unsubscribeFrameC = frameC.on("change", (index: number) => {
      if (currentPhaseState === "C") {
        setCurrentFrameIndex(index);
        preloadFrames("C", Math.max(0, index - 5), 15);
      }
    });

    return () => {
      unsubscribePhase();
      unsubscribeFrameA();
      unsubscribeFrameB();
      unsubscribeFrameC();
    };
  }, [
    currentPhase,
    frameA,
    frameB,
    frameC,
    currentPhaseState,
    preloadFrames,
    prefersReducedMotion,
  ]);

  // Initial frame preload
  useEffect(() => {
    if (prefersReducedMotion) return;
    preloadFrames("A", 0, 20);
  }, [preloadFrames, prefersReducedMotion]);

  // Paintwork reveal opacity
  const paintworkOverlayOpacity = useTransform(
    paintworkReveal,
    [0, 0.1],
    [0, 1],
    { clamp: true }
  );

  return (
    <>
      <section
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{
          height: prefersReducedMotion ? "120vh" : `${heightVh}vh`,
        }}
      >
        {/* Sticky stage */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />

          {/* Canvas for frame rendering */}
          {prefersReducedMotion ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <div className="text-center text-slate-400">
                <p className="text-sm">Static frame (reduced motion enabled)</p>
              </div>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ imageRendering: "auto" as const }}
            />
          )}

          {/* Grain overlay */}
          <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHJlc3VsdD0ibm9pc2UiLz48ZmVDb2xvck1hdHJpeCBpbi0ibm9pc2UiIHR5cGU9InNhdHVyYXRlIiB2YWx1ZXM9IjAiLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] pointer-events-none" />

          {/* Vignette */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/20 pointer-events-none" />

          {/* Text overlay */}
          <motion.div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 z-20 text-center px-4 w-full max-w-3xl"
            style={{ opacity: textOpacity }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              {title}
            </h2>
            <p className="text-lg md:text-xl text-white/90 drop-shadow-lg">
              {subtitle}
            </p>
          </motion.div>

          {/* VRS Detailing indicator (Phase B) */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ opacity: detailingOpacity }}
          >
            <div className="bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full border border-white/20">
              <p className="text-white text-xl font-medium tracking-wider">
                VRS DETailing
              </p>
            </div>
          </motion.div>

          {/* Paintwork reveal overlay (Phase C) */}
          <motion.div
            className="absolute inset-0 z-30 pointer-events-none"
            style={{
              opacity: paintworkOverlayOpacity,
            }}
          >
            {/* Glossy paint effect */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.1) 100%)",
              }}
            />
            {/* Noise texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSBiYXNlRnJlcXVlbmN5PSIwLjkiIG51bU9jdGF2ZXM9IjQiIHJlc3VsdD0ibm9pc2UiLz48L2ZpbHRlcj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbHRlcj0idXJsKCNub2lzZSkiLz48L3N2Zz4=')]" />
          </motion.div>
        </div>
      </section>

      {/* Paintwork reveal mask - grows from center to reveal next section */}
      {/* This creates a circular reveal effect that grows from the center */}
      {/* The mask reveals the content below (next section) as it scrolls up */}
      <motion.div
        className="fixed inset-0 z-40 pointer-events-none"
        style={{
          opacity: paintworkOverlayOpacity,
          clipPath: useTransform(
            paintworkReveal,
            (p) => {
              const radius = Math.sqrt(p) * 200;
              return `circle(${radius}% at 50% 50%)`;
            }
          ),
        }}
      >
        {/* Glossy paint overlay that gets revealed through the mask */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(200,220,255,0.2) 0%, rgba(150,180,220,0.15) 50%, rgba(100,120,150,0.1) 100%)",
            backdropFilter: "blur(1px)",
          }}
        />
        {/* Metallic paint texture */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
          }}
        />
      </motion.div>
    </>
  );
}

