const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/media-organization.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Track all project IDs and names
const projectIdMap = new Map();
const projectNameMap = new Map();
const duplicates = [];

// Find duplicates
data.services.forEach((service, serviceIndex) => {
  service.projects.forEach((project, projectIndex) => {
    // Check for duplicate IDs
    if (projectIdMap.has(project.id)) {
      duplicates.push({
        type: 'duplicate_id',
        id: project.id,
        name: project.name,
        service: service.name,
        serviceIndex,
        projectIndex,
        existing: projectIdMap.get(project.id)
      });
    } else {
      projectIdMap.set(project.id, { service: service.name, serviceIndex, projectIndex });
    }
    
    // Check for duplicate names (case-insensitive)
    const nameKey = project.name.toLowerCase().trim();
    if (projectNameMap.has(nameKey)) {
      const existing = projectNameMap.get(nameKey);
      // Only flag if different IDs (same name, different project)
      if (existing.id !== project.id) {
        duplicates.push({
          type: 'duplicate_name',
          name: project.name,
          id: project.id,
          service: service.name,
          serviceIndex,
          projectIndex,
          existing: existing
        });
      }
    } else {
      projectNameMap.set(nameKey, { id: project.id, service: service.name, serviceIndex, projectIndex });
    }
  });
});

console.log('=== DUPLICATE PROJECTS FOUND ===\n');
if (duplicates.length === 0) {
  console.log('No duplicates found!');
} else {
  duplicates.forEach(dup => {
    if (dup.type === 'duplicate_id') {
      console.log(`DUPLICATE ID: ${dup.id} - "${dup.name}"`);
      console.log(`  Found in: ${dup.service} (service index ${dup.serviceIndex}, project index ${dup.projectIndex})`);
      console.log(`  Also in: ${dup.existing.service} (service index ${dup.existing.serviceIndex}, project index ${dup.existing.projectIndex})`);
    } else if (dup.type === 'duplicate_name') {
      console.log(`DUPLICATE NAME: "${dup.name}"`);
      console.log(`  ID: ${dup.id} in ${dup.service}`);
      console.log(`  ID: ${dup.existing.id} in ${dup.existing.service}`);
    }
    console.log('');
  });
}

// Count projects per service
console.log('\n=== PROJECTS PER SERVICE ===\n');
data.services.forEach(service => {
  console.log(`${service.name}: ${service.projects.length} projects`);
});

// Check for projects with no media
console.log('\n=== PROJECTS WITH NO MEDIA ===\n');
let noMediaCount = 0;
data.services.forEach(service => {
  service.projects.forEach(project => {
    if (!project.media || project.media.length === 0) {
      console.log(`${service.name} / ${project.name} (ID: ${project.id})`);
      noMediaCount++;
    }
  });
});
if (noMediaCount === 0) {
  console.log('All projects have media!');
}

