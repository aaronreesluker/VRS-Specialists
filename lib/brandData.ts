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
  // Include ALL Specials projects - this ensures Specials appears as a category on the brands page
  const specialsService = servicesData.find(s => s.serviceName === "Specials");
  if (specialsService && specialsService.examples.length > 0) {
    // Add all Specials examples - they will also appear under their brand if applicable
    brandMap.set("Specials", specialsService.examples);
  }
  
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

