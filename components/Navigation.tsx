"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("rgba(255, 255, 255, 0.8)");
  const [textColor, setTextColor] = useState("#1f2937"); // dark-700

  useEffect(() => {
    // Always visible on non-homepage
    if (!isHomePage) {
      setIsVisible(true);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      
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
        const bgColor = computedStyle.backgroundColor;
        setBackgroundColor(bgColor);
        
        // Determine text color based on background brightness
        const rgb = bgColor.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
          setTextColor(brightness > 128 ? "#1f2937" : "#ffffff"); // dark-700 or white
        }
      } else {
        // Default to white background if no section detected
        setBackgroundColor("rgba(255, 255, 255, 0.8)");
        setTextColor("#1f2937");
      }
      
      // Scroll-aware behavior for homepage
      if (isHomePage) {
        // Show menu when scrolling up, hide when scrolling down
        if (currentScrollY < lastScrollY && currentScrollY > 100) {
          // Scrolling up and past hero section
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY) {
          // Scrolling down
          setIsVisible(false);
        }
        
        // Hide menu at the very top
        if (currentScrollY < 100) {
          setIsVisible(false);
        }
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage, lastScrollY]);

  // Simplified navigation links
  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/brands", label: "Work" },
    { href: "/contact", label: "Contact" },
  ];

  // Don't render on homepage if not visible (scroll-aware)
  if (isHomePage && !isVisible) {
    return null;
  }

  // Get RGB values from backgroundColor - use full opacity for seamless blend
  const getBackgroundStyle = () => {
    const rgb = backgroundColor.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      const r = parseInt(rgb[0]);
      const g = parseInt(rgb[1]);
      const b = parseInt(rgb[2]);
      // Use full opacity (1.0) for completely seamless blend
      return `rgb(${r}, ${g}, ${b})`;
    }
    return "rgb(255, 255, 255)";
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
              width={120}
              height={32}
              className="h-8 w-auto"
              style={{ filter: textColor === "#ffffff" ? "brightness(0) invert(1)" : "none" }}
              priority
            />
          </Link>

          {/* Desktop Navigation - Simplified */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-opacity font-medium text-sm hover:opacity-70"
                style={{ 
                  color: textColor,
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              >
                {link.label}
              </Link>
            ))}
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

