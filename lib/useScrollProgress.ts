"use client";

import { useEffect, useState } from "react";

/**
 * Hook to track scroll progress for a given element
 * Returns progress value from 0 to 1
 */
export function useScrollProgress(
  elementRef: React.RefObject<HTMLElement>
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const updateProgress = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;

      // Calculate progress: 0 when element top is at viewport bottom, 1 when element bottom is at viewport top
      const scrollProgress = Math.max(
        0,
        Math.min(
          1,
          (windowHeight - elementTop) / (windowHeight + elementHeight)
        )
      );

      setProgress(scrollProgress);
    };

    // Initial calculation
    updateProgress();

    // Update on scroll
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [elementRef]);

  return progress;
}





