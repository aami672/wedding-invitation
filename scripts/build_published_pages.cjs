const fs = require('fs');
const path = require('path');

// Read StudioWizard.jsx to extract the template generator
const wizPath = path.join(__dirname, '../src/components/studio/StudioWizard.jsx');
const wizCode = fs.readFileSync(wizPath, 'utf8');

const startMarker = 'const standaloneHtml = `<!DOCTYPE html>';
const endMarker = '</html>`;';

const startIdx = wizCode.indexOf(startMarker);
const endIdx = wizCode.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find standaloneHtml bounds in StudioWizard.jsx');
  process.exit(1);
}

const templateStr = wizCode.slice(startIdx + 'const standaloneHtml = `'.length, endIdx + '</html>'.length);

// Base Default Data
const defaultData = {
  template: 'caricature',
  revealStyle: 'folding-doors',
  typography: {
    preset: 'heritage',
    headingFont: 'Cinzel',
    bodyFont: 'Cormorant Garamond',
    scriptFont: 'Great Vibes',
  },
  atmosphere: {
    style: 'petals',
    intensity: 'medium',
  },
  monogram: {
    initials: 'P & A',
    style: 'classic-crest',
  },
  hosts: {
    bride: 'Preeti',
    groom: 'Ashish',
    date: '2026-12-09',
    city: 'Meerut',
    hashtag: '#PreetiWedsAshish',
    welcomeQuote: "We are stepping into our next great chapter, and our celebration wouldn't be complete without you by our side.",
    brideParents: 'D/o Mr. Vijay & Mrs. Rekha Malhotra',
    groomParents: 'S/o Mr. Ramesh & Mrs. Sunita Sharma',
  },
  photos: {
    cover: './images/templates/caricature.webp',
    bride: './images/preeti_bride.jpg',
    groom: './images/ashish_groom.jpg',
    brideBio: 'Loves classic poetry, morning chai, and spontaneous mountain hikes.',
    groomBio: 'Foodie, photography enthusiast, and the architect of their happiest memories.',
  },
  events: [
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
  ],
  gallery: [
    { url: './images/gallery/moment_1.jpg', caption: 'Flaunting those new rings and that forever kind of vibe' },
    { url: './images/gallery/moment_2.jpg', caption: 'Glowing against that striking backdrop' },
    { url: './images/gallery/moment_3.jpg', caption: 'Candid moments' },
    { url: './images/gallery/moment_4.jpg', caption: 'Sweet smiles that say it all' },
    { url: './images/gallery/moment_5.jpg', caption: 'Lost in a quiet, beautiful moment' },
    { url: './images/gallery/moment_6.jpg', caption: 'Just engaged and ready for the sweetest journey ahead' },
    { url: './images/gallery/moment_7.jpg', caption: 'Keeping it stylish together with pose' },
    { url: './images/gallery/moment_8.jpg', caption: 'Cutting into celebration mode ' },
    { url: './images/gallery/moment_9.jpg', caption: 'Striking a pose with effortless grace and timeless elegance' },
    { url: './images/gallery/moment_10.jpg', caption: 'Showcasing those special symbols of a brand new journey together' },
    { url: './images/gallery/moment_11.jpg', caption: 'Caught in a dreamy spotlight with a look of pure grace' },
    { url: './images/gallery/moment_12.jpg', caption: 'Sharing a close, quiet moment wrapped in love and warmth' },
    { url: './images/gallery/moment_13.jpg', caption: 'Crowning the celebration with a beautiful ring ceremony cake' },
    { url: './images/gallery/moment_14.jpg', caption: 'Where the celebrations and unforgettable memories come to life at Hotel Meenar' },
  ]
};

// Check if user has saved custom data in src/data/published_invitation.json
let customData = {};
const savedJsonPath = path.join(__dirname, '../src/data/published_invitation.json');
if (fs.existsSync(savedJsonPath)) {
  try {
    customData = JSON.parse(fs.readFileSync(savedJsonPath, 'utf8'));
  } catch (e) {
    console.warn('Could not read published_invitation.json:', e.message);
  }
}

