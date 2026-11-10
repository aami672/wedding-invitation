const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '..');
const htmlPath = path.join(projectDir, 'src', 'data', 'downloaded_published.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Find all data:image/jpeg;base64 strings
const regex = /data:image\/jpeg;base64,[A-Za-z0-9+/=]+/g;
const matches = [];
let match;
while ((match = regex.exec(html)) !== null) {
  matches.push(match[0]);
}

if (matches.length < 33) {
  console.error(`Expected at least 33 matches, found ${matches.length}`);
  process.exit(1);
}

const oldGroom = matches[1];
const oldBride = matches[2];

// Read new maximized images
function getBase64Jpeg(relPath) {
  const fullPath = path.join(projectDir, relPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }
  const buf = fs.readFileSync(fullPath);
  return 'data:image/jpeg;base64,' + buf.toString('base64');
}

const newGroom = getBase64Jpeg('public/images/ashish_groom.jpg');
const newBride = getBase64Jpeg('public/images/preeti_bride.jpg');

console.log(`Replacing Groom: old len=${oldGroom.length} -> new len=${newGroom.length}`);
html = html.replaceAll(oldGroom, newGroom);

console.log(`Replacing Bride: old len=${oldBride.length} -> new len=${newBride.length}`);
html = html.replaceAll(oldBride, newBride);

for (let i = 1; i <= 14; i++) {
  const oldMoment = matches[3 + (i - 1) * 2];
  const newMoment = getBase64Jpeg(`public/images/gallery/moment_${i}.jpg`);
  console.log(`Replacing Moment ${i}: old len=${oldMoment.length} -> new len=${newMoment.length}`);
  html = html.replaceAll(oldMoment, newMoment);
}

// Ensure "POWERED BY WISHLYS FREE" is not present
if (html.includes('POWERED BY WISHLYS FREE') || html.includes('Powered by Wishlys')) {
  console.log('Removing Wishlys watermark residue if any...');
  html = html.replace(/<div[^>]*>[\s\S]*?POWERED BY WISHLYS FREE[\s\S]*?<\/div>/gi, '');
  html = html.replace(/<div[^>]*>[\s\S]*?Powered by Wishlys[\s\S]*?<\/div>/gi, '');
}

// 1. Write updated master
fs.writeFileSync(htmlPath, html, 'utf8');
console.log(`Saved updated master downloaded_published.html (${(html.length / (1024 * 1024)).toFixed(2)} MB)`);

// 2. Write to public/published/
const pubDir = path.join(projectDir, 'public', 'published');
fs.mkdirSync(pubDir, { recursive: true });

fs.writeFileSync(path.join(pubDir, 'preeti-and-ashish.html'), html, 'utf8');
console.log('Saved to public/published/preeti-and-ashish.html');

fs.writeFileSync(path.join(pubDir, 'index.html'), html, 'utf8');
console.log('Saved to public/published/index.html');

fs.writeFileSync(path.join(projectDir, 'public', 'preeti-and-ashish.html'), html, 'utf8');
console.log('Saved to public/preeti-and-ashish.html');

// 3. Update Downloads directory files so the user has the maximized crystal-clear file offline
const downloadsDir = path.join(process.env.USERPROFILE, 'Downloads');
if (fs.existsSync(downloadsDir)) {
  const dlFiles = [
    'preeti-and-ashish.html',
    'preeti-and-ashish (2).html',
    'preeti-and-ashish (1).html'
  ];
  for (const f of dlFiles) {
    const full = path.join(downloadsDir, f);
    if (fs.existsSync(full)) {
      fs.writeFileSync(full, html, 'utf8');
      console.log(`Updated user Download file: ${f}`);
    }
  }
}

// 4. Update dist/ if it exists
const distDir = path.join(projectDir, 'dist');
if (fs.existsSync(distDir)) {
  const distPubDir = path.join(distDir, 'published');
  fs.mkdirSync(distPubDir, { recursive: true });
  fs.writeFileSync(path.join(distPubDir, 'preeti-and-ashish.html'), html, 'utf8');
  fs.writeFileSync(path.join(distPubDir, 'index.html'), html, 'utf8');
  fs.writeFileSync(path.join(distDir, 'preeti-and-ashish.html'), html, 'utf8');
  console.log('Updated dist/ files');
}

console.log('ALL FILES SUCCESSFULLY MAXIMIZED TO FULL HIGH RESOLUTION!');
