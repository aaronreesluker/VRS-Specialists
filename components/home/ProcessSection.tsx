"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "1",
    title: "Enquiry",
    description:
      "Get in touch via phone, WhatsApp, or our contact form. We'll discuss your vehicle and requirements.",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Consultation",
    description:
      "We assess your vehicle and recommend the best services to meet your goals and budget.",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    number: "3",
    title: "Booking",
    description:
      "Schedule your appointment at our Brighton studio or arrange mobile service across Sussex.",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    number: "4",
    title: "Service",
    description:
      "Our meticulous process ensures every detail is perfected using premium products and techniques.",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    number: "5",
    title: "Handover",
    description:
      "Inspection and handover with aftercare advice to maintain your vehicle's pristine condition.",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

function ProcessStep({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex items-start gap-2 md:gap-3 pl-6 md:pl-8"
    >
      {/* Icon Circle - centered on the line */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.2, type: "spring" }}
        className="absolute z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-600 flex items-center justify-center text-white shadow-md left-[var(--tl-x)]"
        style={{ x: "-50%" }} // Framer composes translate with scale correctly
      >
        {step.icon}
      </motion.div>

      {/* Large Number - Positioned immediately right of circle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
        className="flex-shrink-0 ml-12 md:ml-14"
      >
        <div className="text-5xl md:text-6xl font-bold text-gray-400 leading-none">
          {step.number}
        </div>
      </motion.div>

      {/* Content Card - Title and description only */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 md:p-5"
      >
        <h3 
          className="text-lg md:text-xl font-bold mb-2 text-white"
          style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
        >
          {step.title}
        </h3>

        <p 
          className="text-sm md:text-base text-gray-300 leading-relaxed"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          {step.description}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10" ref={ref}>
          <motion.h2
            initial={{ opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
            animate={isInView ? { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" } : { opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
          >
            Our Process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            From initial enquiry to final handover, we ensure a seamless
            experience.
          </motion.p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative max-w-3xl mx-auto [--tl-x:1.25rem] md:[--tl-x:1.5rem]">
          {/* Vertical Timeline Line - truly centered through circles */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-white/20 left-[var(--tl-x)] -translate-x-1/2" />

          {/* Timeline Steps */}
          <div className="relative space-y-6 md:space-y-8">
            {steps.map((step, index) => (
              <ProcessStep key={index} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
