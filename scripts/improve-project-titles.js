const fs = require('fs');
const path = require('path');

const data = require('../data/media-organization.json');

// Title improvements mapping
const titleImprovements = {
  // Car Detailing
  'BMW M3 Touring Pre Delivery Detail': 'BMW M3 Touring Pre-Delivery Detail',
  'Event Ready rolls royce ghost': 'Event Ready Rolls-Royce Ghost',
  'Porsche 90 Pre-Delivery Detailing': 'Porsche 911 (930) Pre-Delivery Detailing',
  'Mclaren 600LT Maintenance Detailing': 'McLaren 600LT Maintenance Detailing',
  
  // Paint Correction
  'Audi Q3 New Car Prep & Protection Package': 'Audi Q3 New Car Preparation & Protection',
  
  // Ceramic Coating
  'Mclaren 675ltspider Hydrophobic coating': 'McLaren 675LT Spider Hydrophobic Coating',
  
  // PPF Protection
  'Bmw z4 140i PPF protection': 'BMW Z4 140i PPF Protection',
  
  // Specials - Vehicle names that need improvement
  'M340i': 'BMW M340i',
  'Mclaren 650s ': 'McLaren 650S',
  '1997 porsche911carreras ': 'Porsche 911 Carrera S (1997)',
  'BMW M4 CS ': 'BMW M4 CS',
  'Ferrari fv12 ': 'Ferrari F12 Berlinetta',
  'Ferrari f430': 'Ferrari F430',
  'Ferrari F8 ': 'Ferrari F8 Tributo',
  'Jaguar F Type': 'Jaguar F-Type',
  'Harley Davidsons': 'Harley-Davidson Motorcycle',
  'Jaguar XKR ': 'Jaguar XKR',
  'Lamborghini Perfomante Spyder': 'Lamborghini Huracán Performante Spyder',
  'BMW M4 ': 'BMW M4',
  'BMW M3 ': 'BMW M3',
  'Bentley': 'Bentley Continental',
  'Caterham 7': 'Caterham 7 Superlight',
  'Ferrari 458 Italia': 'Ferrari 458 Italia',
};

// Function to improve title based on service and context
function improveTitle(originalTitle, service, hasVideo, mediaCount) {
  // First check if we have a specific improvement
  if (titleImprovements[originalTitle]) {
    return titleImprovements[originalTitle];
  }
  
  let improved = originalTitle.trim();
  
  // Fix capitalization issues
  // Capitalize first letter of each word for brand names
  const brandPatterns = [
    { pattern: /\bmclaren\b/gi, replacement: 'McLaren' },
    { pattern: /\brolls\s+royce\b/gi, replacement: 'Rolls-Royce' },
    { pattern: /\bharley\s+davidson\b/gi, replacement: 'Harley-Davidson' },
    { pattern: /\bland\s+rover\b/gi, replacement: 'Land Rover' },
    { pattern: /\brange\s+rover\b/gi, replacement: 'Range Rover' },
    { pattern: /\baston\s+martin\b/gi, replacement: 'Aston Martin' },
    { pattern: /\bferrari\b/gi, replacement: 'Ferrari' },
    { pattern: /\bporche\b/gi, replacement: 'Porsche' },
    { pattern: /\bmercedes\b/gi, replacement: 'Mercedes' },
    { pattern: /\bvolkswagen\b/gi, replacement: 'Volkswagen' },
    { pattern: /\bvolvo\b/gi, replacement: 'Volvo' },
    { pattern: /\btesla\b/gi, replacement: 'Tesla' },
    { pattern: /\bjaguar\b/gi, replacement: 'Jaguar' },
    { pattern: /\blamborghini\b/gi, replacement: 'Lamborghini' },
    { pattern: /\bbmw\b/gi, replacement: 'BMW' },
    { pattern: /\baudi\b/gi, replacement: 'Audi' },
    { pattern: /\bbentley\b/gi, replacement: 'Bentley' },
  ];
  
  brandPatterns.forEach(({ pattern, replacement }) => {
    improved = improved.replace(pattern, replacement);
  });
  
  // Fix common model name issues
  improved = improved.replace(/\bM3\b/g, 'M3');
  improved = improved.replace(/\bM4\b/g, 'M4');
  improved = improved.replace(/\bM5\b/g, 'M5');
  improved = improved.replace(/\bGT3\b/g, 'GT3');
  improved = improved.replace(/\bGT3RS\b/g, 'GT3 RS');
  improved = improved.replace(/\bSTO\b/g, 'STO');
  improved = improved.replace(/\bPPF\b/g, 'PPF');
  
  // Fix spacing issues
  improved = improved.replace(/\s+/g, ' ');
  improved = improved.replace(/\s+\(/g, ' (');
  improved = improved.replace(/\)\s+/g, ') ');
  
  // Remove trailing spaces
  improved = improved.trim();
  
  // Add service context if title is too generic
  if (service === 'Specials' && improved.length < 15) {
    // Already handled by brand extraction, but ensure it's descriptive
  }
  
  return improved;
}

// Apply improvements
let updated = false;
data.services.forEach(service => {
  service.projects.forEach(project => {
    const hasVideo = project.media?.some(m => m.type === 'video') || false;
    const mediaCount = project.mediaIds?.length || 0;
    const improved = improveTitle(project.name, service.name, hasVideo, mediaCount);
    
    if (improved !== project.name) {
      console.log(`Updating: "${project.name}" -> "${improved}"`);
      project.name = improved;
      updated = true;
    }
  });
});

if (updated) {
  // Write back to file
  fs.writeFileSync(
    path.join(__dirname, '../data/media-organization.json'),
    JSON.stringify(data, null, 2),
    'utf8'
  );
  console.log('\n✓ Titles updated successfully!');
} else {
  console.log('\n✓ No changes needed.');
}

