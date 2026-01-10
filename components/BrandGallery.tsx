"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BrandGroup } from "@/lib/brandData";

interface BrandGalleryProps {
  brands: BrandGroup[];
  allBrands?: BrandGroup[]; // All brands for navigation (when filtered)
  initialBrandIndex?: number; // Initial selected brand index
  onBrandClick?: (brandIndex: number) => void; // Callback for brand selection
  title?: string;
  subtitle?: string;
  variant?: "dark" | "light"; // Background variant
}

// Animated section header component
function AnimatedSectionHeader({
  title,
  subtitle,
  brandNames,
  selectedBrandIndex,
  onBrandClick,
  isLight = false,
}: {
  title: string;
  subtitle?: string;
  brandNames: string[];
  selectedBrandIndex: number;
  onBrandClick: (index: number) => void;
  isLight?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const textColor = isLight ? "text-dark-900" : "text-white";
  const textColorSecondary = isLight ? "text-dark-700" : "text-gray-300";
  const pillBgActive = isLight ? "bg-dark-900 text-white" : "bg-white text-black";
  const pillBgInactive = isLight ? "bg-dark-100 text-dark-900 border border-dark-300 hover:bg-dark-200" : "bg-white/10 text-white border border-white/20 hover:bg-white/20";

  return (
    <div className="text-center mb-12" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
        animate={isInView ? { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" } : { opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`text-4xl md:text-5xl font-bold mb-6 ${textColor}`}
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      >
        {title}
      </motion.h2>
      
      {/* Brand Filter Pills */}
      {brandNames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {brandNames.map((brandName, index) => (
            <button
              key={index}
              onClick={() => onBrandClick(index)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                selectedBrandIndex === index
                  ? pillBgActive
                  : pillBgInactive
              }`}
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              {brandName}
            </button>
          ))}
        </motion.div>
      )}
      
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className={`text-lg ${textColorSecondary} max-w-2xl mx-auto`}
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

export function BrandGallery({
  brands,
  allBrands,
  initialBrandIndex = 0,
  onBrandClick,
  title = "Work by Brand",
  subtitle = "Explore our work across different luxury car brands",
  variant = "dark",
}: BrandGalleryProps) {
  const isLight = variant === "light";
  const bgColor = isLight ? "bg-white" : "bg-black";
  const textColor = isLight ? "text-dark-900" : "text-white";
  const textColorSecondary = isLight ? "text-dark-700" : "text-gray-300";
  const borderColor = isLight ? "border-dark-200" : "border-white/20";
  const pillBgActive = isLight ? "bg-dark-900 text-white" : "bg-white text-black";
  const pillBgInactive = isLight ? "bg-dark-100 text-dark-900 border border-dark-300" : "bg-white/10 text-white border border-white/20";
  const pillHover = isLight ? "hover:bg-dark-200" : "hover:bg-white/20";
  const [selectedBrandIndex, setSelectedBrandIndex] = useState<number>(initialBrandIndex);
  
  // Use allBrands for navigation if provided, otherwise use brands
  const navigationBrands = allBrands || brands;
  
  // When using allBrands for navigation, we need to find the current brand index in the navigation list
  const currentBrandInNavigation = useMemo(() => {
    if (allBrands && brands.length === 1) {
      // We're showing a filtered brand, find its index in allBrands
      const currentBrandName = brands[0]?.brandName;
      return allBrands.findIndex(b => b.brandName === currentBrandName);
    }
    return selectedBrandIndex;
  }, [allBrands, brands, selectedBrandIndex]);
  
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number>(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxMediaType, setLightboxMediaType] = useState<"image" | "video" | null>(null);
  const [lightboxMediaSrc, setLightboxMediaSrc] = useState<string | null>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lightboxVideoRef = useRef<HTMLVideoElement>(null);
  const imageRotationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset video and image index when switching examples
  useEffect(() => {
    if (imageRotationIntervalRef.current) {
      clearInterval(imageRotationIntervalRef.current);
      imageRotationIntervalRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.load();
    }
    setSelectedImageIndex(0);
  }, [selectedBrandIndex, selectedExampleIndex]);

  // Auto-rotate through images if project has multiple images
  useEffect(() => {
    if (!brands || brands.length === 0) return;
    
    const brand = brands[selectedBrandIndex];
    if (!brand?.examples) return;
    
    const currentPost = brand.examples[selectedExampleIndex];
    
    if (imageRotationIntervalRef.current) {
      clearInterval(imageRotationIntervalRef.current);
      imageRotationIntervalRef.current = null;
    }

    if (currentPost?.images && currentPost.images.length > 1 && !currentPost.video) {
      imageRotationIntervalRef.current = setInterval(() => {
        setSelectedImageIndex((prev) => {
          return (prev + 1) % currentPost.images!.length;
        });
      }, 3000);
    }

    return () => {
      if (imageRotationIntervalRef.current) {
        clearInterval(imageRotationIntervalRef.current);
        imageRotationIntervalRef.current = null;
      }
    };
  }, [selectedBrandIndex, selectedExampleIndex, brands]);

  // Auto-play video when switching to a project with a video
  useEffect(() => {
    if (!brands || brands.length === 0) return;
    
    const brand = brands[selectedBrandIndex];
    if (!brand?.examples) return;
    
    const currentPost = brand.examples[selectedExampleIndex];
    
    if (videoRef.current && currentPost?.video) {
      videoRef.current.muted = isMuted;
      
      const timeoutId = setTimeout(() => {
        if (videoRef.current && currentPost?.video) {
          videoRef.current.load();
          const playPromise = videoRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // Video started playing
              })
              .catch((error) => {
                console.log("Video autoplay prevented:", error);
              });
          }
        }
      }, 300);

      return () => {
        clearTimeout(timeoutId);
        if (videoRef.current) {
          videoRef.current.pause();
        }
      };
    }
  }, [selectedBrandIndex, selectedExampleIndex, isMuted, brands]);

  // Update selectedBrandIndex when initialBrandIndex changes (from URL param)
  useEffect(() => {
    if (initialBrandIndex !== undefined && initialBrandIndex !== selectedBrandIndex) {
      setSelectedBrandIndex(initialBrandIndex);
      setSelectedExampleIndex(0); // Reset to first example when brand changes
    }
  }, [initialBrandIndex]);

  // Handle fallback media selection
  useEffect(() => {
    if (brands && brands.length > 0) {
      const brand = brands[selectedBrandIndex];
      if (brand && brand.examples && brand.examples.length > 0) {
        const currentPost = brand.examples[selectedExampleIndex];
        if (!currentPost || (!currentPost.video && (!currentPost.images || currentPost.images.length === 0))) {
          const firstWithMediaIndex = brand.examples.findIndex(ex => ex.video || (ex.images && ex.images.length > 0));
          if (firstWithMediaIndex !== -1 && firstWithMediaIndex !== selectedExampleIndex) {
            setSelectedExampleIndex(firstWithMediaIndex);
          }
        }
      }
    }
  }, [selectedBrandIndex, selectedExampleIndex, brands]);

  // Get current brand and example
  const currentBrand = brands && brands.length > 0 ? brands[selectedBrandIndex] : null;
  
  if (!brands || brands.length === 0 || !currentBrand || !currentBrand.examples || currentBrand.examples.length === 0) {
    return (
      <section className={`py-20 md:py-28 ${bgColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className={textColor}>No brands available.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentPost = currentBrand.examples[selectedExampleIndex];
  const hasMedia = currentPost && (currentPost.video || (currentPost.images && currentPost.images.length > 0));
  
  if (!hasMedia) {
    const anyWithMedia = currentBrand.examples.find(ex => ex.video || (ex.images && ex.images.length > 0));
    if (!anyWithMedia) {
      return (
        <section className={`py-20 md:py-28 ${bgColor}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSectionHeader
              title={title}
              subtitle={subtitle}
              brandNames={brands.map((brand) => brand.brandName)}
              selectedBrandIndex={selectedBrandIndex}
              onBrandClick={(index) => {
                setSelectedBrandIndex(index);
                setSelectedExampleIndex(0);
              }}
              isLight={isLight}
            />
            <div className="text-center">
              <p className={textColor}>No media content available for this brand.</p>
            </div>
          </div>
        </section>
      );
    }
  }

  // Lightbox functions
  const openLightbox = (type: "image" | "video", src: string, imageIndex: number = 0) => {
    setIsLightboxOpen(true);
    setLightboxMediaType(type);
    setLightboxMediaSrc(src);
    setLightboxImageIndex(imageIndex);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxMediaType(null);
    setLightboxMediaSrc(null);
    setLightboxImageIndex(0);
    document.body.style.overflow = '';
    if (lightboxVideoRef.current) {
      lightboxVideoRef.current.pause();
    }
  };

  const navigateLightboxImages = (direction: "prev" | "next") => {
    if (lightboxMediaType === "image" && currentPost?.images && currentPost.images.length > 1) {
      const totalImages = currentPost.images.length;
      setLightboxImageIndex((prevIndex) => {
        if (direction === "next") {
          return (prevIndex + 1) % totalImages;
        } else {
          return (prevIndex - 1 + totalImages) % totalImages;
        }
      });
      setLightboxMediaSrc(currentPost.images[(lightboxImageIndex + (direction === "next" ? 1 : -1) + totalImages) % totalImages]);
    }
  };

  const brandNames = brands.map((brand) => brand.brandName);

  return (
    <section className={`py-20 md:py-28 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSectionHeader
          title={title}
          subtitle={subtitle}
          brandNames={navigationBrands.map((brand) => brand.brandName)}
          selectedBrandIndex={currentBrandInNavigation}
          onBrandClick={(index) => {
            if (onBrandClick) {
              // If callback provided, use it (for URL navigation)
              onBrandClick(index);
            } else {
              // Otherwise, just update local state
              setSelectedBrandIndex(index);
              setSelectedExampleIndex(0);
            }
          }}
          isLight={isLight}
        />

        {/* Main Content - Video Player + Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 max-w-6xl mx-auto">
          {/* Left: Media Player */}
          <div className="relative lg:col-span-4 flex flex-col items-center">
            <div className="relative w-full max-w-[300px] bg-black rounded-2xl overflow-hidden shadow-2xl flex justify-center items-center">
              {currentPost?.video ? (
                <div 
                  className="relative w-full flex justify-center cursor-pointer"
                  onClick={() => openLightbox("video", currentPost.video!)}
                >
                  <video
                    ref={videoRef}
                    key={`${selectedBrandIndex}-${selectedExampleIndex}`}
                    src={currentPost.video}
                    className="w-auto h-auto max-w-full max-h-[400px] object-contain"
                    controls
                    playsInline
                    autoPlay
                    muted={isMuted}
                    loop
                  >
                    Your browser does not support the video tag.
                  </video>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                      if (videoRef.current) {
                        videoRef.current.muted = !isMuted;
                      }
                    }}
                    className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors z-10"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    )}
                  </button>
                  <div className="absolute inset-0 bg-black/10 pointer-events-none z-[1]"></div>
                </div>
              ) : (() => {
                const images = currentPost?.images;
                if (!images || images.length === 0) return null;
                const imageSrc = images[Math.min(selectedImageIndex, images.length - 1)] || images[0];
                return (
                  <div 
                    className="relative w-full flex justify-center cursor-pointer"
                    onClick={() => {
                      openLightbox("image", imageSrc, selectedImageIndex);
                    }}
                  >
                    <img
                      key={`${selectedBrandIndex}-${selectedExampleIndex}-${selectedImageIndex}`}
                      src={imageSrc}
                      alt={`${currentPost?.title || 'Project'} - Image ${selectedImageIndex + 1} of ${images.length}`}
                      className="w-auto h-auto max-w-full max-h-[400px] object-contain"
                    />
                    <div className="absolute inset-0 bg-black/10 pointer-events-none z-[1]"></div>
                  </div>
                );
              })()}
            </div>
            
            {/* Smaller pagination for images within project */}
            {currentPost?.images && currentPost.images.length > 1 && (() => {
              const images = currentPost.images;
              return (
                <div className="flex justify-center items-center gap-2 mt-3">
                  <button
                    onClick={() => {
                      if (imageRotationIntervalRef.current) {
                        clearInterval(imageRotationIntervalRef.current);
                        imageRotationIntervalRef.current = null;
                      }
                      setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1);
                    }}
                  className={`${textColor} hover:opacity-70 transition-colors`}
                  aria-label="Previous image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                  <div className="flex gap-1.5 items-center">
                    {images.map((_, index) => {
                    const isActive = selectedImageIndex === index;
                    const isBeforeActive = index < selectedImageIndex;
                    const isAfterActive = index > selectedImageIndex;
                    
                    let clipPath = "none";
                    if (isActive) {
                      clipPath = "none";
                    } else if (isBeforeActive) {
                      clipPath = "polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)";
                    } else if (isAfterActive) {
                      clipPath = "polygon(0% 0%, 80% 0%, 100% 100%, 20% 100%)";
                    }
                    
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (imageRotationIntervalRef.current) {
                            clearInterval(imageRotationIntervalRef.current);
                            imageRotationIntervalRef.current = null;
                          }
                          setSelectedImageIndex(index);
                        }}
                        className={`transition-all ${
                          isActive ? (isLight ? "bg-dark-900 h-0.5 w-6" : "bg-white h-0.5 w-6") : (isLight ? "bg-dark-300 h-0.5 w-4" : "bg-white/30 h-0.5 w-4")
                        }`}
                        style={{ clipPath }}
                      />
                    );
                  })}
                </div>
                
                <button
                  onClick={() => {
                    if (imageRotationIntervalRef.current) {
                      clearInterval(imageRotationIntervalRef.current);
                      imageRotationIntervalRef.current = null;
                    }
                      setSelectedImageIndex(selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0);
                    }}
                    className={`${textColor} hover:opacity-70 transition-colors`}
                    aria-label="Next image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              );
            })()}
          </div>

          {/* Right: Project Details */}
          <div className="flex flex-col justify-center lg:col-span-8">
            <div className="flex items-start justify-between mb-4">
              <h3 
                className={`text-3xl md:text-4xl font-bold ${textColor}`}
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                {currentPost?.title || "Project"}
              </h3>
              <span 
                className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ml-4"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                {currentBrand.brandName}
              </span>
            </div>

            {currentPost?.location && (
              <p 
                className={`${textColorSecondary} mb-4 text-sm uppercase tracking-wider`}
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                {currentPost.location}
              </p>
            )}

            {currentPost?.duration && (
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span 
                  className={`${textColor} text-sm font-semibold`}
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Duration: {currentPost.duration}
                </span>
              </div>
            )}

            {currentPost?.description && (
              <p 
                className={`${textColor} mb-4 text-lg font-semibold leading-relaxed`}
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                {currentPost.description}
              </p>
            )}

            {currentPost?.detailedDescription && (
              <p 
                className={`${textColorSecondary} mb-6 text-base leading-relaxed`}
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                {currentPost.detailedDescription}
              </p>
            )}

            {(currentPost?.techniques && currentPost.techniques.length > 0) || (currentPost?.results && currentPost.results.length > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {currentPost?.techniques && currentPost.techniques.length > 0 && (
                  <div>
                    <h4 
                      className={`${textColor} text-sm font-semibold uppercase tracking-wider mb-3`}
                      style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                    >
                      Techniques Used
                    </h4>
                    <ul className="space-y-2">
                      {currentPost.techniques.map((technique, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-brand-red mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span 
                            className={`${textColorSecondary} text-sm`}
                            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                          >
                            {technique}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentPost?.results && currentPost.results.length > 0 && (
                  <div>
                    <h4 
                      className={`${textColor} text-sm font-semibold uppercase tracking-wider mb-3`}
                      style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                    >
                      Results Achieved
                    </h4>
                    <ul className="space-y-2">
                      {currentPost.results.map((result, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-brand-red mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span 
                            className={`${textColorSecondary} text-sm`}
                            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                          >
                            {result}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            {currentPost?.tags && currentPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-8">
                {currentPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`${isLight ? "border-dark-300 text-dark-900" : "border-white/30 text-white"} px-4 py-2 rounded-full text-sm`}
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              {currentPost?.galleryUrl && (
                <Link
                  href={currentPost.galleryUrl}
                  className={`${isLight ? "bg-dark-900 text-white hover:bg-dark-800" : "bg-white text-black hover:bg-gray-100"} px-6 py-3 rounded-full font-semibold text-center transition-colors uppercase tracking-wider`}
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  View job gallery
                </Link>
              )}
              {currentPost?.bookingUrl && (
                <Link
                  href={currentPost.bookingUrl}
                  className={`border-2 ${isLight ? "border-dark-900 text-dark-900 hover:bg-dark-50" : "border-white text-white hover:bg-white/10"} px-6 py-3 rounded-full font-semibold text-center transition-colors uppercase tracking-wider`}
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Book this package
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Pagination - Projects within current brand */}
        {currentBrand.examples.length > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setSelectedExampleIndex(selectedExampleIndex > 0 ? selectedExampleIndex - 1 : currentBrand.examples.length - 1)}
              className={`${textColor} hover:opacity-70 transition-colors`}
              aria-label="Previous project"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex gap-2 items-center">
              {currentBrand.examples.map((_, index) => {
                const isActive = selectedExampleIndex === index;
                const isBeforeActive = index < selectedExampleIndex;
                const isAfterActive = index > selectedExampleIndex;
                
                let clipPath = "none";
                if (isActive) {
                  clipPath = "none";
                } else if (isBeforeActive) {
                  clipPath = "polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)";
                } else if (isAfterActive) {
                  clipPath = "polygon(0% 0%, 80% 0%, 100% 100%, 20% 100%)";
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedExampleIndex(index)}
                        className={`transition-all ${
                          isActive ? (isLight ? "bg-dark-900 h-1 w-8" : "bg-white h-1 w-8") : (isLight ? "bg-dark-300 h-1 w-6" : "bg-white/30 h-1 w-6")
                        }`}
                    style={{ clipPath }}
                  />
                );
              })}
            </div>
            
            <button
              onClick={() => setSelectedExampleIndex(selectedExampleIndex < currentBrand.examples.length - 1 ? selectedExampleIndex + 1 : 0)}
              className={`${textColor} hover:opacity-70 transition-colors`}
              aria-label="Next project"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && lightboxMediaSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
              onClick={closeLightbox}
              aria-label="Close"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              {lightboxMediaType === "image" && (
                <>
                  <img
                    src={lightboxMediaSrc}
                    alt={`${currentPost?.title || 'Project'} - Image ${lightboxImageIndex + 1} of ${currentPost?.images?.length}`}
                    className="max-w-full max-h-full object-contain"
                  />
                  {currentPost?.images && currentPost.images.length > 1 && (
                    <>
                      <button
                        className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10 p-2 rounded-full bg-black/50"
                        onClick={() => navigateLightboxImages("prev")}
                        aria-label="Previous image"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10 p-2 rounded-full bg-black/50"
                        onClick={() => navigateLightboxImages("next")}
                        aria-label="Next image"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <div className="absolute bottom-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                        {lightboxImageIndex + 1} / {currentPost.images.length}
                      </div>
                    </>
                  )}
                </>
              )}
              {lightboxMediaType === "video" && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={lightboxVideoRef}
                    src={lightboxMediaSrc}
                    className="max-w-full max-h-full object-contain"
                    controls
                    autoPlay
                    muted={isMuted}
                    loop
                  >
                    Your browser does not support the video tag.
                  </video>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                      if (lightboxVideoRef.current) {
                        lightboxVideoRef.current.muted = !isMuted;
                      }
                    }}
                    className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors z-10"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                  >
                    {isMuted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

