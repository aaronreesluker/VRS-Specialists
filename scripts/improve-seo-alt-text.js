const fs = require('fs');
const path = require('path');

// Read the media organization file
const dataPath = path.join(__dirname, '../data/media-organization.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Function to generate SEO-friendly alt text
function generateAltText(project, mediaItem, index, totalImages) {
  const projectName = project.name || '';
  const brand = extractBrand(projectName);
  const serviceType = getServiceType(project);
  const location = project.location ? ` in ${project.location}` : '';
  
  // If it's a video
  if (mediaItem.type === 'video') {
    if (project.description) {
      return `${projectName}${location} - ${project.description} - Professional car detailing video`;
    }
    return `${projectName}${location} - ${serviceType} service - Professional car detailing video`;
  }
  
  // For images, create descriptive alt text
  const imageNumber = totalImages > 1 ? ` (Image ${index + 1} of ${totalImages})` : '';
  
  // Use project name and description if available
  if (project.description) {
    return `${projectName}${location} - ${project.description}${imageNumber}`;
  }
  
  // Use full project name with service context
  return `${projectName}${location} - Premium ${serviceType} service${imageNumber}`;
}

function extractBrand(projectName) {
  const brands = ['BMW', 'Audi', 'Porsche', 'McLaren', 'Ferrari', 'Mercedes', 'Range Rover', 'Land Rover', 'Jaguar', 'Tesla', 'Aston Martin', 'Lamborghini', 'Rolls Royce', 'Volkswagen', 'Volvo'];
  const nameUpper = projectName.toUpperCase();
  for (const brand of brands) {
    if (nameUpper.includes(brand.toUpperCase())) {
      if (brand === 'ROLLS-ROYCE' || brand === 'ROLLS ROYCE') return 'Rolls Royce';
      if (brand === 'LAND ROVER' && nameUpper.includes('RANGE ROVER')) return 'Range Rover';
      return brand;
    }
  }
  return null;
}

function getServiceType(project) {
  const name = (project.name || '').toLowerCase();
  if (name.includes('coating') || name.includes('ceramic')) return 'ceramic coating';
  if (name.includes('correction') || name.includes('polish')) return 'paint correction';
  if (name.includes('ppf') || name.includes('protection film')) return 'PPF protection';
  if (name.includes('detail')) return 'car detailing';
  return 'vehicle rejuvenation';
}

// Update alt text for all media items
let updated = 0;
data.services.forEach(service => {
  service.projects.forEach(project => {
    if (project.media && Array.isArray(project.media)) {
      const totalImages = project.media.length;
      project.media.forEach((mediaItem, index) => {
        // Always update to ensure consistent, SEO-friendly format
        const currentAlt = mediaItem.alt || '';
        const newAlt = generateAltText(project, mediaItem, index, totalImages);
        
        // Only update if different (to avoid unnecessary writes)
        if (currentAlt !== newAlt) {
          mediaItem.alt = newAlt;
          updated++;
        }
      });
    }
  });
});

// Ensure all projects have location if missing
data.services.forEach(service => {
  service.projects.forEach(project => {
    if (!project.location) {
      project.location = 'BRIGHTON & SUSSEX';
    }
  });
});

// Write back to file
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Updated ${updated} media items with SEO-friendly alt text`);
console.log(`✅ Ensured all projects have location data`);
console.log('✅ SEO improvements complete!');

