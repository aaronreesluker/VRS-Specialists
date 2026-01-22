"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Footer links
  const serviceLinks: Array<{ href: string; label: string }> = [
    { href: "/services", label: "Car Detailing" },
    { href: "/services", label: "Paint Correction" },
    { href: "/services", label: "Ceramic Coating" },
    { href: "/services", label: "PPF Protection" },
  ];
  const quickLinks: Array<{ href: string; label: string }> = [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/faq", label: "FAQ" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="bg-white text-dark-900">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Image 
              src="/assets/vrs1.png" 
              alt="VRS Vehicle Rejuvenation Specialists" 
              width={180}
              height={48}
              className="h-12 w-auto mb-4"
              loading="lazy"
            />
            <p 
              className="text-dark-700 mb-3"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Premium vehicle rejuvenation services in Brighton and across
              Sussex. Studio workshop and mobile detailing.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/vrs_vehicle_rejuvenation/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-600 hover:text-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://m.youtube.com/channel/UC0vw6Ur1La_fnnNvMRnl66Q"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-600 hover:text-primary-600 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/vrsspecialists.co.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-600 hover:text-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
            {/* Certification Logos */}
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <img
                src="/assets/IDA.png"
                alt="IDA Certification"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => setExpandedImage("/assets/IDA.png")}
              />
              <img
                src="/assets/UPPF.png"
                alt="UPPF Certification"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => setExpandedImage("/assets/UPPF.png")}
              />
              <img
                src="/assets/Rupes.png"
                alt="Rupes Certification"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => setExpandedImage("/assets/Rupes.png")}
              />
              <img
                src="/assets/Gtechniq.png"
                alt="Gtechniq Certification"
                className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => setExpandedImage("/assets/Gtechniq.png")}
              />
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 
              className="text-lg font-semibold mb-3 text-dark-900"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Services
            </h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-dark-700 hover:text-primary-600 transition-colors"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 
              className="text-lg font-semibold mb-3 text-dark-900"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-dark-700 hover:text-primary-600 transition-colors"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 
              className="text-lg font-semibold mb-3 text-dark-900"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Contact
            </h4>
            <ul 
              className="space-y-1.5 text-dark-700"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              <li>
                <a
                  href="mailto:info@vrsspecialists.com"
                  className="hover:text-primary-600 transition-colors"
                >
                  info@vrsspecialists.com
                </a>
              </li>
              <li>
                <a
                  href="tel:08000029083"
                  className="hover:text-primary-600 transition-colors"
                >
                  0800 002 9083
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/447926136965"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 transition-colors"
                >
                  WhatsApp: 07926 136965
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <Link 
                href="/contact" 
                className="bg-dark-900 text-white px-6 py-3 rounded-full font-semibold text-center hover:bg-dark-800 transition-colors uppercase tracking-wider inline-block"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-6 text-center text-dark-600">
          <p 
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            &copy; {currentYear} VRS - Vehicle Rejuvenation Specialists. All
            rights reserved.
          </p>
          <p 
            className="mt-1.5 text-sm"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Insured and certified. Serving Brighton, Worthing, and across
            Sussex.
          </p>
          <p 
            className="mt-2 text-sm"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Website by{" "}
            <a
              href="https://revivemarketingmanagement.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-900 hover:text-primary-600 transition-colors"
            >
              Revive marketing management
            </a>
          </p>
        </div>
      </div>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            onClick={() => setExpandedImage(null)}
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={expandedImage}
              alt="Certification"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
        </div>
      </div>
      )}
    </footer>
  );
}

