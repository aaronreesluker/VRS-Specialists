import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us - VRS Vehicle Rejuvenation Specialists",
  description:
    "Meticulous vehicle rejuvenation specialists in Brighton. Certified, insured, and committed to perfection in every detail.",
};

export default function AboutPage() {
  return (
    <div className="pt-20">
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-6 flex justify-center">
              <img 
                src="/assets/VRS_logo_transparent.png" 
                alt="VRS Vehicle Rejuvenation Specialists" 
                className="h-16 md:h-20 w-auto"
              />
            </div>
            <h1 className="mb-4">About VRS Specialists</h1>
            <p className="text-lg text-dark-700 max-w-3xl mx-auto">
              Meticulous vehicle rejuvenation specialists committed to
              perfection in every detail.
            </p>
          </div>

          {/* Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-dark-900">
                Our Story & Philosophy
              </h2>
              <div className="space-y-4 text-dark-700">
                <p>
                  VRS - Vehicle Rejuvenation Specialists was founded on a simple
                  principle: every vehicle deserves meticulous care and
                  attention to detail. We specialise in transforming vehicles
                  through premium detailing, paint correction, and long-term
                  protection solutions.
                </p>
                <p>
                  Our approach combines traditional craftsmanship with modern
                  techniques and premium products. Whether working in our
                  Brighton studio workshop or providing mobile services across
                  Sussex, we maintain the same unwavering standards of
                  excellence.
                </p>
                <p>
                  We understand that your vehicle is more than just
                  transportation—it's an investment and a reflection of your
                  standards. That's why we strive for perfection in every aspect
                  of our work, from initial consultation through to final
                  handover.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070"
                alt="VRS Specialists workshop"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Trust Badges */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-dark-900">
              Why Choose VRS Specialists
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-primary-600 mb-4 flex justify-center">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-dark-900">
                  Fully Insured
                </h3>
                <p className="text-dark-700">
                  Comprehensive insurance coverage for complete peace of mind.
                </p>
              </div>

              <div className="text-center">
                <div className="text-primary-600 mb-4 flex justify-center">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-dark-900">
                  Certified & Trained
                </h3>
                <p className="text-dark-700">
                  Continuously trained in the latest techniques and products.
                </p>
              </div>

              <div className="text-center">
                <div className="text-primary-600 mb-4 flex justify-center">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-dark-900">
                  Studio & Mobile
                </h3>
                <p className="text-dark-700">
                  Brighton studio or mobile service across Sussex.
                </p>
              </div>

              <div className="text-center">
                <div className="text-primary-600 mb-4 flex justify-center">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-dark-900">
                  Premium Products
                </h3>
                <p className="text-dark-700">
                  Only the finest detailing products and coatings.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary-600 text-white rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Experience the Difference?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-primary-100">
              Contact us today for a consultation and discover how we can
              rejuvenate your vehicle.
            </p>
            <Link href="/contact" className="btn-primary bg-white text-primary-600 hover:bg-primary-50">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

