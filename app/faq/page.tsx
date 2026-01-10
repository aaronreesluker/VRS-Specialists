"use client";

import type { Metadata } from "next";
import { useState } from "react";

const faqs = [
  {
    question: "How long does a car detailing service take?",
    answer:
      "Service duration varies by package and vehicle size. A basic detailing typically takes 3-4 hours, while a full interior and exterior detail can take 5-6 hours. Paint correction services typically take a full day (8-10 hours), and ceramic coating with preparation can take 2-3 days.",
  },
  {
    question: "Do you offer mobile detailing services?",
    answer:
      "Yes, we provide mobile detailing services across Brighton, Worthing, Hove, Shoreham, Lewes, and surrounding areas in Sussex. We also have a fully equipped studio workshop in Brighton. When booking, you can specify your preference.",
  },
  {
    question: "What is paint correction and how does it differ from polishing?",
    answer:
      "Paint correction involves using machine polishing to remove defects such as swirl marks, light scratches, and oxidation from the paint surface. Unlike a standard polish which temporarily enhances gloss, paint correction permanently removes defects and restores the paint's clarity and depth.",
  },
  {
    question: "How long does ceramic coating last?",
    answer:
      "Our VRS SiC ceramic coating provides protection for up to 2 years with proper maintenance. The coating creates a hydrophobic layer that repels water, dirt, and contaminants. Regular maintenance washing (every 2-3 weeks) helps maintain the coating's effectiveness.",
  },
  {
    question: "Can ceramic coating be applied over existing scratches?",
    answer:
      "Ceramic coating will not hide or remove scratches—it protects the surface. We recommend paint correction before applying ceramic coating to ensure the best results. The coating will enhance gloss and make future maintenance easier, but existing defects should be corrected first.",
  },
  {
    question: "What is PPF and how does it protect my vehicle?",
    answer:
      "Paint Protection Film (PPF) is a clear, self-healing polyurethane film that protects your vehicle's paint from stone chips, road debris, and minor scratches. Our premium PPF has self-healing properties that can repair light scratches and swirl marks when exposed to heat. It's virtually invisible once applied.",
  },
  {
    question: "How should I prepare my vehicle before service?",
    answer:
      "Generally, no preparation is needed. However, please ensure your vehicle is easily accessible, and remove any personal items from the interior if interior detailing is included. We'll handle all cleaning and preparation as part of our service.",
  },
  {
    question: "Do you work on all vehicle types?",
    answer:
      "Yes, we work on cars, SUVs, vans, and motorcycles. Whether it's a daily driver, classic car, or high-performance vehicle, we tailor our services to each vehicle's specific needs.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept cash, bank transfer, and card payments. Payment is typically due upon completion of the service, though deposits may be required for larger projects like PPF installation.",
  },
  {
    question: "Do you offer warranty on your services?",
    answer:
      "Yes. Our ceramic coating comes with a 2-year warranty (subject to proper maintenance), and PPF installation includes an installation warranty. We provide detailed aftercare instructions to help you maintain the results.",
  },
  {
    question: "Can I watch you work on my vehicle?",
    answer:
      "For studio appointments, you're welcome to observe the process. However, we recommend scheduling a consultation and final inspection rather than staying for the entire duration, as some processes require extended time. For mobile services, we work independently but are available for questions.",
  },
  {
    question: "What's the difference between 1-stage and multi-stage paint correction?",
    answer:
      "1-stage correction uses one polish to reduce swirl marks and enhance gloss, suitable for light to moderate defects. Multi-stage correction (2 or 3-stage) progressively uses more aggressive compounds and polishes to remove deeper scratches and severe defects, achieving a show-car finish.",
  },
  {
    question: "How often should I get my vehicle detailed?",
    answer:
      "For maintenance, we recommend a basic detailing every 3-4 months. With ceramic coating, you may only need a full detail every 6 months. Paint correction is typically a one-time service unless the vehicle sustains new damage. We can create a maintenance schedule based on your vehicle's use.",
  },
  {
    question: "Are your products safe for all paint types?",
    answer:
      "Yes, we use premium products that are safe for all paint types including solid, metallic, pearlescent, and matte finishes. During consultation, we assess your vehicle's paint and select the appropriate products and techniques.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pt-20">
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-dark-700 max-w-2xl mx-auto">
              Common questions about our services, processes, and what to
              expect.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-expanded={openIndex === index}
                  >
                    <span className="font-semibold text-dark-900 pr-4">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-primary-600 flex-shrink-0 transition-transform ${
                        openIndex === index ? "rotate-180" : ""
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
                  {openIndex === index && (
                    <div className="px-6 pb-4 text-dark-700 border-t border-gray-200 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 text-center bg-primary-50 border border-primary-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4 text-dark-900">
                Still Have Questions?
              </h2>
              <p className="text-dark-700 mb-6">
                Can't find what you're looking for? Get in touch and we'll be
                happy to help.
              </p>
              <a href="/contact" className="btn-primary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
