const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/media-organization.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const issues = [];
const mediaMap = new Map();

// Track all media files and which projects use them
data.services.forEach(service => {
  service.projects.forEach(project => {
    project.media.forEach(media => {
      const key = media.src;
      if (!mediaMap.has(key)) {
        mediaMap.set(key, []);
      }
      mediaMap.get(key).push({
        service: service.name,
        project: project.name,
        projectId: project.id,
        mediaId: media.id,
        type: media.type
      });
    });
  });
});

// Check for shared media files
console.log('=== MEDIA FILES USED IN MULTIPLE PROJECTS ===\n');
let sharedMediaCount = 0;
mediaMap.forEach((projects, src) => {
  if (projects.length > 1) {
    sharedMediaCount++;
    console.log(`\n${src}:`);
    projects.forEach(p => {
      console.log(`  - ${p.service} / ${p.project} (${p.type})`);
    });
  }
});
if (sharedMediaCount === 0) {
  console.log('None found.');
}

// Check for projects with issues
console.log('\n\n=== PROJECT ISSUES ===\n');

data.services.forEach(service => {
  service.projects.forEach(project => {
    const videos = project.media.filter(m => m.type === 'video');
    const images = project.media.filter(m => m.type === 'image');
    const videoCount = videos.length;
    const imageCount = images.length;
    
    // Check for too many videos (might indicate duplicates)
    if (videoCount > 2) {
      issues.push({
        type: 'too_many_videos',
        service: service.name,
        project: project.name,
        count: videoCount
      });
    }
    
    // Check for projects with no media
    if (project.media.length === 0) {
      issues.push({
        type: 'no_media',
        service: service.name,
        project: project.name
      });
    }
    
    // Check for duplicate video sources in same project
    const videoSources = videos.map(v => v.src);
    const uniqueVideoSources = new Set(videoSources);
    if (videoSources.length !== uniqueVideoSources.size) {
      const duplicates = videoSources.filter((src, i) => videoSources.indexOf(src) !== i);
      issues.push({
        type: 'duplicate_videos_same_project',
        service: service.name,
        project: project.name,
        duplicates: [...new Set(duplicates)]
      });
    }
    
    // Check for duplicate image sources in same project
    const imageSources = images.map(i => i.src);
    const uniqueImageSources = new Set(imageSources);
    if (imageSources.length !== uniqueImageSources.size) {
      const duplicates = imageSources.filter((src, i) => imageSources.indexOf(src) !== i);
      issues.push({
        type: 'duplicate_images_same_project',
        service: service.name,
        project: project.name,
        duplicates: [...new Set(duplicates)]
      });
    }
  });
});

if (issues.length === 0) {
  console.log('No issues found!');
} else {
  issues.forEach(issue => {
    if (issue.type === 'too_many_videos') {
      console.log(`\n⚠️  ${issue.service} / ${issue.project}: ${issue.count} videos (might be duplicates)`);
    }
    if (issue.type === 'no_media') {
      console.log(`\n❌ ${issue.service} / ${issue.project}: No media files`);
    }
    if (issue.type === 'duplicate_videos_same_project') {
      console.log(`\n🔄 ${issue.service} / ${issue.project}: Duplicate videos - ${issue.duplicates.join(', ')}`);
    }
    if (issue.type === 'duplicate_images_same_project') {
      console.log(`\n🔄 ${issue.service} / ${issue.project}: Duplicate images - ${issue.duplicates.join(', ')}`);
    }
  });
}

// Summary
console.log('\n\n=== SUMMARY ===');
console.log(`Total projects: ${data.services.reduce((sum, s) => sum + s.projects.length, 0)}`);
console.log(`Projects with issues: ${issues.length}`);
console.log(`Media files shared across projects: ${sharedMediaCount}`);

