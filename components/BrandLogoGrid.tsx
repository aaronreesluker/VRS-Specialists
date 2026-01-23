"use client";

import Link from "next/link";
import Image from "next/image";
import { getBrandsData } from "@/lib/brandData";
import { useMemo, useLayoutEffect, useRef, useState } from "react";

const brandLogoMap: Record<string, string> = {
  "Aston Martin": "/logos/brands/Aston Martin.png",
  Audi: "/logos/brands/Audi.png",
  BMW: "/logos/brands/bmw.png",
  Ferrari: "/logos/brands/ferrari.png",
  McLaren: "/logos/brands/mclaren.png",
  Porsche: "/logos/brands/porsche.png",
  "Range Rover": "/logos/brands/range rover.png",
  "Rolls Royce": "/logos/brands/rolls royce.png",
  Tesla: "/logos/brands/Tesla.png",
  Volkswagen: "/logos/brands/Volkswagon.png",
  Bentley: "/logos/brands/Bentley.png",
};

const alwaysShowBrands = ["McLaren", "Ferrari", "Tesla", "Jaguar"];

// Component for Specials badge with prominent red shine effect
function SpecialBadgeWithShine({ brandName }: { brandName: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={wrapRef}
      className="brand-logo-wrap group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* + symbol - white when not hovered, red shine when hovered */}
      <span
        className={`text-5xl font-light transition-all relative z-10 ${
          isHovered 
            ? 'brand-logo-shine-special-text' 
            : 'text-white opacity-70 group-hover:opacity-100'
        }`}
        style={{ fontFamily: "var(--font-outfit), sans-serif" }}
      >
        +
      </span>
    </div>
  );
}

