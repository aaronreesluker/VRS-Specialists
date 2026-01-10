const fs = require('fs');
const path = require('path');

// Read the exported JSON
const exportedDataPath = 'c:/Users/aaron/Downloads/media-organization-export-1768000344865.json';
const exportedData = JSON.parse(fs.readFileSync(exportedDataPath, 'utf8'));

// Read existing data
const existingData = JSON.parse(
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
  
  return "Premium vehicle rejuvenation service tailored to your specific requirements.";
}

// Function to determine service based on project name
function determineService(projectName) {
  const nameLower = projectName.toLowerCase();
  
  // PPF keywords
  if (nameLower.includes("ppf") || nameLower.includes("paint protection") || nameLower.includes("protection film")) {
    return "ppf";
  }
  
  // Ceramic Coating keywords
  if (nameLower.includes("ceramic") || nameLower.includes("coating") || nameLower.includes("hydrophobic")) {
    return "coating";
  }
  
  // Paint Correction keywords
  if (nameLower.includes("correction") || nameLower.includes("polish") || nameLower.includes("restoration") || nameLower.includes("refinement")) {
    return "correction";
  }
  
  // Detailing keywords
  if (nameLower.includes("detail") || nameLower.includes("pre delivery") || nameLower.includes("pre-delivery") || 
      nameLower.includes("maintenance")) {
    return "detailing";
  }
  
  // Mobile service
  if (nameLower.includes("mobile")) {
    return "specials";
  }
  
  // Default to specials
  return "specials";
}

// Function to clean up duplicate media IDs in a project
function cleanMediaDuplicates(project) {
  const seenIds = new Set();
  const uniqueMedia = [];
  const uniqueMediaIds = [];
  
  project.media.forEach(media => {
    if (!seenIds.has(media.id)) {
      seenIds.add(media.id);
      uniqueMedia.push(media);
      uniqueMediaIds.push(media.id);
    }
  });
  
  // Also ensure mediaIds array matches
  project.mediaIds = uniqueMediaIds;
  project.media = uniqueMedia;
  
  return project;
}

// Process exported data
const processedProjects = [];

// First, merge duplicate Caterham 7 projects
let caterhamProject = null;
const otherProjects = [];

exportedData.services.forEach(service => {
  service.projects.forEach(project => {
    const projectNameLower = project.name.toLowerCase().trim();
    if (projectNameLower === "caterham 7") {
      if (!caterhamProject) {
        caterhamProject = { ...project };
      } else {
        // Merge media - combine all unique media
        const allMediaIds = new Set([...caterhamProject.mediaIds, ...project.mediaIds]);
        const allMedia = [...caterhamProject.media];
        
        // Add unique media from second project
        project.media.forEach(media => {
          if (!caterhamProject.media.find(m => m.id === media.id)) {
            allMedia.push(media);
          }
        });
        
        caterhamProject.mediaIds = Array.from(allMediaIds);
        caterhamProject.media = allMedia;
        
        // Keep description from the one that has it
        if (!caterhamProject.description && project.description) {
          caterhamProject.description = project.description;
        }
      }
    } else {
      otherProjects.push(project);
    }
  });
});

if (caterhamProject) {
  otherProjects.push(caterhamProject);
}

// Process all projects
otherProjects.forEach(project => {
  // Clean up duplicate media IDs
  const cleanedProject = cleanMediaDuplicates({ ...project });
  
  // Determine correct service
  const serviceId = determineService(cleanedProject.name);
  
  // Generate description if missing
  const serviceName = {
    'detailing': 'Car Detailing',
    'correction': 'Paint Correction',
    'coating': 'Ceramic Coating',
    'ppf': 'PPF Protection',
    'specials': 'Specials'
  }[serviceId] || 'Specials';
  
  const description = cleanedProject.description || generateDescription(serviceName, cleanedProject.name);
  
  processedProjects.push({
    ...cleanedProject,
    description: description,
    _serviceId: serviceId // Temporary field for grouping
  });
});

// Group projects by service
const serviceMap = new Map();
processedProjects.forEach(project => {
  const serviceId = project._serviceId;
  delete project._serviceId; // Remove temporary field
  
  if (!serviceMap.has(serviceId)) {
    serviceMap.set(serviceId, []);
  }
  serviceMap.get(serviceId).push(project);
});

// Build new services array
const newServices = [];

// Add existing services first (excluding ones we're replacing)
const existingServiceIds = new Set(existingData.services.map(s => s.id));
['detailing', 'correction', 'coating', 'ppf', 'specials'].forEach(serviceId => {
  if (existingServiceIds.has(serviceId)) {
    const existingService = existingData.services.find(s => s.id === serviceId);
    
    // Merge with new projects, avoiding duplicates by name
    const newProjects = serviceMap.get(serviceId) || [];
    const existingProjectNames = new Set(existingService.projects.map(p => p.name.toLowerCase().trim()));
    
    const projectsToAdd = newProjects.filter(np => !existingProjectNames.has(np.name.toLowerCase().trim()));
    const allProjects = [...existingService.projects, ...projectsToAdd];
    const allProjectIds = allProjects.map(p => p.id);
    
    newServices.push({
      ...existingService,
      projectIds: allProjectIds,
      projects: allProjects
    });
  } else {
    // Create new service
    const serviceNames = {
      'detailing': 'Car Detailing',
      'correction': 'Paint Correction',
      'coating': 'Ceramic Coating',
      'ppf': 'PPF Protection',
      'specials': 'Specials'
    };
    
    const projects = serviceMap.get(serviceId) || [];
    const projectIds = projects.map(p => p.id);
    
    if (projects.length > 0) {
      newServices.push({
        id: serviceId,
        name: serviceNames[serviceId],
        projectIds: projectIds,
        projects: projects
      });
    }
  }
});

// Add any existing services that weren't touched
existingData.services.forEach(service => {
  if (!['detailing', 'correction', 'coating', 'ppf', 'specials'].includes(service.id)) {
    newServices.push(service);
  }
});

// Write merged data
const mergedData = {
  services: newServices
};

fs.writeFileSync(
  path.join(__dirname, '../data/media-organization.json'),
  JSON.stringify(mergedData, null, 2)
);

console.log('Data merged successfully!');
console.log(`Total services: ${newServices.length}`);
newServices.forEach(service => {
  console.log(`  ${service.name}: ${service.projects.length} projects`);
});
