import type { Metadata } from "next";
import Link from "next/link";
import ServiceCategory from "@/components/services/ServiceCategory";

export const metadata: Metadata = {
  title: "Our Services - Car Detailing, Paint Correction, Ceramic Coating & PPF",
  description:
    "Comprehensive vehicle rejuvenation services including detailing, paint correction, ceramic coating, and paint protection film. Transparent pricing from £125.",
};

const services = [
  {
    id: "detailing",
    name: "Car Detailing",
    subtitle: "Decontamination Power Wash",
    price: "from £125",
    description:
      "Meticulous exterior and interior detailing using premium products and techniques.",
    includes: [
      "Safe pressure wash and pre-soak",
      "Chemical decontamination (tar, iron, bugs)",
      "Wheel and arch deep clean",
      "Two-bucket method wash",
      "Hand drying with premium microfibres",
      "Interior vacuum and wipe (optional)",
      "Finishing touches and protection",
    ],
    who: "Ideal for regular maintenance, pre-sale preparation, or those who value a meticulously clean vehicle.",
    outcomes: [
      "Removal of surface contaminants",
      "Enhanced paint clarity and shine",
      "Protected and maintained finish",
      "Spotless wheels and arches",
    ],
    addOns: [
      "Interior deep clean and protection",
      "Engine bay cleaning",
      "Headlight restoration",
      "Trim dressing and protection",
    ],
  },
  {
    id: "correction",
    name: "Paint Correction",
    subtitle: "1 Stage Paint Enhancement",
    price: "from £250",
    description:
      "Remove swirl marks, light scratches, and defects to restore paint depth and clarity.",
    includes: [
      "Full detailing preparation",
      "Paint depth measurement",
      "1-stage machine polishing",
      "Premium compound and polish",
      "Paint inspection under multiple lights",
      "Final wipe-down and protection",
      "Aftercare instructions",
    ],
    who: "Perfect for vehicles with light to moderate swirl marks, scratches, or faded paint that need restoration.",
    outcomes: [
      "Significant swirl mark reduction",
      "Restored paint depth and gloss",
      "Enhanced clarity and reflection",
      "Professional-grade finish",
    ],
    addOns: [
      "2-stage correction (moderate defects)",
      "3-stage correction (severe defects)",
      "Ceramic coating application",
      "Interior protection package",
    ],
  },
  {
    id: "coating",
    name: "Ceramic Coating",
    subtitle: "2 Year Ceramic Coating",
    price: "from £400",
    description:
      "Long-term protection using VRS SiC ceramic coating technology for hydrophobic properties and durability.",
    includes: [
      "Full decontamination wash",
      "1-stage paint correction",
      "Surface preparation and panel wipe",
      "VRS SiC ceramic coating application",
      "Curing time and inspection",
      "Final protection layer",
      "Comprehensive aftercare guide",
    ],
    who: "Best for vehicle owners seeking long-term protection, easier maintenance, and enhanced appearance retention.",
    outcomes: [
      "2-year protection against UV, oxidation, and contaminants",
      "Hydrophobic surface (water beads and sheets)",
      "Reduced maintenance effort",
      "Enhanced gloss and depth",
      "Improved scratch resistance",
    ],
    addOns: [
      "Glass coating",
      "Wheel coating",
      "Interior fabric protection",
      "Extended warranty options",
    ],
  },
  {
    id: "ppf",
    name: "PPF - Paint Protection Film",
    subtitle: "Front End Protection",
    price: "from £1,250",
    description:
      "Invisible self-healing film protection for bonnet, bumper, headlights, wings, and mirrors.",
    includes: [
      "Full front end coverage (bonnet, bumper, headlights, wings, mirrors)",
      "Premium self-healing film",
      "Precise pattern cutting and installation",
      "Edge wrapping where possible",
      "Bubble removal and final inspection",
      "Curing instructions",
      "Installation warranty",
    ],
    who: "Essential for new or high-value vehicles, daily drivers on motorways, or those prioritising stone chip protection.",
    outcomes: [
      "Protection against stone chips and road debris",
      "Self-healing minor scratches and swirls",
      "Invisible protection (maintains original appearance)",
      "Preserved vehicle value",
      "Reduced repair costs",
    ],
    addOns: [
      "Full front end + doors",
      "Full body coverage",
      "Roof and pillar protection",
      "Ceramic coating over PPF",
    ],
  },
  {
    id: "dry-ice",
    name: "Dry Ice Blasting",
    subtitle: "Underbody Decontamination",
    price: "from £950",
    description:
      "Advanced dry ice blasting technology for thorough underbody decontamination and restoration.",
    includes: [
      "Complete underbody inspection",
      "Dry ice blasting treatment",
      "Removal of road grime, salt, and contaminants",
      "Rust prevention treatment",
      "Protective coating application",
      "Final inspection and documentation",
    ],
    who: "Ideal for vehicles with heavy underbody contamination, classic car restoration, or preparing for long-term storage.",
    outcomes: [
      "Complete underbody decontamination",
      "Rust prevention and protection",
      "Restored underbody appearance",
      "Extended vehicle longevity",
    ],
    addOns: [
      "Engine bay dry ice treatment",
      "Extended warranty options",
      "Additional protective coatings",
    ],
  },
  {
    id: "maintenance-club",
    name: "Maintenance Club",
    subtitle: "Safe Maintenance Wash",
    price: "from £60",
    description:
      "Regular maintenance washing service to keep your vehicle in pristine condition between full details.",
    includes: [
      "Safe two-bucket method wash",
      "Premium pH-neutral shampoo",
      "Wheel and tire cleaning",
      "Hand drying with premium microfibres",
      "Quick interior vacuum",
      "Tire dressing",
      "Light protection top-up",
    ],
    who: "Perfect for vehicle owners who want to maintain their vehicle's appearance between full detailing services.",
    outcomes: [
      "Maintained vehicle appearance",
      "Extended protection between details",
      "Regular care and attention",
      "Cost-effective maintenance solution",
    ],
    addOns: [
      "Interior wipe-down",
      "Glass cleaning",
      "Additional protection layers",
    ],
  },
  {
    id: "interior-valeting",
    name: "Interior Valeting",
    subtitle: "Complete Interior Care",
    price: "from £150",
    description:
      "Comprehensive interior cleaning and protection service for all vehicle surfaces.",
    includes: [
      "Complete vacuum and air dusting",
      "Upholstery deep cleaning",
      "Leather cleaning and conditioning",
      "Dashboard and trim cleaning",
      "Carpet and mat cleaning",
      "Glass cleaning",
      "Interior protection application",
      "Odor elimination",
    ],
    who: "Essential for maintaining a clean, fresh, and protected interior environment in your vehicle.",
    outcomes: [
      "Spotless interior surfaces",
      "Protected and conditioned materials",
      "Fresh, clean environment",
      "Extended interior longevity",
    ],
    addOns: [
      "Fabric protection treatment",
      "Leather protection coating",
      "Headliner cleaning",
      "Air vent deep cleaning",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h1 className="mb-4">Our Services</h1>
            <p className="text-lg text-dark-700 max-w-3xl mx-auto">
              Comprehensive vehicle rejuvenation services delivered with
              meticulous attention to detail. From regular detailing to
              long-term protection solutions.
            </p>
          </div>

          {/* Service Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 hover:border-primary-500 transition-all"
              >
                <h2 className="text-xl font-bold mb-2 text-dark-900">
                  {service.name}
                </h2>
                <p className="text-2xl font-bold text-primary-600 mb-3">
                  {service.price}
                </p>
                <p className="text-dark-700 mb-4 text-sm">
                  {service.subtitle}
                </p>
                <a
                  href={`#${service.id}`}
                  className="text-primary-600 font-semibold hover:underline"
                >
                  View details ↓
                </a>
              </div>
            ))}
          </div>

          {/* Individual Service Sections */}
          <div className="space-y-24">
            {services.map((service) => (
              <ServiceCategory key={service.id} service={service} />
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-24 text-center bg-primary-50 border border-primary-200 rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">
              Ready to Transform Your Vehicle?
            </h2>
            <p className="text-lg text-dark-700 mb-8 max-w-2xl mx-auto">
              Contact us today for a free consultation and quote. We'll assess
              your vehicle and recommend the best services for your needs.
            </p>
            <Link href="/contact" className="btn-primary text-lg px-8 py-4">
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

