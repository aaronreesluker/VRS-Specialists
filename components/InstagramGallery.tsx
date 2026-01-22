"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

/**
 * InstagramGallery Component
 * 
 * Displays Instagram videos in a modern, dark-themed layout with video player and service details.
 * 
 * USAGE:
 * For local videos: Pass objects with video path and service details
 * 
 * Example:
 * posts={[
 *   { 
 *     video: "/videos/instagram/post1.mp4", 
 *     title: "Full Correction & Coating",
 *     location: "WORTHING, WEST SUSSEX",
 *     description: "Two-stage machine polish, 2-year ceramic coating, full interior detox.",
 *     tags: ["Paint correction", "Ceramic coating", "Premium package"],
 *     likes: 1373,
 *     instagramUrl: "https://www.instagram.com/p/..."
 *   },
 * ]}
 */

interface InstagramPost {
  video?: string; // Path to local video file
  images?: string[]; // Array of image paths for projects with multiple images
  title?: string; // Service title
  location?: string; // Location text
  description?: string; // Service description
  detailedDescription?: string; // Extended detailed description
  duration?: string; // Estimated duration
  techniques?: string[]; // Techniques used
  results?: string[]; // Key results achieved
  tags?: string[]; // Array of tag strings
  caption?: string; // Video caption (legacy)
  likes?: number;
  instagramUrl?: string; // For Instagram embed
  galleryUrl?: string; // Link to job gallery
  bookingUrl?: string; // Link to booking page
}

interface ServiceGroup {
  serviceName: string; // Name of the service (e.g., "Car Detailing", "Paint Correction", "Specials")
  examples: InstagramPost[]; // Multiple examples for this service
}

interface InstagramGalleryProps {
  services: ServiceGroup[]; // Array of service groups, each with multiple examples
  title?: string;
  subtitle?: string;
}

