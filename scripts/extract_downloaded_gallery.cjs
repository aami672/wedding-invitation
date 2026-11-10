const fs = require('fs');
const path = require('path');

const downloadFile = path.join(process.env.USERPROFILE, 'Downloads', 'preeti-and-ashish.html');
if (!fs.existsSync(downloadFile)) {
  console.error('File not found:', downloadFile);
  process.exit(1);
}

const html = fs.readFileSync(downloadFile, 'utf8');
console.log('Read HTML file, size:', html.length);

const start = html.indexOf('Moments & Memories');
const end = html.indexOf('</section>', start);
const section = html.substring(start, end);

const re = /openMomentLightbox\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/g;
let m;
let count = 0;
const outputDir = path.join(__dirname, '..', 'public', 'images', 'gallery');
fs.mkdirSync(outputDir, { recursive: true });

const gallery = [];

while ((m = re.exec(section)) !== null) {
  count++;
  const rawUrl = m[1];
  const caption = m[2];

  let finalUrl = rawUrl;
  if (rawUrl.startsWith('data:image/')) {
    const parts = rawUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
    const filename = `moment_${count}.${ext}`;
    const filePath = path.join(outputDir, filename);
    const buffer = Buffer.from(parts[1], 'base64');
    fs.writeFileSync(filePath, buffer);
    console.log(`Saved ${filename} (${buffer.length} bytes): "${caption}"`);
    finalUrl = `./images/gallery/${filename}`;
  }

  gallery.push({
    url: finalUrl,
    caption: caption
  });
}

console.log(`Successfully extracted ${gallery.length} gallery items.`);

// Update src/data/published_invitation.json
const jsonPath = path.join(__dirname, '..', 'src', 'data', 'published_invitation.json');
const currentData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
currentData.gallery = gallery;
fs.writeFileSync(jsonPath, JSON.stringify(currentData, null, 2), 'utf8');
console.log('Updated src/data/published_invitation.json with new gallery items!');
