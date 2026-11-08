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

// Default Data for Preeti & Ashish
const data = {
  template: 'caricature',
  revealStyle: 'scratch-date',
  hosts: {
    bride: 'Preeti',
    groom: 'Ashish',
    date: '2027-02-14',
    city: 'Udaipur, Rajasthan',
    hashtag: '#PreetiWedsAshish',
    welcomeQuote: 'Two hearts, one lifelong promise under the palace stars.',
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
      date: 'Friday, 12th February 2027',
      time: '10:30 AM onwards',
      venue: 'The Courtyard, The Oberoi Udaivilas',
      address: 'Haridas Ji Ki Magri, Udaipur, Rajasthan 313001',
      mapsUrl: 'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
      dressCode: 'Haldi Yellow & Warm Mustard'
    },
    {
      id: 'evt-mehndi',
      name: 'Mehndi Ceremony',
      date: 'Friday, 12th February 2027',
      time: '04:00 PM onwards',
      venue: 'The Poolside Lawns, The Oberoi Udaivilas',
      address: 'Haridas Ji Ki Magri, Udaipur, Rajasthan 313001',
      mapsUrl: 'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
      dressCode: 'Mint Green & Floral Pastels'
    },
    {
      id: 'evt-sangeet',
      name: 'Sangeet & Cocktail Night',
      date: 'Saturday, 13th February 2027',
      time: '07:00 PM onwards',
      venue: 'The Royal Grand Ballroom',
      address: 'The Oberoi Udaivilas, Udaipur',
      mapsUrl: 'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
      dressCode: 'Glamorous Indian Cocktails'
    },
    {
      id: 'evt-pheras',
      name: 'Main Pheras (The Wedding)',
      date: 'Sunday, 14th February 2027',
      time: '04:30 PM (Sunset Barat)',
      venue: 'Lakeside Mandap on Lake Pichola',
      address: 'The Oberoi Udaivilas, Udaipur',
      mapsUrl: 'https://maps.google.com/?q=Lake+Pichola+Udaipur',
      dressCode: 'Royal Indian Pastels & Silk Sarees'
    },
    {
      id: 'evt-reception',
      name: 'Imperial Gala Reception',
      date: 'Sunday, 14th February 2027',
      time: '08:30 PM onwards',
      venue: 'The Palace Gardens',
      address: 'The Oberoi Udaivilas, Udaipur',
      mapsUrl: 'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
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

const slug = 'preeti-and-ashish';
const isCaricature = true;
const isPichwai = false;
const isZardozi = false;
const isMela = false;
const isNewspaper = false;
const isBougain = false;

// For files inside /published/, assets in /images/ are at ../images/
const assetPrefix = '../';

const b64Cover = `${assetPrefix}images/caricature/scooter_couple.webp`;
const b64Bride = `${assetPrefix}images/bride.webp`;
const b64Groom = `${assetPrefix}images/groom.webp`;
const b64Tmpl = `${assetPrefix}images/templates/caricature.webp`;
const b64Scooter = `${assetPrefix}images/caricature/scooter_couple.webp`;
const b64Haldi = `${assetPrefix}images/caricature/haldi_arch.webp`;
const b64Mehndi = `${assetPrefix}images/caricature/mehndi_arch.webp`;
const b64Sangeet = `${assetPrefix}images/caricature/sangeet_arch.webp`;
const b64Pheras = `${assetPrefix}images/caricature/pheras_arch.webp`;
const b64Reception = `${assetPrefix}images/caricature/reception_arch.webp`;

const b64Gallery = data.gallery.map(item => ({
  b64: `${assetPrefix}${item.url.replace(/^\.?\//, '')}`,
  caption: item.caption
}));

const eventsJson = JSON.stringify(data.events);

// Calendar math
const d = new Date(data.hosts.date);
const calMonthName = 'February';
const calYear = 2027;
const calDayNum = 14;
const daysInMonth = 28;
const firstDayIndex = 0; // Sunday

// Build HTML using Function constructor to evaluate templateStr in context
const buildFn = new Function(
  'data', 'slug', 'isCaricature', 'isPichwai', 'isZardozi', 'isMela', 'isNewspaper', 'isBougain',
  'b64Cover', 'b64Bride', 'b64Groom', 'b64Tmpl', 'b64Scooter', 'b64Haldi', 'b64Mehndi', 'b64Sangeet', 'b64Pheras', 'b64Reception',
  'b64Gallery', 'eventsJson', 'd', 'calMonthName', 'calYear', 'calDayNum', 'daysInMonth', 'firstDayIndex',
  'return `' + templateStr + '`;'
);

let html = buildFn(
  data, slug, isCaricature, isPichwai, isZardozi, isMela, isNewspaper, isBougain,
  b64Cover, b64Bride, b64Groom, b64Tmpl, b64Scooter, b64Haldi, b64Mehndi, b64Sangeet, b64Pheras, b64Reception,
  b64Gallery, eventsJson, d, calMonthName, calYear, calDayNum, daysInMonth, firstDayIndex
);

// Add automatic asset resolver for GitHub Pages subpath to published HTML
const resolverScript = `  <script>
    // GitHub Pages subpath image error auto-resolver
    window.addEventListener('error', function(e) {
      if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'AUDIO')) {
        var src = e.target.src;
        if (src && src.includes('github.io/images/')) {
          e.target.src = src.replace('github.io/images/', 'github.io/wedding-invitation/images/');
        }
      }
    }, true);
  </script>
</head>`;

html = html.replace('</head>', resolverScript);

// Write to public/published/
const pubDir = path.join(__dirname, '../public/published');
if (!fs.existsSync(pubDir)) {
  fs.mkdirSync(pubDir, { recursive: true });
}

const file1 = path.join(pubDir, 'preeti-and-ashish.html');
const file2 = path.join(pubDir, 'index.html');

fs.writeFileSync(file1, html, 'utf8');
fs.writeFileSync(file2, html, 'utf8');

// For root public/preeti-and-ashish.html, prefix is ./images/
const rootHtml = html.replaceAll('../images/', './images/').replaceAll('../audio/', './audio/');
const file3 = path.join(__dirname, '../public/preeti-and-ashish.html');
fs.writeFileSync(file3, rootHtml, 'utf8');

console.log(`Generated:
  - ${file1} (${(html.length / 1024).toFixed(1)} KB)
  - ${file2} (${(html.length / 1024).toFixed(1)} KB)
  - ${file3} (${(rootHtml.length / 1024).toFixed(1)} KB)`);
