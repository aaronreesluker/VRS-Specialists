"use client";

import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <div className="pt-20">
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="mb-4">Contact Us</h1>
            <p className="text-lg text-dark-700 max-w-2xl mx-auto">
              Get in touch to discuss your vehicle's rejuvenation needs. We're
              here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-dark-900">
                Get in Touch
              </h2>
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="font-semibold text-dark-900 mb-2">Email</h3>
                  <a
                    href="mailto:info@vrsspecialists.com"
                    className="text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    info@vrsspecialists.com
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold text-dark-900 mb-2">Phone</h3>
                  <a
                    href="tel:08000029083"
                    className="text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    0800 002 9083
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold text-dark-900 mb-2">WhatsApp</h3>
                  <a
                    href="https://wa.me/447926136965"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    07926 136965
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold text-dark-900 mb-2">
                    Service Areas
                  </h3>
                  <p className="text-dark-700">
                    Brighton (Studio) • Mobile across Sussex including Worthing,
                    Hove, Shoreham, Lewes, and surrounding areas
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-dark-900 mb-3">
                  Why Choose Us
                </h3>
                <ul className="space-y-2 text-dark-700">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Fully insured and certified
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Premium products and techniques
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Studio or mobile service
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    Meticulous attention to detail
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

