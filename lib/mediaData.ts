import mediaData from "@/data/media-organization.json";

export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  type: "image" | "video";
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  location?: string;
  mediaIds: string[];
  media: MediaItem[];
}

export interface Service {
  id: string;
  name: string;
  projectIds: string[];
  projects: Project[];
}

export interface InstagramPost {
  video?: string;
  images?: string[];
  title: string;
  location?: string;
  description?: string;
  detailedDescription?: string; // Extended description
  duration?: string; // Estimated duration
  techniques?: string[]; // Techniques used
  results?: string[]; // Key results achieved
  tags?: string[];
  likes?: number;
  instagramUrl?: string;
  galleryUrl?: string;
  bookingUrl?: string;
}

export interface ServiceGroup {
  serviceName: string;
  examples: InstagramPost[];
}

// Helper function to generate detailed descriptions based on service type
function generateServiceDetails(serviceName: string, projectName: string): {
  description: string;
  detailedDescription: string;
  duration: string;
  techniques: string[];
  results: string[];
} {
  const nameLower = projectName.toLowerCase();
  
  // Car Detailing service
  if (serviceName === "Car Detailing") {
    const isExterior = nameLower.includes("exterior") || nameLower.includes("full detail");
    const isInterior = nameLower.includes("interior");
    const isPreDelivery = nameLower.includes("pre delivery") || nameLower.includes("pre-delivery");
    
    return {
      description: isPreDelivery 
        ? "Premium pre-delivery preparation ensuring your new vehicle arrives in showroom condition."
        : isExterior
        ? "Comprehensive exterior detailing with premium products and meticulous attention to detail."
        : isInterior
        ? "Thorough interior cleaning and protection for a refreshed cabin environment."
        : "Complete vehicle detailing service combining exterior and interior care.",
      detailedDescription: isPreDelivery
        ? `This ${projectName} involved a comprehensive pre-delivery detail to ensure the vehicle was in pristine condition before handover. Our meticulous process included safe pressure washing, chemical decontamination to remove industrial fallout, and a premium two-bucket wash method. The wheels and wheel arches received deep cleaning attention, followed by hand drying with premium microfibres. The finish was protected with premium sealants to maintain that showroom shine.`
        : `Our ${projectName} service delivered exceptional results through our proven detailing process. We began with safe pressure washing and pre-soak treatment, followed by chemical decontamination to remove tar, iron fallout, and bug contamination. The wheels and arches received thorough deep cleaning attention. Using our premium two-bucket wash method and hand drying with quality microfibres, we achieved a flawless finish that was then protected with premium sealants.`,
      duration: isExterior || isInterior ? "3-4 hours" : "5-6 hours",
      techniques: [
        "Safe pressure wash & pre-soak",
        "Chemical decontamination",
        "Two-bucket method wash",
        "Premium microfibre drying",
        "Premium sealant protection"
      ],
      results: [
        "Removed all surface contaminants",
        "Enhanced paint clarity and shine",
        "Protected finish for lasting results",
        "Spotless wheels and arches"
      ]
    };
  }
  
  // Paint Correction service
  if (serviceName === "Paint Correction") {
    const isMultiStage = nameLower.includes("multi") || nameLower.includes("stage") || nameLower.includes("full correction");
    const isRestoration = nameLower.includes("restoration") || nameLower.includes("refinement");
    
    return {
      description: isRestoration
        ? "Complete paint restoration removing years of defects to reveal the original showroom finish."
        : "Professional paint correction removing swirl marks, scratches, and defects to restore depth and clarity.",
      detailedDescription: isRestoration
        ? `This ${projectName} required extensive paint correction work to restore the vehicle's original showroom finish. Our process began with comprehensive paint depth measurements to ensure safe correction. We then performed multi-stage machine polishing using premium compounds and polishes, carefully removing swirl marks, light scratches, and oxidation. Each panel was inspected under multiple lighting conditions to ensure perfection. The result was a dramatic transformation with restored paint depth, enhanced clarity, and a mirror-like finish.`
        : `Our ${projectName} process transformed the vehicle's paintwork through meticulous correction techniques. After thorough paint depth measurements and a complete detailing preparation, we performed precision machine polishing using premium compounds. We removed swirl marks, light scratches, and oxidation defects while enhancing the paint's natural depth and gloss. Every panel was carefully inspected under multiple lighting conditions to ensure consistent, professional-grade results throughout.`,
      duration: isMultiStage ? "2-3 days" : "1-2 days",
      techniques: [
        "Paint depth measurement",
        isMultiStage ? "Multi-stage machine polishing" : "Precision machine polishing",
        "Premium compound & polish",
        "Multi-angle light inspection",
        "Premium protection application"
      ],
      results: [
        "Significant swirl mark reduction",
        "Restored paint depth and gloss",
        "Enhanced clarity and reflection",
        "Professional-grade mirror finish"
      ]
    };
  }
  
  // Ceramic Coating service
  if (serviceName === "Ceramic Coating") {
    const isFullCoating = nameLower.includes("full") || nameLower.includes("complete");
    const isApplication = nameLower.includes("application") || nameLower.includes("shield");
    
    return {
      description: "Premium VRS SiC ceramic coating providing up to 2 years of protection with hydrophobic properties.",
      detailedDescription: `This ${projectName} involved the application of our premium VRS SiC ceramic coating system. Prior to coating, the vehicle underwent comprehensive paint correction to ensure a flawless foundation. The coating was meticulously applied panel by panel in a controlled environment, ensuring even coverage and proper curing. Our ceramic coating creates a permanent bond with the paint, providing exceptional protection against UV damage, chemical stains, and environmental contaminants. The hydrophobic properties make maintenance washing effortless, with water beading off the surface instantly.`,
      duration: "2-3 days",
      techniques: [
        "Pre-correction preparation",
        "Panel-by-panel application",
        "VRS SiC ceramic coating",
        "Controlled environment curing",
        "Final inspection & approval"
      ],
      results: [
        "Up to 2 years protection",
        "Superior hydrophobic properties",
        "Enhanced gloss and depth",
        "Easy maintenance washing",
        "UV and chemical resistance"
      ]
    };
  }
  
  // PPF service
  if (serviceName === "PPF - Paint Protection Film") {
    return {
      description: "Premium self-healing paint protection film providing invisible protection against stone chips and road debris.",
      detailedDescription: `This ${projectName} featured the installation of our premium self-healing paint protection film. The film was precisely cut to pattern and installed with meticulous attention to detail, ensuring edge wrapping where possible for seamless protection. Our premium film features self-healing technology that automatically repairs minor scratches and swirl marks when exposed to heat. The installation was completed in our controlled studio environment, with careful bubble removal and final inspection to ensure perfection. The result is invisible protection that maintains the vehicle's original appearance while providing exceptional durability.`,
      duration: "1-2 days",
      techniques: [
        "Precise pattern cutting",
        "Precision installation",
        "Edge wrapping technique",
        "Bubble removal process",
        "Final quality inspection"
      ],
      results: [
        "Invisible protection",
        "Self-healing technology",
        "Stone chip resistance",
        "Maintained original appearance",
        "Installation warranty included"
      ]
    };
  }
  
  // Specials service (default)
  return {
    description: "Premium vehicle rejuvenation service tailored to your specific requirements.",
    detailedDescription: `Our ${projectName} service combined premium techniques and products to deliver exceptional results. Every step of the process was executed with meticulous attention to detail, ensuring your vehicle received the highest standard of care.`,
    duration: "Varies by service",
    techniques: [
      "Premium products",
      "Expert techniques",
      "Quality craftsmanship"
    ],
    results: [
      "Exceptional results",
      "Premium finish",
      "Customer satisfaction"
    ]
  };
}

