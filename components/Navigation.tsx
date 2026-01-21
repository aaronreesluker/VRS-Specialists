"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { StaggeredMenu } from "./StaggeredMenu";

export default function Navigation() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isServicesPage = pathname === "/services";
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Start visible at top
  const lastScrollYRef = useRef(0);
  const [backgroundColor, setBackgroundColor] = useState("rgba(0, 0, 0, 1)");
  const [textColor, setTextColor] = useState("#ffffff");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      setIsScrolled(currentScrollY > 20);
      
      // Scroll-aware behavior for all pages (hide on scroll down, show on scroll up)
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);
      
      if (currentScrollY <= 100) {
        // Near top (within 100px) - always show navigation
        setIsVisible(true);
      } else if (scrollDifference > 5) {
        // Only update if scroll difference is significant (prevents flickering)
        if (currentScrollY > lastScrollY) {
          // Scrolling down - hide navigation
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up - show navigation
          setIsVisible(true);
        }
      }
      
      // Detect which section we're in and match background color
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
        
        // Force white background on services page
        if (isServicesPage) {
          setBackgroundColor("rgb(255, 255, 255)");
          setTextColor("#1f2937");
        } else {
          setBackgroundColor(bgColor);
          
          const rgb = bgColor.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            setTextColor(brightness > 128 ? "#1f2937" : "#ffffff");
          } else {
            setTextColor("#1f2937");
          }
        }
      } else {
        // Default to matching page context
        if (isServicesPage) {
          setBackgroundColor("rgb(255, 255, 255)");
          setTextColor("#1f2937");
        } else {
        // Other pages: scroll-aware behavior (hide on scroll down, show on scroll up)
        const scrollDifference = Math.abs(currentScrollY - lastScrollY);
        
        if (currentScrollY <= 50) {
          // Near top - always show navigation
          setIsVisible(true);
        } else if (scrollDifference > 5) {
          // Only update if scroll difference is significant (prevents flickering)
          if (currentScrollY > lastScrollY) {
            // Scrolling down - hide navigation
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY) {
            // Scrolling up - show navigation
            setIsVisible(true);
          }
        }
        // If scroll position hasn't changed much, keep current visibility state
        
        // Match section background
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
          
          // Force white background on services page
          if (isServicesPage) {
            setBackgroundColor("rgb(255, 255, 255)");
            setTextColor("#1f2937");
          } else {
            setBackgroundColor(bgColor);
            
            const rgb = bgColor.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
              const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
              setTextColor(brightness > 128 ? "#1f2937" : "#ffffff");
            } else {
              setTextColor("#1f2937");
            }
          }
        } else {
          // Default based on page context
          if (isHomePage) {
            // Homepage - default to black (hero section background)
            setBackgroundColor("rgb(0, 0, 0)");
            setTextColor("#ffffff");
          } else if (isServicesPage) {
            setBackgroundColor("rgb(255, 255, 255)");
            setTextColor("#1f2937");
          } else {
            setBackgroundColor("rgb(255, 255, 255)");
            setTextColor("#1f2937");
          }
        }
      
      lastScrollYRef.current = currentScrollY;
    };
    
    // Set initial visibility based on scroll position
    const initialScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    if (initialScrollY <= 50) {
      setIsVisible(true);
    } else {
      setIsVisible(false); // Start hidden if already scrolled down
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage, isServicesPage]);

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

  // Don't render if not visible (scroll-aware for all pages)
  if (!isVisible) {
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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
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

