"use client";

import { useRef, useEffect } from "react";

export default function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Force play
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Video play error:", error);
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
        className="absolute inset-0 w-full h-full object-cover"
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      >
        <source src="/assets/v1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
