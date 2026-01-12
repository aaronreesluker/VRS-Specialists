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
  const textColor = "#ffffff"; // Always white text

  useEffect(() => {
    // Always visible on non-homepage
    if (!isHomePage) {
      setIsVisible(true);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-black transition-all duration-500 ${
        isHomePage && !isVisible ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
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
              style={{ filter: "brightness(0) invert(1)" }}
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

