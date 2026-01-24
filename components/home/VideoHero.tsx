"use client";

import { useRef, useEffect, useState } from "react";

export default function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Stop 1 second before end
    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 1) {
        video.pause();
      }
    };

    const handleError = () => {
      console.error("Video failed to load");
      setVideoError(true);
    };

    // Use canplaythrough - enough data buffered to play without stalling
    const handleCanPlayThrough = () => {
      setIsPlaying(true);
      video.play().catch(() => {});
    };

    // Also handle play event to ensure state is synced
    const handlePlay = () => {
      setIsPlaying(true);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("error", handleError);
    video.addEventListener("canplaythrough", handleCanPlayThrough);
    video.addEventListener("playing", handlePlay);
    
    // If already buffered enough, play immediately
    if (video.readyState >= 4) {
      setIsPlaying(true);
      video.play().catch(() => {});
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      video.removeEventListener("playing", handlePlay);
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Poster/placeholder - shows immediately while video loads */}
      <div 
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        style={{
          backgroundImage: "url('/assets/VRS_logo_transparent.png')",
          backgroundSize: "200px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#000"
        }}
      >
        {/* Loading indicator */}
        {!videoError && !isPlaying && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
            <span className="text-white/60 text-xs uppercase tracking-widest">Loading</span>
          </div>
        )}
      </div>

      {/* Video element - always rendered for preloading */}
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          poster="/assets/VRS_logo_transparent.png"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            objectFit: "cover",
            // GPU acceleration hints for smooth playback
            transform: "translateZ(0)",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Primary source - MP4 with H.264 is most compatible */}
          <source src="/assets/v1.mp4" type="video/mp4" />
        </video>
      )}

      {/* Fallback gradient if video fails */}
      {videoError && (
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/assets/VRS_logo_transparent.png')",
            backgroundSize: "200px",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#000"
          }}
        />
      )}
    </section>
  );
}
