"use client";

import { useState, useRef, useEffect } from "react";

export default function VideoHero() {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Try to play the video programmatically to handle autoplay restrictions
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Autoplay prevented:", error);
        });
      }
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
        style={{ minHeight: '100vh', minWidth: '100vw' }}
        onError={(e) => {
          console.error("Video failed to load:", e);
          setHasError(true);
          setIsLoading(false);
        }}
        onLoadedData={() => {
          setIsLoading(false);
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }}
        onCanPlay={() => {
          setIsLoading(false);
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }}
      >
        <source src="/assets/v1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <p className="text-white">Video unavailable - Check console for errors</p>
        </div>
      )}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <p className="text-white">Loading video...</p>
        </div>
      )}
    </section>
  );
}
