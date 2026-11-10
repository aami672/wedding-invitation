const fs = require('fs');
const path = require('path');

const filePath = path.join(process.env.USERPROFILE, 'Downloads', 'preeti-and-ashish.html');
const content = fs.readFileSync(filePath, 'utf8');

const start = content.indexOf('Moments & Memories');
const end = content.indexOf('</section>', start);
console.log('Section start:', start, 'end:', end);
const section = content.substring(start, end);

const re = /openMomentLightbox\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/g;
let m;
let i = 0;
const items = [];
while ((m = re.exec(section)) !== null) {
  i++;
  const url = m[1];
  const cap = m[2];
  items.push({
    index: i,
    caption: cap,
    urlLength: url.length,
    isDataUrl: url.startsWith('data:'),
    urlPreview: url.substring(0, 40)
  });
}

console.log('All gallery items in Moments & Memories:', JSON.stringify(items, null, 2));
