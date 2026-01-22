"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";

const faqs = [
  {
    question: "Why use ceramic coating to protect your car?",
    answer:
      "Ceramic coating is the best and most durable paint protection, excluding paint protection films. Today's water-based clear coats are more susceptible to mechanical damage and weather conditions due to environmental regulations. Ceramic coating provides essential protection for these softer finishes.",
  },
  {
    question: "Car waxing & machine polishing - what's the difference?",
    answer:
      "Polish is used to remove imperfections from your vehicle's paint or clear coat, fixing small scratches, scrapes, or swirl marks. Wax creates a protective barrier against UV rays, pollution, dust, moisture, and corrosion. Both serve different purposes - polish fixes imperfections, while wax protects the finish. It's recommended to do both, always polishing before waxing.",
  },
  {
    question: "What is a clay bar?",
    answer:
      "A clay bar is used to decontaminate car paint by removing airborne contaminants like brake dust, industrial fallout, bug residue, and tar that stick to the surface. It safely removes overspray and industrial fallout, leaving your paint silky smooth. Clay bars remove surface impurities but cannot remove scratches or swirls. It's recommended to clay your car twice per year.",
  },
  {
    question: "What is Pure Water Technology?",
    answer:
      "We rinse all vehicles using a pure water system that delivers 100% pure water through a mixed bed de-mineralising resin. De-mineralised water actively retains dirt, chemicals and minerals during rinsing, requiring no detergents. This environmentally friendly process leaves no soapy residues or smears, meaning your car can stay cleaner for longer.",
  },
  {
    question: "Should I avoid car washes?",
    answer:
      "Yes - all automatic and hand car washes can have an adverse effect on your car. They can strip protection through aggressive chemicals and scratch your car by using dirt-filled washing cloths, mitts and towels from washing 70-100 cars per day. For protected vehicles, professional maintenance washing is essential.",
  },
  {
    question: "Do you offer mobile services?",
    answer:
      "Yes, we provide mobile detailing services across Brighton, Worthing, Hove, and surrounding areas in Sussex. Our fully equipped van carries its own power and water. We also have a studio workshop in Brighton. You can choose between mobile or studio service when booking.",
  },
];

export default function FAQPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
        <section className="py-12 md:py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" ref={ref}>
          <motion.h2
            initial={{ opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
            animate={isInView ? { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" } : { opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Common questions about our services and process.
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
            <div
              key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-inset"
                    aria-expanded={isOpen}
            >
                    <h3 
                      className="text-lg font-bold text-white pr-4 flex-1"
                      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    >
                {faq.question}
              </h3>
                    <svg
                      className={`w-5 h-5 text-white flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4 pt-2 border-t border-white/10">
                          <p 
                            className="text-gray-300 leading-relaxed"
                            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            </div>
        </div>

        {/* "View All FAQs" button removed - FAQ page not ready yet for pitch/portfolio site */}
      </div>
    </section>
  );
}

