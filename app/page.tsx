import type { Metadata } from "next";
import Link from "next/link";
import ServiceOverview from "@/components/home/ServiceOverview";
import ProofStrip from "@/components/home/ProofStrip";
import ProcessSection from "@/components/home/ProcessSection";
import TestimonialsPreview from "@/components/home/TestimonialsPreview";
import CoverageArea from "@/components/home/CoverageArea";
import FAQPreview from "@/components/home/FAQPreview";
// import BlogSection from "@/components/BlogSection"; // Removed - Blog pages not ready yet
import { ScrollNav } from "@/components/ScrollNav";
import { InstagramGallery } from "@/components/InstagramGallery";
import { LogoLoop, type LogoItem } from "@/components/LogoLoop";
import { BrandLogoGrid } from "@/components/BrandLogoGrid";
import { getServicesData } from "@/lib/mediaData";

export const metadata: Metadata = {
  title: "Premium Car Detailing Brighton | Paint Correction & Ceramic Coating",
  description:
    "Professional car detailing, paint correction, ceramic coating and PPF services in Brighton and Sussex. Studio workshop and mobile detailing. Meticulous attention to detail.",
  openGraph: {
    title: "VRS - Premium Car Detailing Brighton",
    description:
      "Professional car detailing, paint correction, ceramic coating and PPF services in Brighton and Sussex.",
  },
};

// Car brand logos for LogoLoop component
const carBrandLogos: LogoItem[] = [
  {
    src: "/logos/brands/porsche.png",
    alt: "Porsche",
    title: "Porsche",
    height: 100,
  },
  {
    src: "/logos/brands/ferrari.png",
    alt: "Ferrari",
    title: "Ferrari",
    height: 100,
  },
  {
    src: "/logos/brands/mclaren.png",
    alt: "McLaren",
    title: "McLaren",
    height: 100,
  },
  {
    src: "/logos/brands/Aston Martin.png",
    alt: "Aston Martin",
    title: "Aston Martin",
    height: 100,
  },
  {
    src: "/logos/brands/Bentley.png",
    alt: "Bentley",
    title: "Bentley",
    height: 100,
  },
  {
    src: "/logos/brands/rolls royce.png",
    alt: "Rolls Royce",
    title: "Rolls Royce",
    height: 100,
  },
  {
    src: "/logos/brands/bmw.png",
    alt: "BMW",
    title: "BMW",
    height: 100,
  },
  {
    src: "/logos/brands/Land Rover.png",
    alt: "Land Rover",
    title: "Land Rover",
    height: 100,
  },
  {
    src: "/logos/brands/range rover.png",
    alt: "Range Rover",
    title: "Range Rover",
    height: 100,
  },
  {
    src: "/logos/brands/Tesla.png",
    alt: "Tesla",
    title: "Tesla",
    height: 100,
  },
  {
    src: "/logos/brands/Volkswagon.png",
    alt: "Volkswagen",
    title: "Volkswagen",
    height: 100,
  },
];

export default function Home() {
  const servicesData = getServicesData();
  
  return (
    <>
      {/* Scroll-aware navigation menu */}
      <ScrollNav />
      
      {/* Hero section */}
      <section 
        className="relative w-full min-h-screen pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-24 flex items-center justify-center bg-black"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
          <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 md:mb-10 text-balance leading-tight"
              style={{ 
                fontFamily: "var(--font-space-grotesk), sans-serif",
                color: "#ffffff",
                textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
              }}
          >
            Vehicle Rejuvenation
              <br className="hidden sm:block" />
              <span className="block sm:inline">
                <span 
                  className="shiny-text text-brand-red inline-block mt-2 sm:mt-0"
                  style={{ 
                    textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                    background: "linear-gradient(90deg, #E11C22 0%, #ff4444 25%, #E11C22 50%, #ff4444 75%, #E11C22 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "shiny-text 3s linear infinite"
                  }}
                >
                  Specialists
                </span>
              </span>
          </h1>
            
            <p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed"
              style={{ 
                color: "#ffffff",
                fontFamily: "var(--font-outfit), sans-serif",
                textShadow: "0 1px 4px rgba(0, 0, 0, 0.3)"
              }}
            >
            Meticulous detailing, paint correction, and protection services in
            Brighton and across Sussex. Studio workshop or mobile service.
          </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-stretch sm:items-center mb-8 sm:mb-10 md:mb-12">
              <a
                href="tel:08000029083"
                className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white/10 active:bg-white/20 text-sm sm:text-base md:text-lg px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 rounded-full font-semibold transition-all duration-200 uppercase tracking-wider min-w-[200px] sm:min-w-[180px] shadow-lg hover:shadow-xl"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                Call Now
              </a>
              <a
                href="https://wa.me/447926136965"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white/10 active:bg-white/20 text-sm sm:text-base md:text-lg px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 rounded-full font-semibold transition-all duration-200 uppercase tracking-wider min-w-[200px] sm:min-w-[180px] shadow-lg hover:shadow-xl"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                WhatsApp
              </a>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-2">
              <span 
                className="inline-flex items-center text-xs sm:text-sm md:text-base uppercase tracking-wider"
                style={{ 
                  color: "#ffffff",
                  fontFamily: "var(--font-outfit), sans-serif",
                  textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)"
                }}
              >
                <span className="mr-2 text-green-600">✓</span> Insured
              </span>
              <span 
                className="inline-flex items-center text-xs sm:text-sm md:text-base uppercase tracking-wider"
                style={{ 
                  color: "#ffffff",
                  fontFamily: "var(--font-outfit), sans-serif",
                  textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)"
                }}
              >
                <span className="mr-2 text-green-600">✓</span> Certified
              </span>
              <span 
                className="inline-flex items-center text-xs sm:text-sm md:text-base uppercase tracking-wider"
                style={{ 
                  color: "#ffffff",
                  fontFamily: "var(--font-outfit), sans-serif",
                  textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)"
                }}
              >
                <span className="mr-2 text-green-600">✓</span> Premium Products
              </span>
            </div>
          </div>
        </div>
      </section>
      
      <ServiceOverview />
      
      <ProofStrip />
      
      {/* Trusted Car Brands Logo Loop */}
      <section className="py-4 bg-black">
        <div className="container mx-auto px-4">
          <LogoLoop
            logos={carBrandLogos}
            speed={40}
            direction="right"
            logoHeight={100}
            gap={50}
            pauseOnHover={true}
            fadeOut={false}
            scaleOnHover={true}
            ariaLabel="Trusted car brands"
          />
        </div>
      </section>
      
      <ProcessSection />
      <TestimonialsPreview />
      
          {/* Instagram Gallery - Showcasing Each Service */}
      <InstagramGallery
            services={servicesData}
        title="Our Latest Work"
            subtitle="Explore our services through real transformations"
      />
      
      <CoverageArea />
      <FAQPreview />
      
      {/* Brand Logo Grid - Stationary logos linking to brands page */}
      <BrandLogoGrid />
      {/* BlogSection removed - Blog pages not ready yet for pitch/portfolio site */}
      {/* <BlogSection /> */}
    </>
  );
}
