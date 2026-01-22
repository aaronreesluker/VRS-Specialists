"use client";

import { useRef, useEffect, useState } from "react";

export default function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleCanPlay = () => {
        setIsLoaded(true);
        video.play().catch((error) => {
          console.error("Video play error:", error);
        });
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('loadeddata', () => {
        setIsLoaded(true);
        video.play().catch(() => {});
      });

      // Try to play immediately
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Initial play error:", error);
        });
      }

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
      };
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
        className={`absolute inset-0 w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          objectFit: 'cover',
          transition: 'opacity 0.5s ease-in'
        }}
      >
        <source src="/assets/v1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
