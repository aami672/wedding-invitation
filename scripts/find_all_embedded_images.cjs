const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../src/data/downloaded_published.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Find all data:image/jpeg;base64 strings
const matches = [];
const regex = /data:image\/jpeg;base64,[A-Za-z0-9+/=]+/g;
let match;
while ((match = regex.exec(html)) !== null) {
  matches.push({
    index: match.index,
    length: match[0].length,
    preview: match[0].slice(0, 30),
    contextBefore: html.substring(Math.max(0, match.index - 60), match.index)
  });
}

console.log('Total data:image/jpeg matches in downloaded_published.html:', matches.length);
matches.forEach((m, i) => {
  console.log(`[${i}] len=${m.length} before: ${m.contextBefore.replace(/\n/g, ' ')}`);
});
