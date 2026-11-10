const fs = require('fs');
const path = require('path');

const filePath = path.join(process.env.USERPROFILE, 'Downloads', 'preeti-and-ashish.html');
const content = fs.readFileSync(filePath, 'utf8');

const idx = content.indexOf('function hydrateSavedData()');
console.log(content.substring(idx, idx + 2500));
