import mediaData from "@/data/media-organization.json";
import { InstagramPost, ServiceGroup } from "./mediaData";
import { getServicesData } from "./mediaData";

export interface BrandGroup {
  brandName: string;
  examples: InstagramPost[];
}

// Common car brands to extract from project names
// Note: Bentley is excluded as it's categorized under Specials
const CAR_BRANDS = [
  "Aston Martin",
  "Audi",
  "BMW",
  "Ferrari",
  "Jaguar",
  "Lamborghini",
  "Land Rover",
  "McLaren",
  "Mercedes",
  "Porsche",
  "Range Rover",
  "Rolls Royce",
  "Rolls-Royce",
  "Tesla",
  "Volkswagen",
  "Volvo",
];

// Function to extract car brand from project name
function extractBrand(projectName: string): string | null {
  const nameUpper = projectName.toUpperCase();
  
  // First, check for brand in parentheses (e.g., "(Jaguar)", "(audi)", "(bmw)")
  const parenMatch = projectName.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const brandInParens = parenMatch[1].trim();
    const brandInParensUpper = brandInParens.toUpperCase();
    
    // Check if it matches any known brand
    for (const brand of CAR_BRANDS) {
      const brandUpper = brand.toUpperCase();
      if (brandInParensUpper === brandUpper || brandInParensUpper.includes(brandUpper) || brandUpper.includes(brandInParensUpper)) {
        // Handle special cases
        if (brandUpper === "ROLLS-ROYCE" || brandUpper === "ROLLS ROYCE") {
          return "Rolls Royce";
        }
        if (brandUpper === "LAND ROVER" && nameUpper.includes("RANGE ROVER")) {
          return "Range Rover";
        }
        if (brandUpper === "LAND ROVER" && !nameUpper.includes("RANGE ROVER")) {
          return "Land Rover";
        }
        return brand;
      }
    }
  }
  
  // Check for BMW model codes (M340i, M3, M4, M5, etc.)
  if (/M\d{3,4}I?/i.test(projectName) || /^M[1-9]/i.test(projectName)) {
    return "BMW";
  }
  
  // Check for each brand (case-insensitive)
  for (const brand of CAR_BRANDS) {
    const brandUpper = brand.toUpperCase();
    if (nameUpper.includes(brandUpper)) {
      // Handle special cases
      if (brandUpper === "ROLLS-ROYCE" || brandUpper === "ROLLS ROYCE") {
        return "Rolls Royce";
      }
      if (brandUpper === "LAND ROVER" && nameUpper.includes("RANGE ROVER")) {
        return "Range Rover";
      }
      if (brandUpper === "LAND ROVER" && !nameUpper.includes("RANGE ROVER")) {
        return "Land Rover";
      }
      return brand;
    }
  }
  
  return null;
}

// Brands that should always appear, even if they have 0 projects
const ALWAYS_SHOW_BRANDS = ["McLaren", "Ferrari", "Tesla", "Jaguar"];

// Transform service data to brand-based groups
export function getBrandsData(): BrandGroup[] {
  const servicesData = getServicesData();
  
  // Flatten all examples from all services
  const allExamples: Array<InstagramPost & { serviceName: string }> = [];
  servicesData.forEach((service) => {
    service.examples.forEach((example) => {
      allExamples.push({
        ...example,
        serviceName: service.serviceName,
      });
    });
  });
  
  // Group by brand
  const brandMap = new Map<string, InstagramPost[]>();
  
  allExamples.forEach((example) => {
    const brand = extractBrand(example.title || "");
    if (brand) {
      if (!brandMap.has(brand)) {
        brandMap.set(brand, []);
      }
      brandMap.get(brand)!.push(example);
    }
  });
  
  // Also check for "Specials" service and add it as a brand
  // Only include Specials projects that don't have a recognizable brand
  const specialsService = servicesData.find(s => s.serviceName === "Specials");
  if (specialsService && specialsService.examples.length > 0) {
    // Filter out examples that have a recognizable brand - they should only appear in their brand category
    const specialsOnly = specialsService.examples.filter(example => {
      const brand = extractBrand(example.title || "");
      return !brand; // Only include if no brand was found
    });
    
    // Only add Specials category if there are items without recognizable brands
    if (specialsOnly.length > 0) {
      brandMap.set("Specials", specialsOnly);
    }
  }
  
  // Ensure always-show brands are included even if they have 0 projects
  ALWAYS_SHOW_BRANDS.forEach((brandName) => {
    if (!brandMap.has(brandName)) {
      brandMap.set(brandName, []);
    }
  });
  
  // Convert to array and sort by brand name
  const brandGroups: BrandGroup[] = Array.from(brandMap.entries())
    .map(([brandName, examples]) => ({
      brandName,
      examples,
    }))
    .sort((a, b) => {
      // Put Specials at the end
      if (a.brandName === "Specials") return 1;
      if (b.brandName === "Specials") return -1;
      return a.brandName.localeCompare(b.brandName);
    });
  
  return brandGroups;
}