const data = {
  ...defaultData,
  ...customData,
  hosts: { ...defaultData.hosts, ...(customData.hosts || {}) },
  photos: { ...defaultData.photos, ...(customData.photos || {}) },
  typography: { ...defaultData.typography, ...(customData.typography || {}) },
  atmosphere: { ...defaultData.atmosphere, ...(customData.atmosphere || {}) },
  events: (customData.events && customData.events.length) ? customData.events : defaultData.events,
  gallery: (customData.gallery && customData.gallery.length) ? customData.gallery : defaultData.gallery,
};

const brideSlug = (data.hosts?.bride || 'preeti').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const groomSlug = (data.hosts?.groom || 'ashish').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const slug = (brideSlug && groomSlug) ? `${brideSlug}-and-${groomSlug}` : 'preeti-and-ashish';

const isCaricature = data.template === 'caricature';
const isPichwai = data.template === 'pichwai';
const isZardozi = data.template === 'zardozi';
const isMela = data.template === 'mela';
const isNewspaper = data.template === 'newspaper';
const isBougain = data.template === 'bougain' || data.template === 'bougainvillea';

// For files inside /published/, assets in /images/ are at ../images/
const assetPrefix = '../';

const b64Cover = data.photos?.cover ? `${assetPrefix}${data.photos.cover.replace(/^\.?\//, '')}` : `${assetPrefix}images/templates/caricature.webp`;
const b64Bride = data.photos?.bride ? `${assetPrefix}${data.photos.bride.replace(/^\.?\//, '')}` : `${assetPrefix}images/bride.webp`;
const b64Groom = data.photos?.groom ? `${assetPrefix}${data.photos.groom.replace(/^\.?\//, '')}` : `${assetPrefix}images/groom.webp`;
const b64Tmpl = `${assetPrefix}images/templates/caricature.webp`;
const b64Scooter = `${assetPrefix}images/caricature/scooter_couple.webp`;
const b64Haldi = `${assetPrefix}images/caricature/haldi_arch.webp`;
const b64Mehndi = `${assetPrefix}images/caricature/mehndi_arch.webp`;
const b64Sangeet = `${assetPrefix}images/caricature/sangeet_arch.webp`;
const b64Pheras = `${assetPrefix}images/caricature/pheras_arch.webp`;
const b64Reception = `${assetPrefix}images/caricature/reception_arch.webp`;

const b64Gallery = (data.gallery || []).map(item => ({
  b64: `${assetPrefix}${(item.url || item.img || 'images/couple-potrait.webp').replace(/^\.?\//, '')}`,
  caption: item.caption || item.title || 'Wedding Memory'
}));

const eventsJson = JSON.stringify(data.events || []);

// Helper functions
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '9th December 2026';
  if (/[a-zA-Z]/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'long' });
  const year = d.getFullYear();
  const s = ['th', 'st', 'nd', 'rd'], v = day % 100;
  const ord = day + (s[(v - 20) % 10] || s[v] || s[0]);
  return `${ord} ${month} ${year}`;
};

const getMonogramInitials = (hosts, monogram) => {
  if (monogram?.initials && monogram.initials !== 'B & G' && monogram.initials !== 'A & S') {
    return monogram.initials;
  }
  const bI = (hosts?.bride || 'Preeti').trim()[0]?.toUpperCase() || 'P';
  const gI = (hosts?.groom || 'Ashish').trim()[0]?.toUpperCase() || 'A';
  return `${bI} & ${gI}`;
};

// Calendar math
const d = new Date(data.hosts.date || '2026-12-09');
const validDate = !isNaN(d.getTime());
const calMonthName = validDate ? d.toLocaleString('en-US', { month: 'long' }) : 'December';
const calYear = validDate ? d.getFullYear() : 2026;
const calDayNum = validDate ? d.getDate() : 9;
const daysInMonth = validDate ? new Date(calYear, d.getMonth() + 1, 0).getDate() : 31;
const firstDayIndex = validDate ? new Date(calYear, d.getMonth(), 1).getDay() : 3;

