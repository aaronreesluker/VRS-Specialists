"use client";

import { useState, useEffect } from "react";

export default function VideoHero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {!hasError ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => {
            console.error("Video failed to load");
            setHasError(true);
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