// Transform JSON data to InstagramGallery format
export function getServicesData(): ServiceGroup[] {
  const services: Service[] = mediaData.services.filter(
    (s) => s.id !== "service-1767918261314" && 
           s.id !== "service-1767918423587" && 
           s.id !== "service-1767918499965"
  );

  return services.map((service) => {
    const examples: InstagramPost[] = service.projects.map((project) => {
      // Get the first video or first image as primary media
      const firstVideo = project.media.find((m) => m.type === "video");
      const firstImage = project.media.find((m) => m.type === "image");
      const allImages = project.media.filter((m) => m.type === "image").map((m) => m.src);

      // Generate service-specific details
      const serviceDetails = generateServiceDetails(service.name, project.name);

      const example: InstagramPost = {
        title: project.name,
        location: project.location || "BRIGHTON & SUSSEX",
        description: project.description || serviceDetails.description,
        detailedDescription: serviceDetails.detailedDescription,
        duration: serviceDetails.duration,
        techniques: serviceDetails.techniques,
        results: serviceDetails.results,
        tags: [],
        likes: 0,
        instagramUrl: "https://www.instagram.com/",
        galleryUrl: "/gallery",
        bookingUrl: "/contact",
      };

      // Add media - prioritize video, but support images
      if (firstVideo) {
        example.video = firstVideo.src;
        // Also include images if there are any (for projects with both video and images)
        if (allImages.length > 0) {
          example.images = allImages;
        }
      } else if (allImages.length > 0) {
        // Use images array if no video
        example.images = allImages;
      }

      // Generate tags from project name and service
      const words = project.name.split(" ");
      const serviceWords = service.name.split(" ");
      example.tags = [
        ...words.slice(0, 2).filter(w => w.length > 2),
        ...serviceWords.slice(0, 1).filter(w => w.length > 2)
      ].slice(0, 4);

      return example;
    });

    return {
      serviceName: service.name,
      examples,
    };
  });
}
