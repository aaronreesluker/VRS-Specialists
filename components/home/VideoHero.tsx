"use client";

import { useRef, useEffect, useState } from "react";

export default function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 1) {
        video.pause();
      }
    };

    const handleError = () => {
      console.error("Video failed to load");
      setVideoError(true);
    };

    const handleCanPlay = () => {
      // Video is ready, try to play
      video.play().catch(() => {});
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("error", handleError);
    video.addEventListener("canplay", handleCanPlay);
    
    // Also try to play immediately in case video is already loaded
    if (video.readyState >= 3) {
      video.play().catch(() => {});
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          src="/assets/v1.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectFit: "cover" }}
        />
      )}
      {/* Fallback gradient if video fails */}
      {videoError && (
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)"
          }}
        />
      )}
    </section>
  );
}
