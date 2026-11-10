const fs = require('fs');
const path = require('path');

const downloadFile = path.join(process.env.USERPROFILE, 'Downloads', 'preeti-and-ashish.html');
if (!fs.existsSync(downloadFile)) {
  console.error('Download file not found:', downloadFile);
  process.exit(1);
}

const html = fs.readFileSync(downloadFile, 'utf8');
console.log('Read download file, size:', html.length, 'bytes');

// 1. Save master copy in src/data/downloaded_published.html
const masterFile = path.join(__dirname, '..', 'src', 'data', 'downloaded_published.html');
fs.writeFileSync(masterFile, html, 'utf8');
console.log('Saved master file to:', masterFile);

// 2. Write to public/published/
const pubDir = path.join(__dirname, '..', 'public', 'published');
fs.mkdirSync(pubDir, { recursive: true });

fs.writeFileSync(path.join(pubDir, 'preeti-and-ashish.html'), html, 'utf8');
console.log('Saved to public/published/preeti-and-ashish.html');

fs.writeFileSync(path.join(pubDir, 'index.html'), html, 'utf8');
console.log('Saved to public/published/index.html');

fs.writeFileSync(path.join(__dirname, '..', 'public', 'preeti-and-ashish.html'), html, 'utf8');
console.log('Saved to public/preeti-and-ashish.html');

// 3. Write to dist/ if dist exists
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  const distPubDir = path.join(distDir, 'published');
  fs.mkdirSync(distPubDir, { recursive: true });
  fs.writeFileSync(path.join(distPubDir, 'preeti-and-ashish.html'), html, 'utf8');
  fs.writeFileSync(path.join(distPubDir, 'index.html'), html, 'utf8');
  fs.writeFileSync(path.join(distDir, 'preeti-and-ashish.html'), html, 'utf8');
  console.log('Updated dist files');
}

// 4. Update src/data/published_invitation.json with the single event
const jsonPath = path.join(__dirname, '..', 'src', 'data', 'published_invitation.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
data.events = [
  {
    id: 'evt-pheras',
    name: 'Main Pheras (The Wedding)',
    date: 'Wednesday, 9th December 2026',
    time: '06:00 PM (Sunset Barat)',
    venue: 'Diaz Banquet,',
    address: '111, Delhi Road, Opposite Deewan International Public School, Rithani (near Rajkamal Enclave), Meerut, Uttar Pradesh – 250001',
    mapsUrl: 'https://maps.google.com/?q=Diaz%20Banquet%2C%20111%2C%20Delhi%20Road%2C%20Opposite%20Deewan%20International%20Public%20School%2C%20Rithani%20(near%20Rajkamal%20Enclave)%2C%20Meerut%2C%20Uttar%20Pradesh%20%E2%80%93%20250001',
    dressCode: 'Royal Indian Pastels, Silk Sarees & Bandhgalas'
  }
];
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Updated published_invitation.json events to single Main Pheras event.');
