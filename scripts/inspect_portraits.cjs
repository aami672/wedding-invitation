const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../src/data/downloaded_published.html'), 'utf8');
const pIdx = 1862952;
console.log(html.substring(pIdx, pIdx + 1200));
