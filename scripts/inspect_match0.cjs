const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../src/data/downloaded_published.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const regex = /data:image\/jpeg;base64,[A-Za-z0-9+/=]+/g;
const match0 = regex.exec(html);
console.log('Match 0 index:', match0.index, 'len:', match0[0].length);
console.log(html.substring(match0.index - 200, match0.index + 50));
