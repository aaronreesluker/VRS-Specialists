"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Hero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoadedData={() => setIsVideoLoaded(true)}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        {/* Fallback Image */}
        {!isVideoLoaded && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=2070')",
            }}
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-dark-900/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
          Vehicle Rejuvenation
          <br />
          <span className="text-primary-400">Perfected</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-200">
          Meticulous detailing, paint correction, and protection services in
          Brighton and across Sussex. Studio workshop or mobile service.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/contact" className="btn-primary text-lg px-8 py-4">
            Request a Quote
          </Link>
          <div className="flex gap-4">
            <a
              href="tel:08000029083"
              className="btn-secondary text-lg px-8 py-4 border-white text-white hover:bg-white/10"
            >
              Call Now
            </a>
            <a
              href="https://wa.me/447926136965"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-lg px-8 py-4 border-white text-white hover:bg-white/10"
            >
              WhatsApp
            </a>
          </div>
        </div>
        <p className="mt-6 text-sm text-gray-300">
          ✓ Insured ✓ Certified ✓ Premium Products
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