const displayWeddingDate = formatDisplayDate(data.hosts.date || '2026-12-09');
const monogramInitials = getMonogramInitials(data.hosts, data.monogram);

const THEME_FOLDER_MAP = {
  'caricature': 'Luxe-Pastel-Caricature',
  'mela': 'Luxe-Marigold-Mela',
  'pichwai': 'Luxe-Pichwai-Lotus',
  'rajwada': 'Luxe-Rajwada-Miniature',
  'zardozi': 'Luxe-Heirloom-Zardozi',
  'storybook': 'Storybook',
  'newspaper': 'The-Shaadi-Times',
  'bougain': 'Luxe-Bougainvillea-Blossom',
  'bougainvillea': 'Luxe-Bougainvillea-Blossom',
  'ballroom': 'Gilded-Ballroom',
  'peaks': 'Pastel-Peaks',
  'resort': 'Luxury-Beach-Resort',
  'luxury-resort': 'Luxury-Resort',
  'mandap': 'Paper-Blossom',
  'paper-blossom': 'Paper-Blossom',
  'truck': 'Desi-Truck-Art',
  'nikah': 'Nikah',
  'rangla': 'Rangla-Viah',
  '3d-human': '3D-Model-Human-Colorful-v3',
  '3d-pixar': '3D-Pixar',
  'aladdin': 'Aladdin-Jasmine',
  'cute-couples': 'Cute-Couples',
  'kalyanam': 'Kalyanam',
  'marble': 'Marble-Style',
  'water': 'Water',
  'watercolor': 'Watercolor-Portrait',
  'cinematic': 'Luxe-Rajwada-Miniature',
  'royal': 'Luxe-Rajwada-Miniature',
  'classic': 'Luxe-Pichwai-Lotus',
  'editorial': 'The-Shaadi-Times',
  'botanical': 'Luxe-Bougainvillea-Blossom',
  'express': 'Storybook',
  'darkroom': 'Luxe-Rajwada-Miniature'
};

const EVENT_FILE_SEQUENCE = [
  '01-haldi.webp',
  '02-mehndi.webp',
  '03-sangeet.webp',
  '04-pheras.webp',
  '05-arrival-of-barat.webp',
  '06-varmala.webp',
  '07-wedding-dinner.webp',
  '08-main-fere-ceremony.webp'
];

function getBuildThemeEventImage(templateId, event, eventIndex) {
  if (event?.image) {
    return (event.image.startsWith('http') || event.image.startsWith('data:')) ? event.image : `${assetPrefix}${event.image.replace(/^\.?\//, '')}`;
  }
  if (templateId === 'caricature') return '';
  const folder = THEME_FOLDER_MAP[templateId] || 'Luxe-Pichwai-Lotus';
  const nameLower = (event?.name || '').toLowerCase();
  let filename = '04-pheras.webp';
  if (nameLower.includes('haldi')) filename = '01-haldi.webp';
  else if (nameLower.includes('mehndi') || nameLower.includes('mehendi')) filename = '02-mehndi.webp';
  else if (nameLower.includes('sangeet') || nameLower.includes('dance')) filename = '03-sangeet.webp';
  else if (nameLower.includes('main') && (nameLower.includes('fere') || nameLower.includes('phera'))) filename = '08-main-fere-ceremony.webp';
  else if (nameLower.includes('phera') || nameLower.includes('wedding')) filename = '04-pheras.webp';
  else if (nameLower.includes('barat') || nameLower.includes('arrival')) filename = '05-arrival-of-barat.webp';
  else if (nameLower.includes('varmala') || nameLower.includes('jaimala')) filename = '06-varmala.webp';
  else if (nameLower.includes('dinner') || nameLower.includes('reception')) filename = '07-wedding-dinner.webp';
  else filename = EVENT_FILE_SEQUENCE[eventIndex % EVENT_FILE_SEQUENCE.length];
  return `${assetPrefix}images/themes/${folder}/${filename}`;
}

