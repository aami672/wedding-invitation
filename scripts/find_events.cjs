const fs = require('fs');
const path = require('path');

const filePath = path.join(process.env.USERPROFILE, 'Downloads', 'preeti-and-ashish.html');
const content = fs.readFileSync(filePath, 'utf8');

const idx = content.indexOf('Main Pheras');
console.log('Main Pheras found at:', idx);
// Let's print 1000 characters before and after
console.log('--- BEFORE ---');
console.log(content.substring(Math.max(0, idx - 1000), idx));
console.log('--- AFTER ---');
console.log(content.substring(idx, Math.min(content.length, idx + 2000)));
