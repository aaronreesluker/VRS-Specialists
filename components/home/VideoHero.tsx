"use client";

import { useRef, useEffect, useState } from "react";

export default function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 1) {
        video.pause();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.play().catch(() => {});

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectFit: "cover" }}
      >
        <source src="/assets/v1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
