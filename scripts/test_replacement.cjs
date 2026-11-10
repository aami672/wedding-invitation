const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../src/data/downloaded_published.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const regex = /data:image\/jpeg;base64,[A-Za-z0-9+/=]+/g;
const matches = [];
let match;
while ((match = regex.exec(html)) !== null) {
  matches.push(match[0]);
}

console.log('Total matches:', matches.length);

const groomB64 = matches[1];
const brideB64 = matches[2];
console.log('Groom match 1 === match 31?', groomB64 === matches[31]);
console.log('Bride match 2 === match 32?', brideB64 === matches[32]);

for (let i = 1; i <= 14; i++) {
  const m1 = matches[3 + (i - 1) * 2];
  const m2 = matches[4 + (i - 1) * 2];
  console.log(`Moment ${i}: lightbox === img?`, m1 === m2, 'len=', m1.length);
}
