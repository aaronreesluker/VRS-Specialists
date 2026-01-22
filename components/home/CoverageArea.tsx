"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const areas = [
  { name: "Brighton", type: "Studio & Mobile" },
  { name: "Worthing", type: "Mobile" },
  { name: "Hove", type: "Mobile" },
  { name: "Shoreham", type: "Mobile" },
  { name: "Lewes", type: "Mobile" },
  { name: "Eastbourne", type: "Mobile" },
];

export default function CoverageArea() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12" ref={ref}>
          <motion.h2
            initial={{ opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
            animate={
              isInView
                ? { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }
                : { opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Coverage Area
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Serving Brighton and surrounding areas across Sussex. Studio
            workshop in Brighton or mobile service at your location.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {areas.map((area, index) => (
              <div
                key={index}
                className="coverage-card group relative text-center transition-all duration-300"
              >
                <div className="coverage-card-inner bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 relative z-10 group-hover:border-transparent transition-colors duration-300">
                  <h3
                    className="font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    {area.name}
                  </h3>
                  <p
                    className="text-sm text-gray-400"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    {area.type}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA box */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center">
            <p
              className="text-white font-semibold mb-2"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Not sure if we cover your area?
            </p>
            <p
              className="text-gray-300 mb-4"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Contact us to discuss mobile detailing availability in your
              location.
            </p>
            <a
              href="/contact"
              className="bg-white text-black px-6 py-3 rounded-full font-semibold text-center hover:bg-gray-100 transition-colors uppercase tracking-wider inline-block"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
