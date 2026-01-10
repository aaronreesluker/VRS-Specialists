const fs = require('fs');
const path = require('path');

// Read the current data
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/media-organization.json'), 'utf8')
);

// Function to generate description based on service and project name
function generateDescription(serviceName, projectName) {
  const nameLower = projectName.toLowerCase();
  
  if (serviceName === "Car Detailing") {
    const isPreDelivery = nameLower.includes("pre delivery") || nameLower.includes("pre-delivery");
    const isExterior = nameLower.includes("exterior") || nameLower.includes("full detail");
    const isInterior = nameLower.includes("interior");
    const isMaintenance = nameLower.includes("maintenance");
    
    if (isPreDelivery) {
      return "Premium pre-delivery preparation ensuring your new vehicle arrives in showroom condition.";
    }
    if (isMaintenance) {
      return "Regular maintenance detailing to keep your vehicle in pristine condition between full details.";
    }
    if (isExterior) {
      return "Comprehensive exterior detailing with premium products and meticulous attention to detail.";
    }
    if (isInterior) {
      return "Thorough interior cleaning and protection for a refreshed cabin environment.";
    }
    return "Complete vehicle detailing service combining exterior and interior care.";
  }
  
  if (serviceName === "Paint Correction") {
    const isRestoration = nameLower.includes("restoration") || nameLower.includes("refinement");
    return isRestoration
      ? "Complete paint restoration removing years of defects to reveal the original showroom finish."
      : "Professional paint correction removing swirl marks, scratches, and defects to restore depth and clarity.";
  }
  
  if (serviceName === "Ceramic Coating") {
    const hasHydrophobic = nameLower.includes("hydrophobic");
    return hasHydrophobic
      ? "Advanced hydrophobic coating application providing exceptional water-repelling properties and long-lasting protection."
      : "Premium VRS SiC ceramic coating providing up to 2 years of protection with hydrophobic properties.";
  }
  
  if (serviceName === "PPF Protection") {
    return "Premium paint protection film installation providing invisible protection against road hazards.";
  }
  
  // For Specials, keep it generic but can be customized later
  return "Premium vehicle rejuvenation service tailored to your specific requirements.";
}

// Update all projects with descriptions
data.services.forEach(service => {
  service.projects.forEach(project => {
    // Only update if it's the generic description
    if (project.description === "Premium vehicle rejuvenation service tailored to your specific requirements." ||
        project.description === "Premium car detailing service delivering exceptional results through meticulous attention to detail.") {
      project.description = generateDescription(service.name, project.name);
    }
  });
});

// Write back
fs.writeFileSync(
  path.join(__dirname, '../data/media-organization.json'),
  JSON.stringify(data, null, 2)
);

console.log('Descriptions updated successfully!');

