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

console.log('Matches found:', matches.length);

const oldCover = matches[0];
const oldGroom = matches[1];
const oldBride = matches[2];

let webHtml = html;
webHtml = webHtml.replaceAll(oldCover, '../images/templates/caricature.webp');
webHtml = webHtml.replaceAll(oldGroom, '../images/ashish_groom.jpg');
webHtml = webHtml.replaceAll(oldBride, '../images/preeti_bride.jpg');

for (let i = 1; i <= 14; i++) {
  const oldMoment = matches[3 + (i - 1) * 2];
  webHtml = webHtml.replaceAll(oldMoment, `../images/gallery/moment_${i}.jpg`);
}

// Check if any other data:image/ remains
const remainingData = (webHtml.match(/data:image\/[^"']+/g) || []).length;
console.log('Web HTML length:', (webHtml.length / 1024).toFixed(1), 'KB | Remaining data URIs:', remainingData);

// Save to public/published/
const pubDir = path.join(projectDir, 'public', 'published');
fs.mkdirSync(pubDir, { recursive: true });
fs.writeFileSync(path.join(pubDir, 'preeti-and-ashish.html'), webHtml, 'utf8');
fs.writeFileSync(path.join(pubDir, 'index.html'), webHtml, 'utf8');

// For root preeti-and-ashish.html
let rootHtml = webHtml.replaceAll('../images/', './images/').replaceAll('../audio/', './audio/');
fs.writeFileSync(path.join(projectDir, 'public', 'preeti-and-ashish.html'), rootHtml, 'utf8');

// Update dist/
const distDir = path.join(projectDir, 'dist');
if (fs.existsSync(distDir)) {
  const distPubDir = path.join(distDir, 'published');
  fs.mkdirSync(distPubDir, { recursive: true });
  fs.writeFileSync(path.join(distPubDir, 'preeti-and-ashish.html'), webHtml, 'utf8');
  fs.writeFileSync(path.join(distPubDir, 'index.html'), webHtml, 'utf8');
  fs.writeFileSync(path.join(distDir, 'preeti-and-ashish.html'), rootHtml, 'utf8');
}
console.log('Successfully written clean, lightweight Web published pages!');
