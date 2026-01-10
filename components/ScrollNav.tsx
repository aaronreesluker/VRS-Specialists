"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ScrollNav Component
 * 
 * A minimalist navigation menu that:
 * - Hides when scrolling down
 * - Shows when scrolling up
 * - Matches background color of the section it's on
 * - No visible borders
 */

interface ScrollNavProps {
  items?: Array<{ name: string; href: string }>;
}

export function ScrollNav({ 
  items = [
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ]
}: ScrollNavProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("#929292");
  const [textColor, setTextColor] = useState("white");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
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
          setTextColor(brightness > 128 ? "#000000" : "#ffffff");
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
          style={{
            backgroundColor: backgroundColor,
            border: "none",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo/Brand */}
              <div className="flex items-center">
                <img 
                  src="/assets/vrs4.png" 
                  alt="VRS Vehicle Rejuvenation Specialists" 
                  className="h-6 w-auto"
                  style={{ filter: textColor === "#000000" ? "none" : "brightness(0) invert(1)" }}
                />
              </div>

              {/* Navigation Items */}
              <ul className="flex items-center gap-8">
                {items.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      className="text-sm font-light uppercase tracking-wider transition-opacity duration-200 hover:opacity-70"
                      style={{ 
                        fontFamily: "var(--font-outfit), sans-serif",
                        color: textColor,
                      }}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