// Animated section header component
function AnimatedSectionHeader({
  title,
  subtitle,
  serviceNames,
  selectedServiceIndex,
  onServiceClick,
}: {
  title: string;
  subtitle?: string;
  serviceNames: string[];
  selectedServiceIndex: number;
  onServiceClick: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div className="text-center mb-12" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
        animate={isInView ? { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" } : { opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold mb-6 text-white"
        style={{ fontFamily: "var(--font-outfit), sans-serif" }}
      >
        {title}
      </motion.h2>
      
      {/* Service Filter Pills */}
      {serviceNames.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {serviceNames.map((serviceName, index) => (
            <button
              key={index}
              onClick={() => onServiceClick(index)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black ${
                selectedServiceIndex === index
                  ? "bg-white text-black"
                  : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
              }`}
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              aria-label={`Filter by ${serviceName}`}
              aria-pressed={selectedServiceIndex === index}
            >
              {serviceName}
            </button>
          ))}
        </motion.div>
      )}
      
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="text-lg text-gray-300 max-w-2xl mx-auto"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

export function InstagramGallery({
  services,
  title = "Our Latest Work",
  subtitle = "See our latest transformations on Instagram",
}: InstagramGalleryProps) {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number>(0);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number>(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0); // For projects with multiple images
  const [isMuted, setIsMuted] = useState<boolean>(true); // Videos start muted
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxMediaType, setLightboxMediaType] = useState<"image" | "video" | null>(null);
  const [lightboxMediaSrc, setLightboxMediaSrc] = useState<string | null>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lightboxVideoRef = useRef<HTMLVideoElement>(null);
  const imageRotationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset video and image index when switching examples
  useEffect(() => {
    // Clear any existing image rotation interval
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
      videoRef.current.load(); // Reload video to ensure it starts from beginning
    }
    // Reset to -1 (video) if project has video, otherwise 0 (first image)
    const currentPost = services[selectedServiceIndex]?.examples?.[selectedExampleIndex];
    if (currentPost?.video) {
      setSelectedImageIndex(-1); // Start with video
    } else {
      setSelectedImageIndex(0); // Start with first image
    }
  }, [selectedServiceIndex, selectedExampleIndex, services]);

  // Auto-rotate through images if project has multiple images
  useEffect(() => {
    if (!services || services.length === 0) return;
    
    const service = services[selectedServiceIndex];
    if (!service?.examples) return;
    
    const currentPost = service.examples[selectedExampleIndex];
    
    // Clear any existing interval
    if (imageRotationIntervalRef.current) {
      clearInterval(imageRotationIntervalRef.current);
      imageRotationIntervalRef.current = null;
    }

    // Only auto-rotate if there are multiple images and no video
    if (currentPost?.images && currentPost.images.length > 1 && !currentPost.video) {
      const images = currentPost.images; // Store in variable for TypeScript narrowing
      imageRotationIntervalRef.current = setInterval(() => {
        setSelectedImageIndex((prev) => {
          return (prev + 1) % images.length;
        });
      }, 3000); // Rotate every 3 seconds
    }

    return () => {
      if (imageRotationIntervalRef.current) {
        clearInterval(imageRotationIntervalRef.current);
        imageRotationIntervalRef.current = null;
      }
    };
  }, [selectedServiceIndex, selectedExampleIndex, services]);

  // Auto-play video when switching to a project with a video
  useEffect(() => {
    if (!services || services.length === 0) return;
    
    const service = services[selectedServiceIndex];
    if (!service?.examples) return;
    
    const currentPost = service.examples[selectedExampleIndex];
    
    if (videoRef.current && currentPost?.video) {
      // Set muted state first
      videoRef.current.muted = isMuted;
      
      // Wait a moment for the video to load, then play
      const timeoutId = setTimeout(() => {
        if (videoRef.current && currentPost?.video) {
          videoRef.current.load(); // Ensure video is loaded
          const playPromise = videoRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // Video started playing
                setPlayingVideo(selectedServiceIndex);
              })
              .catch(() => {
                // Auto-play was prevented, user interaction required
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
  }, [selectedServiceIndex, selectedExampleIndex, isMuted, services]);

  // Handle video play
  const handleVideoPlay = () => {
    setPlayingVideo(selectedServiceIndex);
  };

  // Handle video pause
  const handleVideoPause = () => {
    setPlayingVideo(null);
  };

  // Handle manual image navigation
  const goToNextImage = () => {
    const currentPost = services[selectedServiceIndex]?.examples?.[selectedExampleIndex];
    const images = currentPost?.images;
    if (images && images.length > 1) {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
      if (imageRotationIntervalRef.current) {
        clearInterval(imageRotationIntervalRef.current);
        imageRotationIntervalRef.current = null;
      }
    }
  };

  const goToPrevImage = () => {
    const currentPost = services[selectedServiceIndex]?.examples?.[selectedExampleIndex];
    const images = currentPost?.images;
    if (images && images.length > 1) {
      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
      if (imageRotationIntervalRef.current) {
        clearInterval(imageRotationIntervalRef.current);
        imageRotationIntervalRef.current = null;
      }
    }
  };

  // Lightbox handlers
  const openLightbox = (type: "image" | "video", src: string, imageIndex?: number) => {
    setLightboxMediaType(type);
    setLightboxMediaSrc(src);
    if (imageIndex !== undefined) {
      setLightboxImageIndex(imageIndex);
    }
    setIsLightboxOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxMediaType(null);
    setLightboxMediaSrc(null);
    document.body.style.overflow = ""; // Restore scrolling
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
        const currentPost = services[selectedServiceIndex]?.examples?.[selectedExampleIndex];
        if (currentPost?.images && currentPost.images.length > 1) {
          if (e.key === "ArrowLeft") {
            goToPrevLightboxImage();
          } else if (e.key === "ArrowRight") {
            goToNextLightboxImage();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, lightboxMediaType, selectedServiceIndex, selectedExampleIndex, services]);

  // Lightbox image navigation
  const goToNextLightboxImage = () => {
    const currentPost = services[selectedServiceIndex]?.examples?.[selectedExampleIndex];
    const images = currentPost?.images;
    if (images && images.length > 1) {
      const nextIndex = (lightboxImageIndex + 1) % images.length;
      setLightboxImageIndex(nextIndex);
      setLightboxMediaSrc(images[nextIndex]);
    }
  };

  const goToPrevLightboxImage = () => {
    const currentPost = services[selectedServiceIndex]?.examples?.[selectedExampleIndex];
    const images = currentPost?.images;
    if (images && images.length > 1) {
      const prevIndex = (lightboxImageIndex - 1 + images.length) % images.length;
      setLightboxImageIndex(prevIndex);
      setLightboxMediaSrc(images[prevIndex]);
    }
  };

  // Get current service and example
  const currentService = services && services.length > 0 ? services[selectedServiceIndex] : null;
  
  // Ensure we have a valid service
  if (!services || services.length === 0 || !currentService || !currentService.examples || currentService.examples.length === 0) {
    return (
      <section className="py-20 md:py-28 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-white">No services available.</p>
          </div>
        </div>
      </section>
    );
  }

  // Use useEffect to handle fallback media selection if current post has no media
  useEffect(() => {
    if (currentService && currentService.examples && currentService.examples.length > 0) {
      const currentPost = currentService.examples[selectedExampleIndex];
      if (!currentPost || (!currentPost.video && (!currentPost.images || currentPost.images.length === 0))) {
        const firstWithMediaIndex = currentService.examples.findIndex(ex => ex.video || (ex.images && ex.images.length > 0));
        if (firstWithMediaIndex !== -1 && firstWithMediaIndex !== selectedExampleIndex) {
          setSelectedExampleIndex(firstWithMediaIndex);
        }
      }
    }
  }, [selectedServiceIndex, selectedExampleIndex, services]);

  // Get the current post - after useEffect may have updated the index
  const currentPost = currentService.examples[selectedExampleIndex];

  // Check if we have valid media (video or images) - but don't return early if we can find another example
  const hasMedia = currentPost && (currentPost.video || (currentPost.images && currentPost.images.length > 0));
  
  if (!hasMedia) {
    // Try to find any example with media in this service
    const anyWithMedia = currentService.examples.find(ex => ex.video || (ex.images && ex.images.length > 0));
    if (!anyWithMedia) {
      return (
        <section className="py-20 md:py-28 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSectionHeader
              title={title}
              subtitle={subtitle}
              serviceNames={services.map((service) => service.serviceName)}
              selectedServiceIndex={selectedServiceIndex}
              onServiceClick={(index) => {
                setSelectedServiceIndex(index);
                setSelectedExampleIndex(0);
              }}
            />
            <div className="text-center">
              <p className="text-white">No media content available for this service.</p>
            </div>
          </div>
        </section>
      );
    }
    // If we found media in another example, the useEffect will handle switching to it
  }

  // Handle service pill click
  const handleServiceClick = (serviceIndex: number) => {
    setSelectedServiceIndex(serviceIndex);
    setSelectedExampleIndex(0); // Reset to first example when switching services
  };

  // Service names for filter pills
  const serviceNames = services.map((service) => service.serviceName);

  return (
    <section className="py-20 md:py-28 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSectionHeader
          title={title}
          subtitle={subtitle}
          serviceNames={serviceNames}
          selectedServiceIndex={selectedServiceIndex}
          onServiceClick={handleServiceClick}
        />

        {/* Main Content - Video Player + Service Details */}
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
                        key={`${selectedServiceIndex}-${selectedExampleIndex}`}
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
                        key={`${selectedServiceIndex}-${selectedExampleIndex}-${selectedImageIndex}`}
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
                const hasImages = images.length > 0;
                const totalItems = hasVideo ? images.length + 1 : images.length; // +1 for video
                
                if (totalItems > 1) {
                  return (
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Pause all videos and auto-rotation when user manually navigates
                          const allVideos = document.querySelectorAll('video');
                          allVideos.forEach((video) => {
                            video.pause();
                            video.currentTime = 0;
                          });
                          if (imageRotationIntervalRef.current) {
                            clearInterval(imageRotationIntervalRef.current);
                            imageRotationIntervalRef.current = null;
                          }
                          // Calculate previous index accounting for video at -1
                          if (selectedImageIndex === -1) {
                            setSelectedImageIndex(images.length - 1);
                          } else if (selectedImageIndex === 0) {
                            setSelectedImageIndex(hasVideo ? -1 : images.length - 1);
                          } else {
                            setSelectedImageIndex(selectedImageIndex - 1);
                          }
                        }}
                        className="text-white/70 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Previous"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <div className="flex gap-2 items-center">
                        {/* Video pagination dot (if video exists) */}
                        {hasVideo && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const allVideos = document.querySelectorAll('video');
                              allVideos.forEach((video) => {
                                video.pause();
                                video.currentTime = 0;
                              });
                              if (imageRotationIntervalRef.current) {
                                clearInterval(imageRotationIntervalRef.current);
                                imageRotationIntervalRef.current = null;
                              }
                              setSelectedImageIndex(-1);
                            }}
                            className={`transition-all ${
                              selectedImageIndex === -1 ? "bg-white h-1 w-8" : "bg-white/40 h-1 w-5"
                            } rounded-full hover:bg-white/60`}
                            aria-label="View video"
                          />
                        )}
                        
                        {/* Image pagination dots */}
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
                                // Pause all videos when switching to image
                                const allVideos = document.querySelectorAll('video');
                                allVideos.forEach((video) => {
                                  video.pause();
                                  video.currentTime = 0;
                                });
                                if (imageRotationIntervalRef.current) {
                                  clearInterval(imageRotationIntervalRef.current);
                                  imageRotationIntervalRef.current = null;
                                }
                                setSelectedImageIndex(index);
                              }}
                              className={`transition-all ${
                                isActive ? "bg-white h-1 w-8" : "bg-white/40 h-1 w-5"
                              } rounded-full hover:bg-white/60`}
                              aria-label={`View image ${index + 1} of ${images.length}`}
                              style={{ clipPath }}
                            />
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Pause all videos and auto-rotation when user manually navigates
                          const allVideos = document.querySelectorAll('video');
                          allVideos.forEach((video) => {
                            video.pause();
                            video.currentTime = 0;
                          });
                          if (imageRotationIntervalRef.current) {
                            clearInterval(imageRotationIntervalRef.current);
                            imageRotationIntervalRef.current = null;
                          }
                          // Calculate next index accounting for video at -1
                          if (selectedImageIndex === -1) {
                            setSelectedImageIndex(0);
                          } else if (selectedImageIndex === images.length - 1) {
                            setSelectedImageIndex(hasVideo ? -1 : 0);
                          } else {
                            setSelectedImageIndex(selectedImageIndex + 1);
                          }
                        }}
                        className="text-white/70 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Next"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      {/* Media counter */}
                      <span className="text-white/60 text-xs ml-2"
                        style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                      >
                        {(() => {
                          // Calculate current position based on what's actually being displayed
                          let currentPosition: number;
                          if (hasVideo && (!hasImages || selectedImageIndex === -1)) {
                            // Currently showing video
                            currentPosition = 1;
                          } else {
                            // Currently showing an image
                            if (hasVideo) {
                              // If there's a video, images start at position 2 (video is 1)
                              currentPosition = selectedImageIndex + 2;
                            } else {
                              // If no video, images start at position 1
                              currentPosition = selectedImageIndex + 1;
                            }
                          }
                          return `${currentPosition} / ${totalItems}`;
                        })()}
                      </span>
                    </div>
                  );
                }
                return null;
              })()}
              
              {/* Subtle Click to Expand Prompt - Always visible below media */}
              <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                Click to expand
              </div>
            </div>
          </div>

          {/* Right: Service Details - 50% */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <div className="flex items-start justify-between mb-3 gap-3">
              <h3 
                className="text-xl md:text-2xl lg:text-2xl font-bold text-white leading-tight"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                {currentPost?.title || "Full Correction & Coating"}
              </h3>
              <span 
                className="bg-green-500 text-white text-[10px] md:text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                From Instagram
              </span>
                    </div>

            {currentPost?.location && (
              <p 
                className="text-gray-300 mb-3 text-xs uppercase tracking-wider"
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
                  className="text-white text-xs font-semibold"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Duration: {currentPost.duration}
                </span>
              </div>
            )}

            {currentPost?.description && (
              <p 
                className="text-white mb-3 text-sm font-medium leading-relaxed"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                {currentPost.description}
              </p>
            )}

            {currentPost?.detailedDescription && (
              <p 
                className="text-gray-300 mb-5 text-xs leading-relaxed"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                {currentPost.detailedDescription}
              </p>
            )}

            {/* Techniques Used & Results Achieved - Side by Side */}
            {(currentPost?.techniques && currentPost.techniques.length > 0) || (currentPost?.results && currentPost.results.length > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                {/* Techniques Used */}
                {currentPost?.techniques && currentPost.techniques.length > 0 && (
                  <div>
                    <h4 
                      className="text-white text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
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
                            className="text-gray-300 text-xs leading-relaxed"
                            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                          >
                            {technique}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Results Achieved */}
                {currentPost?.results && currentPost.results.length > 0 && (
                  <div>
                    <h4 
                      className="text-white text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
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
                            className="text-gray-300 text-xs leading-relaxed"
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
                    className="border border-white/30 text-white px-3 py-1 rounded-full text-xs"
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
                  className="bg-white text-black px-4 py-2 rounded-full font-semibold text-center hover:bg-gray-100 transition-colors uppercase tracking-wider text-xs sm:text-sm"
                            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                          >
                  View job gallery
                </Link>
              )}
              {currentPost?.bookingUrl && (
                <Link
                  href={currentPost.bookingUrl}
                  className="border-2 border-white text-white px-4 py-2 rounded-full font-semibold text-center hover:bg-white/10 transition-colors uppercase tracking-wider text-xs sm:text-sm"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Book this package
                </Link>
                        )}
                      </div>
                    </div>
                  </div>

        {/* Bottom Pagination - Projects within current service */}
        {currentService.examples.length > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => {
                // Pause all videos before changing page
                const allVideos = document.querySelectorAll('video');
                allVideos.forEach((video) => {
                  video.pause();
                  video.currentTime = 0;
                });
                setSelectedExampleIndex(selectedExampleIndex > 0 ? selectedExampleIndex - 1 : currentService.examples.length - 1);
              }}
              className="text-white hover:text-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous project"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex gap-2 items-center">
              {currentService.examples.map((_, index) => {
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
                      isActive ? "bg-white h-1 w-8" : "bg-white/30 h-1 w-6"
                    }`}
                    aria-label={`View project ${index + 1} of ${currentService.serviceName}`}
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
                setSelectedExampleIndex(selectedExampleIndex < currentService.examples.length - 1 ? selectedExampleIndex + 1 : 0);
              }}
              className="text-white hover:text-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
      {isLightboxOpen && lightboxMediaSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Media Container - Prevent click propagation */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxMediaType === "video" ? (
              <div className="relative">
                <video
                  ref={lightboxVideoRef}
                  src={lightboxMediaSrc}
                  className="max-w-full max-h-[90vh] object-contain"
                  controls
                  playsInline
                  autoPlay
                  muted={isMuted}
                  loop
                >
                  Your browser does not support the video tag.
                </video>
                {/* Mute/Unmute Toggle Button */}
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
            ) : (
              <>
                <Image
                  src={lightboxMediaSrc}
                  alt="Expanded view"
                  width={1920}
                  height={1080}
                  className="max-w-full max-h-[90vh] object-contain"
                  quality={95}
                  priority
                />
                {/* Navigation arrows for multiple images */}
                {(() => {
                  const currentPost = services[selectedServiceIndex]?.examples?.[selectedExampleIndex];
                  const hasMultipleImages = currentPost?.images && currentPost.images.length > 1;
                  return hasMultipleImages ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToPrevLightboxImage();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-10"
                        aria-label="Previous image"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToNextLightboxImage();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-10"
                        aria-label="Next image"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      {/* Image counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                        {lightboxImageIndex + 1} / {currentPost?.images?.length || 1}
                      </div>
                    </>
                  ) : null;
                })()}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// Load Instagram embed script for fallback embeds
if (typeof window !== "undefined") {
  const script = document.createElement("script");
  script.src = "https://www.instagram.com/embed.js";
  script.async = true;
  script.defer = true;
  if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
    document.body.appendChild(script);
  }
}

// Extend Window interface for Instagram embed
declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}
