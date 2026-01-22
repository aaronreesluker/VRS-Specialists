"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Google Review",
    location: "Brighton",
    service: "Interior Detailing",
    quote:
      "Great service from Kamil on the interior of my 2012 Audi A3.",
    rating: 5,
  },
  {
    name: "Google Review",
    location: "Brighton",
    service: "Regular Customer",
    quote:
      "I've been regular customer with all my car and motorcycle.",
    rating: 5,
  },
  {
    name: "Google Review",
    location: "Brighton",
    service: "Headlight Restoration",
    quote:
      "Very good attention to detail made my headlight look like brand new.",
    rating: 5,
  },
  {
    name: "Google Review",
    location: "Worthing",
    service: "Paint Correction",
    quote:
      "Outstanding paint correction work. My car looks better than when I bought it. Highly professional service.",
    rating: 5,
  },
  {
    name: "Google Review",
    location: "Brighton",
    service: "Ceramic Coating",
    quote:
      "The ceramic coating is incredible. Water just beads off and the car stays cleaner for much longer. Worth every penny.",
    rating: 5,
  },
  {
    name: "Google Review",
    location: "Hove",
    service: "Full Detailing",
    quote:
      "Exceptional attention to detail. They transformed my car inside and out. Would definitely use again.",
    rating: 5,
  },
  {
    name: "Google Review",
    location: "Brighton",
    service: "PPF Installation",
    quote:
      "Professional PPF installation on my front bumper. Invisible protection that's already saved me from stone chips.",
    rating: 5,
  },
  {
    name: "Google Review",
    location: "Shoreham",
    service: "Mobile Detailing",
    quote:
      "Convenient mobile service came to my home. Same high quality as the studio. Very impressed with the service.",
    rating: 5,
  },
];

export default function TestimonialsPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + itemsPerPage) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const visibleTestimonials = [];
  for (let i = 0; i < itemsPerPage; i++) {
    const index = (currentIndex + i) % testimonials.length;
    visibleTestimonials.push(testimonials[index]);
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + itemsPerPage) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - itemsPerPage + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 md:py-28 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" ref={ref}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span 
                className="text-4xl font-bold text-white"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                4.8
              </span>
              <div className="flex">
                {[...Array(5)].map((_, i) => {
                  if (i < 4) {
                    // Full stars (first 4)
                    return (
                  <svg
                    key={i}
                    className="w-6 h-6 text-yellow-400"
                        fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                    );
                  } else {
                    // 5th star - 70% filled (0.7 of 1.0)
                    return (
                      <svg
                        key={i}
                        className="w-6 h-6 text-yellow-400"
                        viewBox="0 0 20 20"
                        style={{ position: "relative" }}
                      >
                        <defs>
                          <linearGradient id="partialFill">
                            <stop offset="0%" stopColor="currentColor" />
                            <stop offset="80%" stopColor="currentColor" />
                            <stop offset="80%" stopColor="transparent" />
                            <stop offset="100%" stopColor="transparent" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          fill="url(#partialFill)"
                          stroke="currentColor"
                          strokeWidth="0.5"
                        />
                      </svg>
                    );
                  }
                })}
              </div>
            </div>
            <div className="text-left">
              <p 
                className="text-sm text-gray-400"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                Based on
              </p>
              <p 
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                104 Google Reviews
              </p>
            </div>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
            animate={isInView ? { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" } : { opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Client Reviews
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Trusted by vehicle enthusiasts across Brighton and Sussex.
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="relative mb-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {visibleTestimonials.map((testimonial, index) => (
            <div
                key={`${currentIndex}-${index}`}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 transition-opacity duration-500"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
                <p 
                  className="text-white mb-4 italic"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-white/20 pt-4">
                  <p 
                    className="font-semibold text-white"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    {testimonial.name}
                  </p>
                  <p 
                    className="text-sm text-gray-400"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                  {testimonial.location} • {testimonial.service}
                </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Carousel Dots and Arrows */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={goToPrev}
            className="text-white hover:text-gray-300 transition-all duration-200"
            aria-label="Previous reviews"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex gap-2 items-center">
          {Array.from({ length: Math.ceil(testimonials.length / itemsPerPage) }).map((_, index) => {
            const slideIndex = index * itemsPerPage;
            const isActive = Math.floor(currentIndex / itemsPerPage) === index;
            const isBeforeActive = index < Math.floor(currentIndex / itemsPerPage);
            const isAfterActive = index > Math.floor(currentIndex / itemsPerPage);
            
            // Active line: rectangle, non-active: parallelogram slanted toward active
            let clipPath = "none";
            
            if (isActive) {
              // Active line: straight rectangle
              clipPath = "none";
            } else if (isBeforeActive) {
              // Lines before active: parallelogram slanted right (toward active)
              // Top-left, top-right, bottom-right, bottom-left
              clipPath = "polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)";
            } else if (isAfterActive) {
              // Lines after active: parallelogram slanted left (toward active)
              // Top-left, top-right, bottom-right, bottom-left
              clipPath = "polygon(0% 0%, 80% 0%, 100% 100%, 20% 100%)";
            }
            
            return (
              <button
                key={index}
                onClick={() => goToSlide(slideIndex)}
                className={`transition-all duration-300 relative ${
                  isActive ? "bg-white h-1 w-8" : "bg-white/30 h-1 w-6"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                style={{ clipPath }}
              />
            );
          })}
            </div>
          
          <button
            onClick={goToNext}
            className="text-white hover:text-gray-300 transition-all duration-200"
            aria-label="Next reviews"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="text-center">
          <Link 
            href="/contact" 
            className="bg-white text-black px-6 py-3 rounded-full font-semibold text-center hover:bg-gray-100 transition-colors uppercase tracking-wider inline-block"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Get Your Free Quote
          </Link>
        </div>
      </div>
    </section>
  );
}

