// Utility for resolving theme-specific illustration arches and artwork

export const THEME_FOLDER_MAP = {
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
  'botanical': 'Luxe-Bougainvillea-Blossom'
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

/**
 * Returns the theme-specific event arch image for any celebration event.
 * If the user uploaded a custom event photo (event.image or event.img), that is used.
 * Otherwise, the theme's matching illustrated arch (9:16) is returned.
 */
export function getThemeEventImage(templateId, event, eventIndex = 0, prefix = './') {
  if (event?.image || event?.img) {
    const custom = event.image || event.img;
    if (custom.startsWith('http') || custom.startsWith('data:') || custom.startsWith('blob:')) {
      return custom;
    }
    return `${prefix}${custom.replace(/^\.?\//, '')}`;
  }


  const folder = THEME_FOLDER_MAP[templateId] || 'Luxe-Pichwai-Lotus';
  const nameLower = (event?.name || '').toLowerCase();
  let filename = '04-pheras.webp';

  if (nameLower.includes('haldi') || nameLower.includes('ubtan') || nameLower.includes('pithi')) {
    filename = '01-haldi.webp';
  } else if (nameLower.includes('mehndi') || nameLower.includes('mehendi') || nameLower.includes('henna')) {
    filename = '02-mehndi.webp';
  } else if (nameLower.includes('sangeet') || nameLower.includes('dance') || nameLower.includes('cocktail') || nameLower.includes('ring')) {
    filename = '03-sangeet.webp';
  } else if (nameLower.includes('main') && (nameLower.includes('fere') || nameLower.includes('phera') || nameLower.includes('ceremony'))) {
    filename = '08-main-fere-ceremony.webp';
  } else if (nameLower.includes('phera') || nameLower.includes('wedding') || nameLower.includes('shaadi') || nameLower.includes('vow') || nameLower.includes('mandap')) {
    filename = '04-pheras.webp';
  } else if (nameLower.includes('barat') || nameLower.includes('baraat') || nameLower.includes('arrival') || nameLower.includes('ghurchari')) {
    filename = '05-arrival-of-barat.webp';
  } else if (nameLower.includes('varmala') || nameLower.includes('jaimala') || nameLower.includes('garland') || nameLower.includes('milni')) {
    filename = '06-varmala.webp';
  } else if (nameLower.includes('dinner') || nameLower.includes('reception') || nameLower.includes('party') || nameLower.includes('feast') || nameLower.includes('lunch')) {
    filename = '07-wedding-dinner.webp';
  } else {
    filename = EVENT_FILE_SEQUENCE[eventIndex % EVENT_FILE_SEQUENCE.length];
  }

  return `${prefix}images/themes/${folder}/${filename}`;
}

/**
 * Returns a default hero image for a theme if no cover photo is uploaded.
 * All themes use 03-sangeet.webp as the default hero poster.
 */
export function getThemeHeroImage(templateId, prefix = './') {
  const folder = THEME_FOLDER_MAP[templateId];
  if (!folder) return `${prefix}images/templates/${templateId}.webp`;
  return `${prefix}images/themes/${folder}/03-sangeet.webp`;
}

export const THEMES_LIST = [
  { id: 'caricature', folder: 'Luxe-Pastel-Caricature', name: 'Luxe Pastel Caricature' },
  { id: 'mela', folder: 'Luxe-Marigold-Mela', name: 'Luxe Marigold Mela' },
  { id: 'pichwai', folder: 'Luxe-Pichwai-Lotus', name: 'Luxe Pichwai Lotus' },
  { id: 'rajwada', folder: 'Luxe-Rajwada-Miniature', name: 'Luxe Rajwada Miniature' },
  { id: 'zardozi', folder: 'Luxe-Heirloom-Zardozi', name: 'Luxe Heirloom Zardozi' },
  { id: 'storybook', folder: 'Storybook', name: 'Storybook Fairytale' },
  { id: 'newspaper', folder: 'The-Shaadi-Times', name: 'The Shaadi Times' },
  { id: 'bougain', folder: 'Luxe-Bougainvillea-Blossom', name: 'Luxe Bougainvillea Blossom' },
  { id: 'ballroom', folder: 'Gilded-Ballroom', name: 'Gilded Ballroom' },
  { id: 'peaks', folder: 'Pastel-Peaks', name: 'Pastel Peaks' },
  { id: 'resort', folder: 'Luxury-Beach-Resort', name: 'Luxury Beach Resort' },
  { id: 'luxury-resort', folder: 'Luxury-Resort', name: 'Luxury Resort' },
  { id: 'mandap', folder: 'Paper-Blossom', name: 'Paper Blossom' },
  { id: 'truck', folder: 'Desi-Truck-Art', name: 'Desi Truck Art' },
  { id: 'nikah', folder: 'Nikah', name: 'Royal Nikah Mubarak' },
  { id: 'rangla', folder: 'Rangla-Viah', name: 'Rangla Viah' },
  { id: '3d-human', folder: '3D-Model-Human-Colorful-v3', name: '3D Model Human' },
  { id: '3d-pixar', folder: '3D-Pixar', name: '3D Pixar' },
  { id: 'aladdin', folder: 'Aladdin-Jasmine', name: 'Aladdin & Jasmine' },
  { id: 'cute-couples', folder: 'Cute-Couples', name: 'Cute Couples' },
  { id: 'kalyanam', folder: 'Kalyanam', name: 'Kalyanam' },
  { id: 'marble', folder: 'Marble-Style', name: 'Marble Style' },
  { id: 'water', folder: 'Water', name: 'Serene Water' },
  { id: 'watercolor', folder: 'Watercolor-Portrait', name: 'Watercolor Portrait' }
];

export const CEREMONY_FILES = [
  { file: '03-sangeet.webp', ceremony: 'Sangeet', title: 'Sangeet Night (Hero Banner)', isHero: true },
  { file: '01-haldi.webp', ceremony: 'Haldi', title: 'Haldi Ceremony' },
  { file: '02-mehndi.webp', ceremony: 'Mehndi', title: 'Mehndi Celebration' },
  { file: '04-pheras.webp', ceremony: 'Pheras', title: 'Pheras Mandap' },
  { file: '05-arrival-of-barat.webp', ceremony: 'Barat', title: 'Arrival of Barat' },
  { file: '06-varmala.webp', ceremony: 'Varmala', title: 'Varmala Garland' },
  { file: '07-wedding-dinner.webp', ceremony: 'Dinner', title: 'Wedding Dinner' },
  { file: '08-main-fere-ceremony.webp', ceremony: 'Main Fere', title: 'Main Fere Ceremony' },
];

export const ALL_THEME_ARTWORKS = THEMES_LIST.flatMap(t => 
  CEREMONY_FILES.map(c => ({
    themeId: t.id,
    themeName: t.name,
    folder: t.folder,
    ceremony: c.ceremony,
    title: c.title,
    isHero: Boolean(c.isHero),
    file: c.file,
    url: `./images/themes/${t.folder}/${c.file}`
  }))
);
