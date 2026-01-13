"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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

  const textColor = isLight ? "text-black" : "text-white";
  const textColorSecondary = isLight ? "text-gray-700" : "text-gray-300";
  const pillBgActive = isLight ? "bg-brand-red text-white" : "bg-white text-black";
  const pillBgInactive = isLight ? "bg-white text-black border-2 border-black hover:border-brand-red hover:text-brand-red" : "bg-white/10 text-white border border-white/20 hover:bg-white/20";

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
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 ${
                selectedBrandIndex === index
                  ? pillBgActive
                  : pillBgInactive
              }`}
              style={{ 
                fontFamily: "var(--font-outfit), sans-serif",
                ...(isLight && selectedBrandIndex === index ? { backgroundColor: "var(--color-brand-red)" } : {})
              }}
              aria-label={`Filter by ${brandName}`}
              aria-pressed={selectedBrandIndex === index}
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
  // White background with black text and red accents
  const bgColor = isLight ? "bg-white" : "bg-black";
  const textColor = isLight ? "text-black" : "text-white";
  const textColorSecondary = isLight ? "text-gray-700" : "text-gray-300";
  const borderColor = isLight ? "border-gray-300" : "border-white/20";
  // Red accent for active pills
  const pillBgActive = isLight ? "bg-brand-red text-white" : "bg-white text-black";
  const pillBgInactive = isLight ? "bg-white text-black border-2 border-black hover:border-brand-red hover:text-brand-red" : "bg-white/10 text-white border border-white/20 hover:bg-white/20";
  const pillHover = isLight ? "hover:border-brand-red hover:text-brand-red" : "hover:bg-white/20";
  // When filtering by a specific brand (brands.length === 1), selectedBrandIndex should always be 0
  // Otherwise, use initialBrandIndex but clamp it to valid bounds
  const getEffectiveInitialIndex = () => {
    if (brands.length === 0) return 0;
    if (brands.length === 1) return 0;
    return Math.min(initialBrandIndex ?? 0, brands.length - 1);
  };
  
  const [selectedBrandIndex, setSelectedBrandIndex] = useState<number>(getEffectiveInitialIndex());
  
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

    // Pause all videos in the document to prevent videos playing across pagination
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach((video) => {
      video.pause();
      video.currentTime = 0; // Reset to beginning
    });

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.load();
    }
    // Reset to -1 (video) if project has video, otherwise 0 (first image)
    const currentPost = brands[selectedBrandIndex]?.examples?.[selectedExampleIndex];
    if (currentPost?.video) {
      setSelectedImageIndex(-1); // Start with video
    } else {
      setSelectedImageIndex(0); // Start with first image
    }
  }, [selectedBrandIndex, selectedExampleIndex, brands]);

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

    // Only auto-rotate if there are multiple images, no video, and we're viewing images (not video at -1)
    if (currentPost?.images && currentPost.images.length > 1 && !currentPost.video && selectedImageIndex >= 0) {
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
              .catch(() => {
                // Video autoplay prevented - user interaction required
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

  // Update selectedBrandIndex when brands or initialBrandIndex changes (from URL param)
  useEffect(() => {
    // When filtering by a specific brand, always use index 0
    // Otherwise, use initialBrandIndex but ensure it's within bounds
    let targetIndex = 0;
    if (brands.length === 0) {
      targetIndex = 0;
    } else if (brands.length === 1) {
      targetIndex = 0; // Always use index 0 when only one brand is shown
    } else {
      // Use initialBrandIndex but clamp to valid range
      targetIndex = Math.min(initialBrandIndex ?? 0, Math.max(0, brands.length - 1));
    }
    
    setSelectedBrandIndex(targetIndex);
    setSelectedExampleIndex(0); // Reset to first example when brand changes
  }, [initialBrandIndex, brands.length, brands]);

  // Handle fallback media selection
  useEffect(() => {
    if (brands && brands.length > 0) {
      const safeIndex = Math.min(selectedBrandIndex, brands.length - 1);
      const brand = brands[safeIndex];
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

  // Video event handlers
  const handleVideoPlay = () => {
    // Video started playing
  };

  const handleVideoPause = () => {
    // Video paused
  };

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

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;

      if (e.key === "Escape") {
        closeLightbox();
      } else if (lightboxMediaType === "image") {
        const brand = brands && brands.length > 0 ? brands[Math.min(selectedBrandIndex, brands.length - 1)] : null;
        const post = brand?.examples?.[selectedExampleIndex];
        if (post?.images && post.images.length > 1) {
          if (e.key === "ArrowLeft") {
            navigateLightboxImages("prev");
          } else if (e.key === "ArrowRight") {
            navigateLightboxImages("next");
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, lightboxMediaType, selectedBrandIndex, selectedExampleIndex, brands]);

  // Get current brand and example - ensure selectedBrandIndex is within bounds
  const safeSelectedBrandIndex = brands && brands.length > 0 
    ? Math.min(selectedBrandIndex, brands.length - 1)
    : 0;
  const currentBrand = brands && brands.length > 0 ? brands[safeSelectedBrandIndex] : null;
  
  if (!brands || brands.length === 0 || !currentBrand || !currentBrand.examples || currentBrand.examples.length === 0) {
    return (
      <section className={`py-20 md:py-28 bg-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-black">No brands available.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentPost = currentBrand.examples[selectedExampleIndex];
  const hasMedia = currentPost && (currentPost.video || (currentPost.images && currentPost.images.length > 0));
  
  // Lightbox navigation function - uses currentPost from closure
  const navigateLightboxImages = (direction: "prev" | "next") => {
    if (lightboxMediaType === "image" && currentPost?.images && currentPost.images.length > 1) {
      const totalImages = currentPost.images.length;
      const newIndex = direction === "next" 
        ? (lightboxImageIndex + 1) % totalImages
        : (lightboxImageIndex - 1 + totalImages) % totalImages;
      setLightboxImageIndex(newIndex);
      if (currentPost.images[newIndex]) {
        setLightboxMediaSrc(currentPost.images[newIndex]);
      }
    }
  };
  
  if (!hasMedia) {
    const anyWithMedia = currentBrand.examples.find(ex => ex.video || (ex.images && ex.images.length > 0));
    if (!anyWithMedia) {
      return (
        <section className="py-20 md:py-28 bg-white">
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
              isLight={true}
            />
            <div className="text-center">
              <p className="text-black">No media content available for this brand.</p>
            </div>
          </div>
        </section>
      );
    }
  }

  return (
    <section className="py-20 md:py-28 bg-white">
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
          isLight={true}
        />

        {/* Main Content - Video Player + Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 max-w-7xl mx-auto">
          {/* Left: Media Player - Video or Images - 50% */}
          <div className="relative lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full max-w-full bg-black rounded-2xl overflow-hidden shadow-2xl flex justify-center items-center group">
              {/* Video or Image */}
              {(() => {
                const hasVideo = !!currentPost?.video;
                const images = currentPost?.images || [];
                const hasImages = images.length > 0;
                
                // If project has both video and images, show video only when selectedImageIndex is -1
                // Otherwise show the selected image
                // If project has only video, show video
                // If project has only images, show images
                const shouldShowVideo = hasVideo && (!hasImages || selectedImageIndex === -1);
                
                if (shouldShowVideo) {
                  return (
                    <div 
                      className="relative w-full flex justify-center cursor-pointer"
                      onClick={() => openLightbox("video", currentPost.video!)}
                    >
                      <video
                        ref={videoRef}
                        key={`${selectedBrandIndex}-${selectedExampleIndex}`}
                        src={currentPost.video}
                        className="w-full h-auto max-h-[570px] md:max-h-[665px] lg:max-h-[760px] object-contain"
                        controls
                        playsInline
                        autoPlay
                        muted={isMuted}
                        loop
                        preload="metadata"
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPause}
                        onEnded={handleVideoPause}
                      >
                        Your browser does not support the video tag.
                      </video>
                      {/* 10% Black Overlay */}
                      <div className="absolute inset-0 bg-black/10 pointer-events-none z-[1]" />
                      
                      {/* Mute/Unmute Toggle Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent opening lightbox
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
                    </div>
                  );
                } else if (hasImages) {
                  const imageSrc = images[Math.min(Math.max(selectedImageIndex, 0), images.length - 1)] || images[0];
                  return (
                    <div 
                      className="relative w-full flex justify-center cursor-pointer"
                      onClick={() => {
                        openLightbox("image", imageSrc, selectedImageIndex);
                      }}
                    >
                      <Image
                        key={`${selectedBrandIndex}-${selectedExampleIndex}-${selectedImageIndex}`}
                        src={imageSrc}
                        alt={`${currentPost?.title || 'Project'} - Image ${selectedImageIndex + 1} of ${images.length}`}
                        width={1200}
                        height={800}
                        className="w-full h-auto max-h-[570px] md:max-h-[665px] lg:max-h-[760px] object-contain"
                        loading="lazy"
                        quality={90}
                      />
                      {/* 10% Black Overlay */}
                      <div className="absolute inset-0 bg-black/10 pointer-events-none z-[1]" />
                    </div>
                  );
                }
                return null;
              })()}
            </div>
            
            {/* Pagination and Click to Expand beneath media */}
            <div className="flex flex-col items-center gap-3 mt-4 w-full">
              {/* Pagination - for video + images or images only */}
              {(() => {
                const hasVideo = !!currentPost?.video;
                const images = currentPost?.images || [];
                const totalItems = hasVideo ? images.length + 1 : images.length; // +1 for video
                
                if (totalItems > 1) {
                  return (
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Pause auto-rotation when user manually navigates
                          if (imageRotationIntervalRef.current) {
                            clearInterval(imageRotationIntervalRef.current);
                            imageRotationIntervalRef.current = null;
                          }
                          setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1);
                        }}
                        className="text-gray-600 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Previous image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <div className="flex gap-2 items-center">
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
                              onClick={(e) => {
                                e.stopPropagation();
                                // Pause auto-rotation when user manually navigates
                                if (imageRotationIntervalRef.current) {
                                  clearInterval(imageRotationIntervalRef.current);
                                  imageRotationIntervalRef.current = null;
                                }
                                setSelectedImageIndex(index);
                              }}
                              className={`transition-all ${
                                isActive ? "bg-brand-red h-1 w-8" : "bg-gray-300 h-1 w-5"
                              } rounded-full hover:bg-gray-400`}
                              aria-label={`View image ${index + 1} of ${images.length}`}
                              style={{ clipPath }}
                            />
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Pause auto-rotation when user manually navigates
                          if (imageRotationIntervalRef.current) {
                            clearInterval(imageRotationIntervalRef.current);
                            imageRotationIntervalRef.current = null;
                          }
                          setSelectedImageIndex(selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0);
                        }}
                        className="text-gray-600 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Next image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      {/* Image counter */}
                      <span className="text-gray-600 text-xs ml-2"
                        style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                      >
                        {selectedImageIndex + 1} / {images.length}
                      </span>
                    </div>
                  );
                }
                return null;
              })()}
              
              {/* Subtle Click to Expand Prompt - Always visible below media */}
              <div className="bg-gray-100 border border-gray-300 text-black px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                Click to expand
              </div>
            </div>
          </div>

          {/* Right: Project Details - 50% */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <div className="flex items-start justify-between mb-3 gap-3">
              <h3 
                className="text-xl md:text-2xl lg:text-2xl font-bold text-black leading-tight"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                {currentPost?.title || "Project"}
              </h3>
              <span 
                className="bg-brand-red text-white text-[10px] md:text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                {currentBrand.brandName}
              </span>
            </div>

            {currentPost?.location && (
              <p 
                className="text-gray-700 mb-3 text-xs uppercase tracking-wider"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                {currentPost.location}
              </p>
            )}

            {currentPost?.duration && (
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span 
                  className="text-black text-xs font-semibold"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Duration: {currentPost.duration}
                </span>
              </div>
            )}

            {currentPost?.description && (
              <p 
                className="text-black mb-3 text-sm font-medium leading-relaxed"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                {currentPost.description}
              </p>
            )}

            {currentPost?.detailedDescription && (
              <p 
                className="text-gray-700 mb-6 text-xs leading-relaxed"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                {currentPost.detailedDescription}
              </p>
            )}

            {(currentPost?.techniques && currentPost.techniques.length > 0) || (currentPost?.results && currentPost.results.length > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {currentPost?.techniques && currentPost.techniques.length > 0 && (
                  <div>
                    <h4 
                      className="text-black text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                    >
                      Techniques Used
                    </h4>
                    <ul className="space-y-1.5">
                      {currentPost.techniques.map((technique, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <svg className="w-3.5 h-3.5 text-brand-red mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span 
                            className="text-gray-700 text-xs"
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
                      className="text-black text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
                    >
                      Results Achieved
                    </h4>
                    <ul className="space-y-1.5">
                      {currentPost.results.map((result, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <svg className="w-3.5 h-3.5 text-brand-red mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span 
                            className="text-gray-700 text-xs"
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

            {/* Tags */}
            {currentPost?.tags && currentPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {currentPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="border border-gray-300 text-black px-3 py-1 rounded-full text-xs hover:border-brand-red hover:text-brand-red transition-colors"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {currentPost?.galleryUrl && (
                <Link
                  href={currentPost.galleryUrl}
                  className="bg-brand-red text-white px-4 py-2 rounded-full font-semibold text-center hover:bg-red-700 transition-colors uppercase tracking-wider text-xs sm:text-sm"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  View job gallery
                </Link>
              )}
              {currentPost?.bookingUrl && (
                <Link
                  href={currentPost.bookingUrl}
                  className="border-2 border-brand-red text-brand-red px-4 py-2 rounded-full font-semibold text-center hover:bg-brand-red hover:text-white transition-colors uppercase tracking-wider text-xs sm:text-sm"
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
              onClick={() => {
                // Pause all videos before changing page
                const allVideos = document.querySelectorAll('video');
                allVideos.forEach((video) => {
                  video.pause();
                  video.currentTime = 0;
                });
                setSelectedExampleIndex(selectedExampleIndex > 0 ? selectedExampleIndex - 1 : currentBrand.examples.length - 1);
              }}
              className="text-black hover:text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
                
                // Active line: rectangle, non-active: parallelogram slanted toward active
                let clipPath = "none";
                
                if (isActive) {
                  // Active line: straight rectangle
                  clipPath = "none";
                } else if (isBeforeActive) {
                  // Lines before active: parallelogram slanted right (toward active)
                  clipPath = "polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)";
                } else if (isAfterActive) {
                  // Lines after active: parallelogram slanted left (toward active)
                  clipPath = "polygon(0% 0%, 80% 0%, 100% 100%, 20% 100%)";
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      // Pause all videos before changing page
                      const allVideos = document.querySelectorAll('video');
                      allVideos.forEach((video) => {
                        video.pause();
                        video.currentTime = 0;
                      });
                      setSelectedExampleIndex(index);
                    }}
                    className={`transition-all ${
                      isActive ? "bg-brand-red h-1 w-8" : "bg-gray-300 h-1 w-6"
                    }`}
                    aria-label={`View project ${index + 1} of ${currentBrand.brandName}`}
                    style={{ clipPath }}
                  />
                );
              })}
            </div>
            
            <button
              onClick={() => {
                // Pause all videos before changing page
                const allVideos = document.querySelectorAll('video');
                allVideos.forEach((video) => {
                  video.pause();
                  video.currentTime = 0;
                });
                setSelectedExampleIndex(selectedExampleIndex < currentBrand.examples.length - 1 ? selectedExampleIndex + 1 : 0);
              }}
              className="text-black hover:text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
                  <Image
                    src={lightboxMediaSrc}
                    alt={`${currentPost?.title || 'Project'} - Image ${lightboxImageIndex + 1} of ${currentPost?.images?.length}`}
                    width={1920}
                    height={1080}
                    className="max-w-full max-h-full object-contain"
                    quality={95}
                    priority
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

