const fs = require('fs');
const path = require('path');

const origDir = path.join(process.env.USERPROFILE, 'Downloads', 'Wedding', 'bride');
const galleryDir = path.join(__dirname, '..', 'public', 'images', 'gallery');

// Let's inspect the files in origDir
const files = fs.readdirSync(origDir).filter(f => f.toLowerCase().endsWith('.jpg'));
console.log('Total original JPGs:', files.length);

files.forEach(f => {
  const stat = fs.statSync(path.join(origDir, f));
  console.log(`${f}: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
});
