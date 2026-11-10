const fs = require('fs');
const path = require('path');

const filePath = path.join(process.env.USERPROFILE, 'Downloads', 'preeti-and-ashish.html');
const content = fs.readFileSync(filePath, 'utf8');

console.log('File size:', content.length, 'bytes');

const srcRegex = /src=["']([^"']+)["']/g;
let m;
const nonDataSrcs = [];
let dataCount = 0;
while ((m = srcRegex.exec(content)) !== null) {
  if (m[1].startsWith('data:')) {
    dataCount++;
  } else {
    nonDataSrcs.push(m[1]);
  }
}

console.log(`Found ${dataCount} base64 data URIs`);
console.log('Non-data srcs:', nonDataSrcs);

// Check links
const linkRegex = /<link[^>]+href=["']([^"']+)["']/g;
const links = [];
while ((m = linkRegex.exec(content)) !== null) {
  links.push(m[1]);
}
console.log('Links:', links);

// Check scripts
const scriptRegex = /<script[^>]+src=["']([^"']+)["']/g;
const scripts = [];
while ((m = scriptRegex.exec(content)) !== null) {
  scripts.push(m[1]);
}
console.log('Scripts:', scripts);
