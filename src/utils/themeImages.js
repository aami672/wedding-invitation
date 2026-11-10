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

  // Caricature fallback to dedicated arch artwork if available
  if (templateId === 'caricature') {
    const nameLower = (event?.name || '').toLowerCase();
    if (nameLower.includes('haldi')) return `${prefix}images/caricature/haldi_arch.webp`;
    if (nameLower.includes('mehndi') || nameLower.includes('mehendi')) return `${prefix}images/caricature/mehndi_arch.webp`;
    if (nameLower.includes('sangeet')) return `${prefix}images/caricature/sangeet_arch.webp`;
    if (event?.id === 'evt-pheras' || nameLower.includes('wedding') || nameLower.includes('phera') || nameLower.includes('shaadi')) return `${prefix}images/caricature/pheras_arch.webp`;
    if (nameLower.includes('reception') || nameLower.includes('party') || nameLower.includes('dinner')) return `${prefix}images/caricature/reception_arch.webp`;
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
 */
export function getThemeHeroImage(templateId, prefix = './') {
  const folder = THEME_FOLDER_MAP[templateId];
  if (!folder) return `${prefix}images/templates/${templateId}.webp`;
  return `${prefix}images/themes/${folder}/04-pheras.webp`;
}
