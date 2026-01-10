import type { Metadata } from "next";
import Link from "next/link";
import ServiceOverview from "@/components/home/ServiceOverview";
import ProofStrip from "@/components/home/ProofStrip";
import ProcessSection from "@/components/home/ProcessSection";
import TestimonialsPreview from "@/components/home/TestimonialsPreview";
import CoverageArea from "@/components/home/CoverageArea";
import FAQPreview from "@/components/home/FAQPreview";
// import BlogSection from "@/components/BlogSection"; // Removed - Blog pages not ready yet
import { ScrollCarHero } from "@/components/ScrollCarHero";
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
      
      {/* Scroll-driven cinematic car hero section */}
      {/* 
        SETUP INSTRUCTIONS:
        1. Place your PNG frames in: /public/car/frames/
        2. Naming: frame_0001.png, frame_0002.png, ..., frame_0140.png
        3. Adjust frameCount to match your total frames
        4. Set flashColor to match the background color of the next section
      */}
      <ScrollCarHero
        frameCount={160}
        heroHeight={300} // Adjusted for mobile in component (max 200vh on mobile)
        titleMain="V.R.S"
        titleSub="Vehicle Rejuvenation Specialists"
        flashColor="#929292" // Matches next section background
        backgroundColor="bg-black"
        frameBasePath="/car/frames"
        frameFormat="%04d.png"
      />
      
      {/* Next section - revealed through flash transition */}
      {/* IMPORTANT: Background color should match flashColor prop above */}
      <section 
        className="relative w-full min-h-screen py-12 sm:py-16 md:py-24 flex items-center justify-center"
        style={{ backgroundColor: "#929292" }} // Matches last frame of car animation
      >
        <div className="container mx-auto px-4 text-center text-white">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-balance"
            style={{ 
              fontFamily: "var(--font-space-grotesk), sans-serif",
              color: "#FFFFFF",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
            }}
          >
            Vehicle Rejuvenation
            <br />
            <span 
              className="shiny-text text-brand-red inline-block"
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
          </h1>
          <p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-2xl mx-auto px-2"
            style={{ 
              color: "#FFFFFF",
              fontFamily: "var(--font-outfit), sans-serif",
              textShadow: "0 1px 4px rgba(0, 0, 0, 0.3)"
            }}
          >
            Meticulous detailing, paint correction, and protection services in
            Brighton and across Sussex. Studio workshop or mobile service.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-4 sm:mb-6">
            <a
              href="tel:08000029083"
              className="border-2 border-white text-white hover:bg-white/10 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-colors duration-200 uppercase tracking-wider w-full sm:w-auto text-center"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Call Now
            </a>
            <a
              href="https://wa.me/447926136965"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white hover:bg-white/10 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-colors duration-200 uppercase tracking-wider w-full sm:w-auto text-center"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              WhatsApp
            </a>
          </div>
          <p 
            className="text-xs sm:text-sm uppercase tracking-wider px-2"
            style={{ 
              color: "#FFFFFF",
              fontFamily: "var(--font-outfit), sans-serif",
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)"
            }}
          >
            ✓ Insured ✓ Certified ✓ Premium Products
          </p>
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
