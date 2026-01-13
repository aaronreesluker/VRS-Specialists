"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { StaggeredMenu } from "./StaggeredMenu";

export default function Navigation() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("rgba(0, 0, 0, 1)");
  const [textColor, setTextColor] = useState("#ffffff");

  useEffect(() => {
    // Always visible on non-homepage
    if (!isHomePage) {
      setIsVisible(true);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      
      if (isHomePage) {
        // On homepage: detect which section we're in
        // Hero section (ScrollCarHero) is black - hide navigation during this section
        // Grey section immediately after should match grey background
        
        // Hero section is approximately 300vh (3x viewport height)
        // Hide navigation during the Porsche scrolling section
        const heroHeight = window.innerHeight * 3; // 300vh
        const isInHeroSection = currentScrollY < heroHeight;
        
        if (isInHeroSection) {
          // In hero section (Porsche/car section) - hide navigation completely
          setIsVisible(false);
          setBackgroundColor("rgb(0, 0, 0)");
          setTextColor("#ffffff");
        } else {
          // Past hero section - scroll-aware behavior
          // Hide when scrolling down, show when scrolling up
          if (currentScrollY > lastScrollY && currentScrollY > heroHeight + 50) {
            // Scrolling down - hide navigation
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY) {
            // Scrolling up - show navigation
            setIsVisible(true);
          } else if (currentScrollY <= heroHeight + 50) {
            // Just past hero section - show navigation
            setIsVisible(true);
          }
          
          // Detect which section we're in and match background color
          const sections = document.querySelectorAll("section");
          let currentSection: Element | null = null;
          
          sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            // Check if section is near the top (where header is) or covers the header area
            if (rect.top <= 100 && rect.bottom >= 0) {
              currentSection = section;
            }
          });
          
          if (currentSection) {
            // Match the section's background color
            const computedStyle = window.getComputedStyle(currentSection);
            let bgColor = computedStyle.backgroundColor;
            
            // Handle rgba/rgb color values
            if (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
              // If transparent, check inline style
              const htmlElement = currentSection as HTMLElement;
              const inlineBg = htmlElement.getAttribute("style");
              if (inlineBg && inlineBg.includes("backgroundColor")) {
                const match = inlineBg.match(/backgroundColor["']?\s*[:=]\s*["']?([^;"']+)/);
                if (match) {
                  bgColor = match[1].trim();
                  // Convert hex to rgb if needed
                  if (bgColor.startsWith("#")) {
                    const hex = bgColor.replace("#", "");
                    const r = parseInt(hex.substring(0, 2), 16);
                    const g = parseInt(hex.substring(2, 4), 16);
                    const b = parseInt(hex.substring(4, 6), 16);
                    bgColor = `rgb(${r}, ${g}, ${b})`;
                  }
                }
              }
            }
            
            setBackgroundColor(bgColor);
            
            // Determine text color based on background brightness
            const rgb = bgColor.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
              const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
              setTextColor(brightness > 128 ? "#1f2937" : "#ffffff");
            } else {
              // Default for grey section
              setTextColor("#ffffff");
            }
          } else {
            // Default fallback - grey section
            setBackgroundColor("rgb(146, 146, 146)"); // #929292 - grey section after hero
            setTextColor("#ffffff");
          }
        }
      } else {
        // Other pages: always visible, match section background
        setIsVisible(true);
        
        const sections = document.querySelectorAll("section");
        let currentSection: Element | null = null;
        
        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
          }
        });
        
        if (currentSection) {
          const computedStyle = window.getComputedStyle(currentSection);
          const bgColor = computedStyle.backgroundColor;
          setBackgroundColor(bgColor);
          
          const rgb = bgColor.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            setTextColor(brightness > 128 ? "#1f2937" : "#ffffff");
          }
        } else {
          // Default to white background on other pages
          setBackgroundColor("rgb(255, 255, 255)");
          setTextColor("#1f2937");
        }
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage, lastScrollY]);

  // Simplified navigation links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/brands", label: "Work" },
    { href: "/contact", label: "Contact" },
  ];

  // Convert navLinks to StaggeredMenu format
  const staggeredMenuItems = navLinks.map((link) => ({
    label: link.label,
    ariaLabel: `Navigate to ${link.label}`,
    link: link.href,
  }));

  // Don't render on homepage if not visible (scroll-aware)
  if (isHomePage && !isVisible) {
    return null;
  }

  // Get RGB values from backgroundColor
  const getBackgroundStyle = () => {
    const rgb = backgroundColor.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      const r = parseInt(rgb[0]);
      const g = parseInt(rgb[1]);
      const b = parseInt(rgb[2]);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return backgroundColor;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHomePage && !isVisible ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundColor: getBackgroundStyle(),
        border: "none",
        borderBottom: "none",
        boxShadow: "none",
        outline: "none",
      }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <Image 
              src="/assets/vrs4.png" 
              alt="VRS Vehicle Rejuvenation Specialists" 
              width={240}
              height={64}
              className="h-16 w-auto"
              style={{ filter: textColor === "#ffffff" ? "brightness(0) invert(1)" : "none" }}
              priority
            />
          </Link>

          {/* Desktop Navigation - Staggered Menu Burger */}
          <div className="hidden lg:block">
            <StaggeredMenu
              items={staggeredMenuItems}
              position="right"
              colors={["#ffffff", "#f9fafb"]}
              displaySocials={false}
              displayItemNumbering={true}
              logoUrl="/assets/vrs4.png"
              menuButtonColor={textColor}
              openMenuButtonColor="#E11C22"
              accentColor="#E11C22"
              changeMenuColorOnOpen={true}
              isFixed={false}
              closeOnClickAway={true}
              className="staggered-menu-nav"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded transition-colors"
            style={{ color: textColor }}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block transition-opacity font-medium py-2 hover:opacity-70"
                style={{ 
                  color: textColor,
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

