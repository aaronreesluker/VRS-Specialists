const fs = require('fs');
const path = require('path');

// Read all export files
const exportFiles = [
  path.join(__dirname, '../c:/Users/aaron/Downloads/media-organization-export-1768000344865.json'),
  path.join(__dirname, '../c:/Users/aaron/Downloads/media-organization-export-1768169832094.json'),
  path.join(__dirname, '../c:/Users/aaron/Downloads/media-organization-export-1768173220566.json'),
];

// Try to read current data
let currentData = null;
try {
  currentData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/media-organization.json'), 'utf8'));
} catch (e) {
  console.log('Could not read current data:', e.message);
}

// Read export files
const exports = [];
for (const file of exportFiles) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    exports.push(JSON.parse(content));
    console.log(`Loaded: ${path.basename(file)}`);
  } catch (e) {
    console.log(`Could not read ${file}:`, e.message);
  }
}

// Analyze projects by name
const projectMap = new Map();
const duplicateProjects = [];

exports.forEach((exportData, exportIndex) => {
  exportData.services.forEach(service => {
    service.projects.forEach(project => {
      const key = project.name.toLowerCase().trim();
      if (!projectMap.has(key)) {
        projectMap.set(key, []);
      }
      projectMap.get(key).push({
        exportIndex,
        service: service.name,
        project: project,
      });
    });
  });
});

// Find duplicates
projectMap.forEach((projects, name) => {
  if (projects.length > 1) {
    duplicateProjects.push({ name, projects });
  }
});

console.log('\n=== DUPLICATE PROJECTS FOUND ===');
duplicateProjects.forEach(({ name, projects }) => {
  console.log(`\n"${name}":`);
  projects.forEach(p => {
    console.log(`  - Export ${p.exportIndex + 1} / ${p.service} / ID: ${p.project.id} / Media: ${p.project.media?.length || 0}`);
  });
});

// Check for projects with shared media
console.log('\n=== PROJECTS WITH SHARED MEDIA ===');
const mediaMap = new Map();
exports.forEach((exportData, exportIndex) => {
  exportData.services.forEach(service => {
    service.projects.forEach(project => {
      project.media?.forEach(media => {
        const key = media.src;
        if (!mediaMap.has(key)) {
          mediaMap.set(key, []);
        }
        mediaMap.get(key).push({
          exportIndex,
          service: service.name,
          projectName: project.name,
          projectId: project.id,
        });
      });
    });
  });
});

let sharedCount = 0;
mediaMap.forEach((projects, src) => {
  if (projects.length > 1) {
    sharedCount++;
    if (sharedCount <= 10) { // Show first 10
      console.log(`\n${src}:`);
      projects.forEach(p => {
        console.log(`  - Export ${p.exportIndex + 1} / ${p.service} / ${p.projectName}`);
      });
    }
  }
});
if (sharedCount > 10) {
  console.log(`\n... and ${sharedCount - 10} more shared media files`);
}

