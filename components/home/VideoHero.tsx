"use client";

import { useState, useRef, useEffect } from "react";

export default function VideoHero() {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Try to play the video programmatically to handle autoplay restrictions
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Autoplay prevented:", error);
      });
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {!hasError ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error("Video failed to load:", e);
            setHasError(true);
          }}
          onCanPlay={() => {
            // Ensure video plays when ready
            if (videoRef.current) {
              videoRef.current.play().catch(() => {
                // Ignore play errors
              });
            }
          }}
        >
          <source src="/assets/v1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-black">
          <p className="text-white">Video unavailable</p>
        </div>
      )}
    </section>
  );
}
