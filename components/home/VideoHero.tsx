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
    <section className="relative w-screen h-screen overflow-hidden bg-black" style={{ width: '100vw', height: '100vh' }}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          transition: 'opacity 0.5s ease-in'
        }}
      >
        <source src="/assets/v1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
