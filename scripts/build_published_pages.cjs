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
    bride: './images/bride.webp',
    groom: './images/groom.webp',
    brideBio: 'Loves classic poetry, morning chai, and spontaneous mountain hikes.',
    groomBio: 'Foodie, photography enthusiast, and the architect of their happiest memories.',
  },
  events: [
    {
      id: 'evt-haldi',
      name: 'Haldi Ceremony',
      date: 'Monday, 7th December 2026',
      time: '10:30 AM onwards',
      venue: 'The Courtyard, Bravura Gold Resort',
      address: 'NH-58, Delhi-Roorkee Bypass, Meerut, Uttar Pradesh 250005',
      mapsUrl: 'https://maps.google.com/?q=Bravura+Gold+Resort+Meerut',
      dressCode: 'Haldi Yellow & Warm Mustard'
    },
    {
      id: 'evt-mehndi',
      name: 'Mehndi Ceremony',
      date: 'Monday, 7th December 2026',
      time: '04:00 PM onwards',
      venue: 'The Poolside Lawns, Bravura Gold Resort',
      address: 'NH-58, Delhi-Roorkee Bypass, Meerut, Uttar Pradesh 250005',
      mapsUrl: 'https://maps.google.com/?q=Bravura+Gold+Resort+Meerut',
      dressCode: 'Mint Green & Floral Pastels'
    },
    {
      id: 'evt-sangeet',
      name: 'Sangeet & Cocktail Night',
      date: 'Tuesday, 8th December 2026',
      time: '07:00 PM onwards',
      venue: 'The Grand Ballroom, Bravura Gold Resort',
      address: 'NH-58, Delhi-Roorkee Bypass, Meerut, Uttar Pradesh 250005',
      mapsUrl: 'https://maps.google.com/?q=Bravura+Gold+Resort+Meerut',
      dressCode: 'Glamorous Indian Cocktails'
    },
    {
      id: 'evt-pheras',
      name: 'Main Pheras (The Wedding)',
      date: 'Wednesday, 9th December 2026',
      time: '04:30 PM (Sunset Barat)',
      venue: 'The Royal Mandap, Bravura Gold Resort',
      address: 'NH-58, Delhi-Roorkee Bypass, Meerut, Uttar Pradesh 250005',
      mapsUrl: 'https://maps.google.com/?q=Bravura+Gold+Resort+Meerut',
      dressCode: 'Royal Indian Pastels & Silk Sarees'
    },
    {
      id: 'evt-reception',
      name: 'Imperial Gala Reception',
      date: 'Wednesday, 9th December 2026',
      time: '08:30 PM onwards',
      venue: 'The Palace Gardens, Bravura Gold Resort',
      address: 'NH-58, Delhi-Roorkee Bypass, Meerut, Uttar Pradesh 250005',
      mapsUrl: 'https://maps.google.com/?q=Bravura+Gold+Resort+Meerut',
      dressCode: 'Black Tie or Regal Traditional'
    }
  ],
  gallery: [
    { url: './images/couple-potrait.webp', caption: "In each other's eyes" },
    { url: './images/couple-landscape-1.webp', caption: 'Moments under the palace sun' },
    { url: './images/couple-landscape-2.webp', caption: 'Lakeside serenity in Udaipur' },
    { url: './images/couple-potrait-1.webp', caption: 'Laughs & forever promises' },
    { url: './images/couple-landscape-3.webp', caption: 'Golden hour at Lake Pichola' },
    { url: './images/couple-landscape-4.webp', caption: 'Under the starlit sky' },
    { url: './images/couple-udaipur-boat.webp', caption: 'Sailing together' },
    { url: './images/couple-udaipur-rooftop.webp', caption: 'Rooftop whispers' },
    { url: './images/couple-udaipur-bazaar.webp', caption: 'Old city charm' },
    { url: './images/couple-udaipur-hilltop.webp', caption: 'Monsoon palace views' },
    { url: './images/couple-udaipur-haveli.webp', caption: 'Courtyard royalty' },
    { url: './images/couple-udaipur-ghat.webp', caption: "At the water's edge" },
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

// Build HTML using Function constructor to evaluate templateStr in context
const buildFn = new Function(
  'data', 'slug', 'isCaricature', 'isPichwai', 'isZardozi', 'isMela', 'isNewspaper', 'isBougain',
  'b64Cover', 'b64Bride', 'b64Groom', 'b64Tmpl', 'b64Scooter', 'b64Haldi', 'b64Mehndi', 'b64Sangeet', 'b64Pheras', 'b64Reception',
  'b64Gallery', 'eventsJson', 'd', 'calMonthName', 'calYear', 'calDayNum', 'daysInMonth', 'firstDayIndex',
  'displayWeddingDate', 'monogramInitials',
  'return `' + templateStr + '`;'
);

let html = buildFn(
  data, slug, isCaricature, isPichwai, isZardozi, isMela, isNewspaper, isBougain,
  b64Cover, b64Bride, b64Groom, b64Tmpl, b64Scooter, b64Haldi, b64Mehndi, b64Sangeet, b64Pheras, b64Reception,
  b64Gallery, eventsJson, d, calMonthName, calYear, calDayNum, daysInMonth, firstDayIndex,
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