const b64Events = (data.events || []).map((evt, idx) => ({
  ...evt,
  customB64: getBuildThemeEventImage(data.template, evt, idx)
}));

// Build HTML using Function constructor to evaluate templateStr in context
const buildFn = new Function(
  'data', 'slug', 'isCaricature', 'isPichwai', 'isZardozi', 'isMela', 'isNewspaper', 'isBougain',
  'b64Cover', 'b64Bride', 'b64Groom', 'b64Tmpl', 'b64Scooter', 'b64Haldi', 'b64Mehndi', 'b64Sangeet', 'b64Pheras', 'b64Reception',
  'b64Gallery', 'b64Events', 'eventsJson', 'd', 'calMonthName', 'calYear', 'calDayNum', 'daysInMonth', 'firstDayIndex',
  'displayWeddingDate', 'monogramInitials',
  'return `' + templateStr + '`;'
);

let html = buildFn(
  data, slug, isCaricature, isPichwai, isZardozi, isMela, isNewspaper, isBougain,
  b64Cover, b64Bride, b64Groom, b64Tmpl, b64Scooter, b64Haldi, b64Mehndi, b64Sangeet, b64Pheras, b64Reception,
  b64Gallery, b64Events, eventsJson, d, calMonthName, calYear, calDayNum, daysInMonth, firstDayIndex,
  displayWeddingDate, monogramInitials
);

// Write to public/published/
const pubDir = path.join(__dirname, '../public/published');
if (!fs.existsSync(pubDir)) {
  fs.mkdirSync(pubDir, { recursive: true });
}

// 1. Write preeti-and-ashish.html
const filePreeti = path.join(pubDir, 'preeti-and-ashish.html');
fs.writeFileSync(filePreeti, html, 'utf8');

// 2. Write index.html
const fileIndex = path.join(pubDir, 'index.html');
fs.writeFileSync(fileIndex, html, 'utf8');

// 3. Write client specific slug file (e.g. pooja-and-rahul.html)
if (slug !== 'preeti-and-ashish') {
  const fileSlug = path.join(pubDir, `${slug}.html`);
  fs.writeFileSync(fileSlug, html, 'utf8');
}

// 4. For root public/preeti-and-ashish.html, prefix is ./images/
const rootHtml = html.replaceAll('../images/', './images/').replaceAll('../audio/', './audio/');
const fileRoot = path.join(__dirname, '../public/preeti-and-ashish.html');
fs.writeFileSync(fileRoot, rootHtml, 'utf8');

// 5. Also update dist/ if dist exists
const distDir = path.join(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  const distPubDir = path.join(distDir, 'published');
  if (!fs.existsSync(distPubDir)) fs.mkdirSync(distPubDir, { recursive: true });
  fs.writeFileSync(path.join(distPubDir, 'preeti-and-ashish.html'), html, 'utf8');
  fs.writeFileSync(path.join(distPubDir, 'index.html'), html, 'utf8');
  if (slug !== 'preeti-and-ashish') {
    fs.writeFileSync(path.join(distPubDir, `${slug}.html`), html, 'utf8');
  }
  fs.writeFileSync(path.join(distDir, 'preeti-and-ashish.html'), rootHtml, 'utf8');
}

console.log(`Successfully built published pages:
  - public/published/preeti-and-ashish.html (${(html.length / 1024).toFixed(1)} KB)
  - public/published/index.html (${(html.length / 1024).toFixed(1)} KB)
  ${slug !== 'preeti-and-ashish' ? `- public/published/${slug}.html\n` : ''}  - public/preeti-and-ashish.html (${(rootHtml.length / 1024).toFixed(1)} KB)`);
