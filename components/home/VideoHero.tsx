"use client";

import { useRef, useEffect } from "react";

export default function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      console.log("Video element found, attempting to play");
      // Force play
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video playing successfully");
          })
          .catch((error) => {
            console.error("Video play error:", error);
          });
      }
      
      // Log video events for debugging
      video.addEventListener('loadstart', () => console.log('Video: loadstart'));
      video.addEventListener('loadedmetadata', () => console.log('Video: loadedmetadata'));
      video.addEventListener('loadeddata', () => console.log('Video: loadeddata'));
      video.addEventListener('canplay', () => console.log('Video: canplay'));
      video.addEventListener('error', (e) => {
        console.error('Video error event:', e);
        console.error('Video error code:', video.error?.code);
        console.error('Video error message:', video.error?.message);
      });
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
          zIndex: 1,
          backgroundColor: '#000'
        }}
      >
        <source src="/assets/v1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
