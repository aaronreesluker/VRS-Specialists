import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ServiceOverview from "@/components/home/ServiceOverview";
import ProofStrip from "@/components/home/ProofStrip";
import ProcessSection from "@/components/home/ProcessSection";
import TestimonialsPreview from "@/components/home/TestimonialsPreview";
import CoverageArea from "@/components/home/CoverageArea";
import FAQPreview from "@/components/home/FAQPreview";
import ProductsSection from "@/components/home/ProductsSection";
import VideoHero from "@/components/home/VideoHero";
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
      
      {/* Video Section */}
      <VideoHero />
      
      {/* Hero section */}
      <section 
        className="relative w-full min-h-screen pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-24 flex flex-col items-center justify-center bg-black"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center justify-center">
          <div className="max-w-4xl mx-auto text-center">
            {/* Subtitle */}
            <h2 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-4 sm:mb-5 md:mb-6 text-balance leading-tight"
              style={{ 
                fontFamily: "var(--font-outfit), sans-serif",
                color: "#ffffff",
                textShadow: "0 1px 4px rgba(0, 0, 0, 0.3)",
                letterSpacing: "0.1em"
              }}
            >
              Vehicle Rejuvenation Specialists
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-stretch sm:items-center mb-4 sm:mb-5 md:mb-6">
              <a
                href="tel:08000029083"
                className="hero-btn-call-now inline-flex items-center justify-center border-2 border-white text-white hover:bg-white/10 active:bg-white/20 text-sm sm:text-base md:text-lg px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 rounded-full font-semibold transition-all duration-200 uppercase tracking-wider min-w-[200px] sm:min-w-[180px] shadow-lg"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                Call Now
              </a>
              <a
                href="https://wa.me/447926136965"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn-whatsapp inline-flex items-center justify-center border-2 border-white text-white hover:bg-white/10 active:bg-white/20 text-sm sm:text-base md:text-lg px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 rounded-full font-semibold transition-all duration-200 uppercase tracking-wider min-w-[200px] sm:min-w-[180px] shadow-lg"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                WhatsApp
              </a>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 md:gap-x-10 lg:gap-x-12 gap-y-2 mb-4">
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
        
        {/* Animated Scroll Mouse Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center">
            <span 
              className="text-white/70 text-xs uppercase tracking-widest mb-2"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Scroll
            </span>
            <div className="w-6 h-10 border-2 border-white/70 rounded-full flex justify-center p-2">
              <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-scroll-mouse"></div>
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
      
      <ProductsSection />
      
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
