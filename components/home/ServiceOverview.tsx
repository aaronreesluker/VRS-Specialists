"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const services = [
  {
    id: "detailing",
    name: "Car Detailing",
    price: "from £125",
    description: "Decontamination power wash with meticulous attention to every detail",
    href: "/services#detailing",
  },
  {
    id: "correction",
    name: "Paint Correction",
    price: "from £250",
    description: "1 stage enhancement to restore depth, gloss and clarity",
    href: "/services#correction",
  },
  {
    id: "coating",
    name: "Ceramic Coating",
    price: "from £400",
    description: "2 year protection with VRS SiC ceramic coating technology",
    href: "/services#coating",
  },
  {
    id: "ppf",
    name: "PPF Protection",
    price: "from £1,250",
    description: "Front end paint protection film with self-healing technology",
    href: "/services#ppf",
  },
  {
    id: "dry-ice",
    name: "Dry Ice Blasting",
    price: "from £950",
    description: "Underbody decontamination using advanced dry ice technology",
    href: "/services#dry-ice",
  },
  {
    id: "maintenance-club",
    name: "Maintenance Club",
    price: "from £60",
    description: "Safe maintenance wash to keep your vehicle pristine",
    href: "/services#maintenance-club",
  },
  {
    id: "interior-valeting",
    name: "Interior Valeting",
    price: "from £150",
    description: "Complete interior cleaning and protection service",
    href: "/services#interior-valeting",
  },
];

export default function ServiceOverview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="pt-2 sm:pt-6 md:pt-10 pb-20 md:pb-28 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" ref={ref}>
          <motion.h2
            initial={{ opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
            animate={isInView ? { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" } : { opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Our Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Comprehensive vehicle rejuvenation services, from meticulous
            detailing to long-term paint protection.
          </motion.p>
        </div>

        <div>
          {/* First 4 services in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {services.slice(0, 4).map((service) => (
              <Link
                key={service.id}
                href={service.href}
                className="group bg-gray-900 border-2 border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-all duration-300 hover:shadow-lg"
              >
                <div className="mb-4">
                  <h3 
                    className="text-xl font-bold mb-2 text-white group-hover:text-primary-500 transition-colors"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    {service.name}
                  </h3>
                  <p 
                    className="text-2xl font-bold text-primary-500 mb-3"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    {service.price}
                  </p>
                </div>
                <p 
                  className="text-gray-300 mb-4"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  {service.description}
                </p>
                <span 
                  className="text-primary-500 font-semibold group-hover:underline"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
          
          {/* Last 3 services centered */}
          <div className="flex flex-wrap justify-center gap-6">
            {services.slice(4).map((service) => (
              <Link
                key={service.id}
                href={service.href}
                className="group bg-gray-900 border-2 border-gray-700 rounded-lg p-6 hover:border-primary-500 transition-all duration-300 hover:shadow-lg w-full md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.5rem)] max-w-sm"
              >
                <div className="mb-4">
                  <h3 
                    className="text-xl font-bold mb-2 text-white group-hover:text-primary-500 transition-colors"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    {service.name}
                  </h3>
                  <p 
                    className="text-2xl font-bold text-primary-500 mb-3"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    {service.price}
                  </p>
                </div>
                <p 
                  className="text-gray-300 mb-4"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  {service.description}
                </p>
                <span 
                  className="text-primary-500 font-semibold group-hover:underline"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/services" 
            className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold text-center hover:bg-white hover:text-black transition-colors uppercase tracking-wider inline-block"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}