// Component to handle logo with shine effect - ensures mask matches rendered image
function LogoWithShine({
  logoPath,
  alt,
  maskPath,
}: {
  logoPath: string;
  alt: string;
  maskPath: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useLayoutEffect(() => {
    if (!shineRef.current || !wrapRef.current || !maskPath) return;

    // Ensure path starts with / and encode spaces properly for image loading
    const fullPath = maskPath.startsWith('/') ? maskPath : `/${maskPath}`;
    // Encode the path for the Image object - browser will decode it automatically
    const encodedPathForImg = fullPath.replace(/\s/g, '%20');
    
    // Preload mask image to ensure it's available - use encoded path
    const maskImg = new window.Image();
    maskImg.crossOrigin = 'anonymous'; // Help with CORS if needed
    maskImg.src = encodedPathForImg;
    
    // Add hover handlers as fallback - ensure they actually work
    const shineEl = shineRef.current;
    const wrapEl = wrapRef.current;
    
    // Note: Hover is now handled by React state (isHovered) in the component
    // The event listeners below are kept as a fallback for edge cases
    const handleMouseEnter = () => {
      if (shineEl) {
        shineEl.style.setProperty('opacity', '1', 'important');
      }
    };
    
    const handleMouseLeave = () => {
      if (shineEl) {
        shineEl.style.setProperty('opacity', '0', 'important');
      }
    };
    
    // Try to find the parent Link element and add fallback hover handlers
    const linkEl = wrapEl.closest('a.brand-logo-item') || wrapEl.closest('.brand-logo-item');
    if (linkEl) {
      linkEl.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      linkEl.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    } else {
      // Fallback to wrapper hover
      wrapEl.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      wrapEl.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }
    
    const applyMask = () => {
      if (!shineRef.current) {
        return;
      }
      
      const elem = shineRef.current;
      
      // Verify mask image loaded successfully
      // Note: naturalWidth might be 0 even if image loaded, so check both
      const isImageReady = maskImg.complete && maskImg.naturalWidth > 0 && maskImg.naturalHeight > 0;
      if (!isImageReady) {
        // Try applying anyway - the path might still work even if preload failed
        // Some browsers allow CSS mask-image even if the image isn't preloaded
      }
      
      // Try multiple URL formats - CSS can be finicky with spaces
      // Get absolute URL with origin
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const encodedPath = fullPath.replace(/\s/g, '%20');
      
      // Method 1: Absolute URL with encoded path (most reliable)
      const absoluteEncodedUrl = `${origin}${encodedPath}`;
      const maskUrlAbsolute = `url("${absoluteEncodedUrl}")`;
      
      // Method 2: Relative encoded path
      const maskUrlEncoded = `url("${encodedPath}")`;
      
      // Method 3: Raw path with quotes
      const maskUrlRaw = `url("${fullPath}")`;
      
      // Mask URL formats ready - apply absolute URL first (most reliable)
      
      // Try absolute URL first (most reliable)
      elem.style.setProperty("-webkit-mask-image", maskUrlAbsolute, "important");
      elem.style.setProperty("mask-image", maskUrlAbsolute, "important");
      
      // Verify and try fallback if needed
      setTimeout(() => {
        const computed = window.getComputedStyle(elem);
        const currentMask = computed.maskImage || computed.webkitMaskImage;
        if (currentMask === 'none' || !currentMask || currentMask === '') {
          // Try relative encoded path as fallback
          elem.style.setProperty("-webkit-mask-image", maskUrlEncoded, "important");
          elem.style.setProperty("mask-image", maskUrlEncoded, "important");
          
          // Check again after fallback
          setTimeout(() => {
            const computed2 = window.getComputedStyle(elem);
            const mask2 = computed2.maskImage || computed2.webkitMaskImage;
            if (mask2 === 'none' || !mask2) {
              // Final fallback: try raw path
              elem.style.setProperty("-webkit-mask-image", maskUrlRaw, "important");
              elem.style.setProperty("mask-image", maskUrlRaw, "important");
            }
          }, 50);
        }
      }, 50);
      
      // Mask is applied - verification happens in immediate check above
      elem.style.setProperty("-webkit-mask-repeat", "no-repeat", "important");
      elem.style.setProperty("mask-repeat", "no-repeat", "important");
      elem.style.setProperty("-webkit-mask-position", "center", "important");
      elem.style.setProperty("mask-position", "center", "important");
      elem.style.setProperty("-webkit-mask-size", "contain", "important");
      elem.style.setProperty("mask-size", "contain", "important");
      elem.style.setProperty("-webkit-mask-origin", "padding-box", "important");
      elem.style.setProperty("mask-origin", "padding-box", "important");
      elem.style.setProperty("-webkit-mask-mode", "alpha", "important");
      elem.style.setProperty("mask-mode", "alpha", "important");
      
      // Mask successfully applied - the shine should now be clipped to logo shape on hover
      // Note: opacity is 0 by default, will become 1 on hover via CSS
      
      // Mask successfully applied - shine is now clipped to logo shape
    };

    // Apply mask after image loads successfully
    const applyWithTiming = () => {
      requestAnimationFrame(() => {
        setTimeout(applyMask, 100);
      });
    };

    if (maskImg.complete && maskImg.naturalWidth > 0 && maskImg.naturalHeight > 0) {
      // Image already loaded successfully
      applyWithTiming();
    } else {
      // Wait for image to load
      maskImg.onload = () => {
        applyWithTiming();
      };
      maskImg.onerror = () => {
        // Try applying anyway - CSS might still work even if Image object failed
        // Sometimes browsers can use mask-image even if Image preload failed
        applyWithTiming();
      };
    }

    // Backup timeout - always try to apply, even if image load status is unclear
    const timeoutId = setTimeout(() => {
      applyMask();
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
      maskImg.onload = null;
      maskImg.onerror = null;
      // Clean up hover event listeners
      const wrapEl = wrapRef.current;
      if (wrapEl) {
        const linkEl = wrapEl.closest('a.brand-logo-item') || wrapEl.closest('.brand-logo-item');
        if (linkEl) {
          linkEl.removeEventListener('mouseenter', handleMouseEnter);
          linkEl.removeEventListener('mouseleave', handleMouseLeave);
        }
        wrapEl.removeEventListener('mouseenter', handleMouseEnter);
        wrapEl.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [maskPath, alt]);

  return (
    <div 
      ref={wrapRef} 
      className="brand-logo-wrap group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* This is the actual shine layer that gets masked */}
      <span 
        ref={shineRef} 
        className="brand-logo-shine" 
        aria-hidden="true"
        style={{ 
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />
      <Image
        src={logoPath}
        alt={alt}
        width={120}
        height={80}
        className="brand-logo-img opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ filter: "brightness(0) invert(1)" }}
      />
    </div>
  );
}

interface BrandLogoGridProps {
  title?: string;
  subtitle?: string;
}

export function BrandLogoGrid({
  title = "Work by Brand",
  subtitle = "Explore our work across different luxury car brands",
}: BrandLogoGridProps) {
  const brandsData = getBrandsData();

  const brandLogos = useMemo(() => {
    const brandMap = new Map<string, { brandName: string; projectCount: number }>();

    brandsData.forEach((brand) => {
      if (!brandMap.has(brand.brandName)) {
        brandMap.set(brand.brandName, {
          brandName: brand.brandName,
          projectCount: brand.examples.length,
        });
      }
    });

    alwaysShowBrands.forEach((brandName) => {
      if (!brandMap.has(brandName)) {
        brandMap.set(brandName, { brandName, projectCount: 0 });
      }
    });

    const seen = new Set<string>();
    let logos = Array.from(brandMap.values())
      .filter((b) => {
        if (seen.has(b.brandName)) return false;
        seen.add(b.brandName);
        return true;
      })
      .map((b) => {
        const logoPath =
          brandLogoMap[b.brandName] ||
          (b.brandName !== "Specials" ? `/logos/brands/${b.brandName}.png` : null);

        return {
          brandName: b.brandName,
          logoPath,
          href: `/brands?brand=${encodeURIComponent(b.brandName)}`,
          projectCount: b.projectCount,
          isSpecial: b.brandName === "Specials",
        };
      });

    // Ensure Specials once at end
    const specials = logos.filter((l) => l.brandName === "Specials");
    logos = logos.filter((l) => l.brandName !== "Specials");
    if (specials.length) logos.push(specials[0]);

    // Limit to 12
    const regular = logos.filter((l) => l.brandName !== "Specials").slice(0, 11);
    const specialsOne = logos.find((l) => l.brandName === "Specials");
    if (specialsOne) regular.push(specialsOne);

    return regular;
  }, [brandsData]);

  return (
    <section className="py-12 md:py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            {title}
          </h2>
          <p 
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6 max-w-5xl mx-auto">
          {brandLogos.map((brand) => {
            // Use the raw path - encoding will happen in the component
            const maskPath = brand.logoPath || "";

            return (
              <Link
                key={brand.brandName}
                href={brand.href}
                className="group brand-logo-item flex flex-col items-center justify-center py-4 transition-opacity duration-300 hover:opacity-100"
              >
                <div className="relative w-full h-20 mb-2 flex items-center justify-center">
                  {brand.isSpecial ? (
                    <SpecialBadgeWithShine brandName={brand.brandName} />
                  ) : brand.logoPath ? (
                    <LogoWithShine
                      logoPath={brand.logoPath}
                      alt={brand.brandName}
                      maskPath={maskPath}
                    />
                  ) : (
                    <span
                      className="text-white text-lg font-semibold opacity-70 group-hover:opacity-100 transition-opacity"
                      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    >
                      {brand.brandName}
                    </span>
                  )}
                </div>

                <p
                  className="text-gray-400 text-xs text-center group-hover:text-gray-300 transition-colors"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  {brand.isSpecial
                    ? "Specials"
                    : brand.projectCount > 0
                      ? `${brand.projectCount} ${brand.projectCount === 1 ? "project" : "projects"}`
                      : ""}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

