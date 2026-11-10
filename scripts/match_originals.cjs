const fs = require('fs');
const path = require('path');

const originalDir = path.join(process.env.USERPROFILE, 'Downloads', 'Wedding', 'bride');
const galleryDir = path.join(__dirname, '..', 'public', 'images', 'gallery');

const origFiles = fs.readdirSync(originalDir).map(f => {
  const p = path.join(originalDir, f);
  const s = fs.statSync(p);
  return { name: f, size: s.size, path: p };
});

console.log(`Found ${origFiles.length} original files in ${originalDir}`);

const galleryFiles = fs.readdirSync(galleryDir).map(f => {
  const p = path.join(galleryDir, f);
  const s = fs.statSync(p);
  return { name: f, size: s.size, path: p };
});

console.log(`Found ${galleryFiles.length} gallery files in ${galleryDir}`);
