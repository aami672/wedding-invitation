import { PALETTES } from '../data/presets.js';

/**
 * Color math helpers for automatic Light/Dark palette contrast
 */
function parseHex(hex) {
  if (!hex || typeof hex !== 'string') return { r: 250, g: 247, b: 242 };
  const clean = hex.replace('#', '').trim();
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean.padEnd(6, '0').slice(0, 6);
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return { r: 250, g: 247, b: 242 };
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function toHex({ r, g, b }) {
  const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [clamp(r), clamp(g), clamp(b)].map(v => v.toString(16).padStart(2, '0')).join('');
}

function mixHex(hexA, hexB, weightB = 0.5) {
  const a = parseHex(hexA);
  const b = parseHex(hexB);
  const w = Math.max(0, Math.min(1, weightB));
  return toHex({
    r: a.r * (1 - w) + b.r * w,
    g: a.g * (1 - w) + b.g * w,
    b: a.b * (1 - w) + b.b * w,
  });
}

function rgba(hex, alpha = 1) {
  const { r, g, b } = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getRelativeLuminance(hex) {
  const { r, g, b } = parseHex(hex);
  const srgb = [r, g, b].map(v => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

function ensureMinLuminance(hex, minLum = 0.55) {
  let current = hex;
  let step = 0;
  while (getRelativeLuminance(current) < minLum && step < 12) {
    current = mixHex(current, '#FFF8E7', 0.2);
    step++;
  }
  return current;
}

function ensureMaxLuminance(hex, maxLum = 0.16) {
  let current = hex;
  let step = 0;
  while (getRelativeLuminance(current) > maxLum && step < 12) {
    current = mixHex(current, '#1F140E', 0.2);
    step++;
  }
  return current;
}

/**
 * Resolves typography CSS variables from saved typography settings.
 */
export function resolveTypographyVars(typography = {}) {
  const heading = typography?.headingFont || 'Cinzel';
  const body = typography?.bodyFont || 'Cormorant Garamond';
  const script = typography?.scriptFont || 'Great Vibes';
  const fontsToLoad = Array.from(new Set([heading, body, script].filter(Boolean)));
  return {
    headingFont: heading,
    bodyFont: body,
    scriptFont: script,
    fontsToLoad,
    cssVars: {
      '--font-heading': `"${heading}", Georgia, serif`,
      '--font-body': `"${body}", Georgia, serif`,
      '--font-script': `"${script}", cursive`,
      '--font-royal': `"${heading}", Georgia, serif`,
      '--font-serif': `"${body}", Georgia, serif`,
    },
  };
}

const KNOWN_FONTS = new Set([
  'Abril Fatface', 'Alex Brush', 'Allura', 'Bodoni Moda', 'Cinzel',
  'Cormorant Garamond', 'EB Garamond', 'Great Vibes', 'Italianno', 'Lora',
  'Marcellus', 'Montserrat', 'Parisienne', 'Philosopher', 'Pinyon Script',
  'Playfair Display', 'Plus Jakarta Sans', 'Poppins', 'Prata', 'Rozha One',
  'Satisfy', 'Tangerine',
]);

/**
 * Appends any custom Studio Google Fonts not already covered in the default bundle.
 */
export function buildGoogleFontsUrl(typography = {}) {
  const base = 'https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alex+Brush&family=Allura&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700&family=Cinzel:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Great+Vibes&family=Italianno&family=Lora:ital,wght@0,400..700;1,400..700&family=Marcellus&family=Montserrat:wght@300;400;500;600;700&family=Parisienne&family=Philosopher:ital,wght@0,400;0,700;1,400&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Prata&family=Rozha+One&family=Satisfy&family=Tangerine:wght@700';
  const extras = [typography?.headingFont, typography?.bodyFont, typography?.scriptFont]
    .filter(f => f && !KNOWN_FONTS.has(f))
    .map(f => `&family=${encodeURIComponent(f)}:wght@400;600;700`)
    .join('');
  return `${base}${extras}&display=swap`;
}

/**
 * Resolves full light/dark adaptive palette tokens.
 * Automatically adjusts ink lightness when a dark palette is active and darkens ink when a light palette is active.
 */
export function resolvePaletteTheme(templateId = 'caricature', paletteId = 'ivory') {
  const pal = PALETTES.find(p => p.id === paletteId) || PALETTES[0];
  let bg = pal.colors?.[0] || '#FAF7F2';
  let ink = pal.colors?.[1] || '#2B1E17';
  let accent = pal.colors?.[2] || '#C5A880';
  let mutedBase = pal.colors?.[3] || '#8A7D70';

  // Preserve native deep indigo-emerald Pichwai canvas on default cream palettes unless user explicitly chose another palette
  if (templateId === 'pichwai' && (paletteId === 'champagne' || paletteId === 'ivory' || !paletteId)) {
    bg = '#071A1E';
    ink = '#F4ECDE';
    accent = '#D4AF37';
    mutedBase = '#B8A98E';
  } else if (templateId === 'newspaper' && (paletteId === 'champagne' || paletteId === 'ivory' || !paletteId)) {
    bg = '#F6F1E5';
    ink = '#1E1E1E';
    accent = '#8B6F47';
    mutedBase = '#57534E';
  }

  const lum = getRelativeLuminance(bg);
  const isDark = lum < 0.35;

  if (isDark) {
    const heading = ensureMinLuminance(ink, 0.78);
    const text = ensureMinLuminance(ink, 0.70);
    const brightAccent = ensureMinLuminance(accent, 0.42);
    const eyebrow = mixHex(brightAccent, '#FFF8E7', 0.25);
    const muted = ensureMinLuminance(mixHex(mutedBase, text, 0.45), 0.44);
    const subtle = rgba(text, 0.64);
    const cardBase = mixHex(bg, '#FFFFFF', 0.08);
    const surfaceBase = mixHex(bg, '#FFFFFF', 0.12);
    const btnBg = brightAccent;
    const btnIsLight = getRelativeLuminance(btnBg) > 0.42;

    return {
      isDark: true,
      paletteId: pal.id,
      bg,
      heading,
      text,
      muted,
      subtle,
      accent: brightAccent,
      eyebrow,
      cardBg: rgba(cardBase, 0.80),
      cardSurface: rgba(surfaceBase, 0.92),
      cardBorder: rgba(brightAccent, 0.44),
      modalBg: mixHex(bg, '#FFFFFF', 0.10),
      pillBg: rgba(brightAccent, 0.18),
      pillBorder: rgba(brightAccent, 0.42),
      pillText: mixHex(brightAccent, '#FFFFFF', 0.55),
      btnBg,
      btnText: btnIsLight ? '#1C130C' : '#FAF5EC',
      btnSecondaryBg: rgba(surfaceBase, 0.85),
      btnSecondaryText: heading,
      stickyBg: mixHex(bg, '#3D2B14', 0.55),
      stickyBorder: rgba(brightAccent, 0.55),
      stickyText: '#FBF3E4',
      ruleColor: brightAccent,
      heroImgBg: rgba(mixHex(bg, '#000000', 0.2), 0.65),
      cssVars: {
        '--pal-bg': bg,
        '--pal-heading': heading,
        '--pal-text': text,
        '--pal-muted': muted,
        '--pal-subtle': subtle,
        '--pal-accent': brightAccent,
        '--pal-eyebrow': eyebrow,
        '--pal-card-bg': rgba(cardBase, 0.80),
        '--pal-card-surface': rgba(surfaceBase, 0.92),
        '--pal-card-border': rgba(brightAccent, 0.44),
        '--pal-modal-bg': mixHex(bg, '#FFFFFF', 0.10),
        '--pal-pill-bg': rgba(brightAccent, 0.18),
        '--pal-pill-border': rgba(brightAccent, 0.42),
        '--pal-pill-text': mixHex(brightAccent, '#FFFFFF', 0.55),
        '--pal-btn-bg': btnBg,
        '--pal-btn-text': btnIsLight ? '#1C130C' : '#FAF5EC',
        '--pal-btn-sec-bg': rgba(surfaceBase, 0.85),
        '--pal-btn-sec-text': heading,
        '--pal-sticky-bg': mixHex(bg, '#3D2B14', 0.55),
        '--pal-sticky-border': rgba(brightAccent, 0.55),
        '--pal-sticky-text': '#FBF3E4',
        '--pal-rule': brightAccent,
        '--pal-hero-img-bg': rgba(mixHex(bg, '#000000', 0.2), 0.65),
        '--pal-door-left': mixHex(bg, '#2B1810', 0.45),
        '--pal-door-right': mixHex(bg, '#2B1810', 0.45),
      },
    };
  }

  // Light Palette Mode — ensure strong dark ink readability even on soft pastel palettes (e.g. wisteria)
  const heading = ensureMaxLuminance(ink, 0.12);
  const text = ensureMaxLuminance(ink, 0.18);
  const deepAccent = getRelativeLuminance(accent) > 0.58 ? mixHex(accent, heading, 0.55) : accent;
  const isCaricatureWarm = templateId === 'caricature' && (paletteId === 'ivory' || paletteId === 'champagne' || paletteId === 'blush' || !paletteId);
  const eyebrow = isCaricatureWarm ? '#DB2777' : ensureMaxLuminance(mixHex(deepAccent, '#881337', 0.35), 0.25);
  const muted = ensureMaxLuminance(mixHex(mutedBase, heading, 0.42), 0.26);
  const subtle = mixHex(muted, bg, 0.22);
  const cardTint = mixHex('#FFFFFF', bg, 0.25);
  const btnBg = isCaricatureWarm ? '#881337' : ensureMaxLuminance(mixHex(deepAccent, heading, 0.35), 0.18);

  return {
    isDark: false,
    paletteId: pal.id,
    bg,
    heading,
    text,
    muted,
    subtle,
    accent: deepAccent,
    eyebrow,
    cardBg: rgba(cardTint, 0.82),
    cardSurface: 'rgba(255, 255, 255, 0.92)',
    cardBorder: rgba(deepAccent, 0.36),
    modalBg: '#FFFDF9',
    pillBg: isCaricatureWarm ? '#FCE7F3' : rgba(deepAccent, 0.14),
    pillBorder: isCaricatureWarm ? 'rgba(244, 114, 182, 0.45)' : rgba(deepAccent, 0.32),
    pillText: isCaricatureWarm ? '#BE185D' : ensureMaxLuminance(deepAccent, 0.22),
    btnBg,
    btnText: '#FFFFFF',
    btnSecondaryBg: '#FFFDF7',
    btnSecondaryText: ensureMaxLuminance(deepAccent, 0.24),
    stickyBg: '#FEF08A',
    stickyBorder: '#FDE047',
    stickyText: '#451A03',
    ruleColor: deepAccent,
    heroImgBg: '#FFFDF7',
    cssVars: {
      '--pal-bg': bg,
      '--pal-heading': heading,
      '--pal-text': text,
      '--pal-muted': muted,
      '--pal-subtle': subtle,
      '--pal-accent': deepAccent,
      '--pal-eyebrow': eyebrow,
      '--pal-card-bg': rgba(cardTint, 0.82),
      '--pal-card-surface': 'rgba(255, 255, 255, 0.92)',
      '--pal-card-border': rgba(deepAccent, 0.36),
      '--pal-modal-bg': '#FFFDF9',
      '--pal-pill-bg': isCaricatureWarm ? '#FCE7F3' : rgba(deepAccent, 0.14),
      '--pal-pill-border': isCaricatureWarm ? 'rgba(244, 114, 182, 0.45)' : rgba(deepAccent, 0.32),
      '--pal-pill-text': isCaricatureWarm ? '#BE185D' : ensureMaxLuminance(deepAccent, 0.22),
      '--pal-btn-bg': btnBg,
      '--pal-btn-text': '#FFFFFF',
      '--pal-btn-sec-bg': '#FFFDF7',
      '--pal-btn-sec-text': ensureMaxLuminance(deepAccent, 0.24),
      '--pal-sticky-bg': '#FEF08A',
      '--pal-sticky-border': '#FDE047',
      '--pal-sticky-text': '#451A03',
      '--pal-rule': deepAccent,
      '--pal-hero-img-bg': '#FFFDF7',
      '--pal-door-left': '#FCE7F3',
      '--pal-door-right': '#FCE7F3',
    },
  };
}

/**
 * Per-theme visual grammar: card architecture, top mala/canopy, side obstacles, dividers & invocations.
 * 'caricature' keeps its signature layout preserved verbatim.
 */
const THEME_CONFIG_MAP = {
  caricature: {
    family: 'caricature',
    cardClass: 'theme-card-caricature',
    invocation: '॥ श्री गणेशाय नमः ॥',
    closingEmoji: '🛵',
    calendarHeart: true,
    storyLabel: 'Dear diary',
    meetBadgeGroom: 'The Groom',
    meetBadgeBride: 'The Bride',
    footerTitle: 'See you at the shaadi!',
  },
  zardozi: {
    family: 'zardozi',
    cardClass: 'theme-card-zari',
    invocation: '॥ श्री गणेशाय नमः ॥',
    closingEmoji: '🪡',
    storyLabel: 'Heirloom Chronicles',
    meetBadgeGroom: 'The Maharaja',
    meetBadgeBride: 'The Maharani',
    footerTitle: 'Woven Together Forever',
  },
  pichwai: {
    family: 'pichwai',
    cardClass: 'theme-card-pichwai',
    invocation: '॥ श्री कृष्णाय नमः ॥',
    closingEmoji: '🪷',
    storyLabel: 'Sacred Love Note',
    meetBadgeGroom: 'The Groom',
    meetBadgeBride: 'The Bride',
    footerTitle: 'Blessed Forever',
  },
  mela: {
    family: 'mela',
    cardClass: 'theme-card-mela',
    invocation: '✦ शुभ विवाह उत्सव ✦',
    closingEmoji: '🎡',
    storyLabel: 'Mela Memory Book',
    meetBadgeGroom: 'The Dulha',
    meetBadgeBride: 'The Dulhan',
    footerTitle: 'Aaja Nachle at the Mela!',
  },
  rajwada: {
    family: 'rajwada',
    cardClass: 'theme-card-rajwada',
    invocation: '॥ श्री एकलिंगजी प्रसन्ना ॥',
    closingEmoji: '🦚',
    storyLabel: 'Royal Gazette',
    meetBadgeGroom: 'Kunwar Sa',
    meetBadgeBride: 'Baisa',
    footerTitle: 'By Royal Command of Love',
  },
  royal: { alias: 'rajwada' },
  cinematic: { alias: 'rajwada' },
  nikah: {
    family: 'nikah',
    cardClass: 'theme-card-mughal',
    invocation: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',
    closingEmoji: '🌙',
    storyLabel: 'Safar-e-Ishq',
    meetBadgeGroom: 'The Groom',
    meetBadgeBride: 'The Bride',
    footerTitle: 'With Blessings & Dua',
  },
  aladdin: {
    family: 'aladdin',
    cardClass: 'theme-card-mughal',
    invocation: '✦ A Whole New World Together ✦',
    closingEmoji: '🪔',
    storyLabel: 'Arabian Tales',
    meetBadgeGroom: 'Prince',
    meetBadgeBride: 'Princess',
    footerTitle: 'Beneath the Agrabah Stars',
  },
  rangla: {
    family: 'rangla',
    cardClass: 'theme-card-phulkari',
    invocation: '✦ ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ · ਸ਼ੁਭ ਵਿਆਹ ✦',
    closingEmoji: '🥁',
    storyLabel: 'Rangla Sangeet Note',
    meetBadgeGroom: 'Munda',
    meetBadgeBride: 'Kudi',
    footerTitle: 'Bhangra Time at the Viah!',
  },
  truck: {
    family: 'truck',
    cardClass: 'theme-card-truck',
    invocation: '✦ HORN OK PLEASE · शुभ विवाह ✦',
    closingEmoji: '🚛',
    storyLabel: 'Highway Journal',
    meetBadgeGroom: 'Highway King',
    meetBadgeBride: 'Dil Ki Rani',
    footerTitle: 'Pyaar Wali Sawari Awaits!',
  },
  bougain: {
    family: 'bougain',
    cardClass: 'theme-card-floral',
    invocation: '❀ Under the Blooming Vines ❀',
    closingEmoji: '🌺',
    storyLabel: 'Garden Letters',
    meetBadgeGroom: 'The Groom',
    meetBadgeBride: 'The Bride',
    footerTitle: 'Forever in Full Bloom',
  },
  bougainvillea: { alias: 'bougain' },
  botanical: { alias: 'bougain' },
  mandap: {
    family: 'papercraft',
    cardClass: 'theme-card-papercraft',
    invocation: '॥ श्री गणेशाय नमः ॥',
    closingEmoji: '🌸',
    storyLabel: 'Folded in Love',
    meetBadgeGroom: 'The Groom',
    meetBadgeBride: 'The Bride',
    footerTitle: 'Crafted Forever',
  },
  'paper-blossom': { alias: 'mandap' },
  blossom: { alias: 'mandap' },
  ballroom: {
    family: 'ballroom',
    cardClass: 'theme-card-deco',
    invocation: '✦ A GRAND EVENING SOIRÉE ✦',
    closingEmoji: '🥂',
    storyLabel: 'Evening Programme',
    meetBadgeGroom: 'The Groom',
    meetBadgeBride: 'The Bride',
    footerTitle: 'Until the Final Waltz',
  },
  marble: {
    family: 'marble',
    cardClass: 'theme-card-marble',
    invocation: '✦ SET IN TIMELESS MARBLE ✦',
    closingEmoji: '🏛️',
    storyLabel: 'Stone Inscription',
    meetBadgeGroom: 'The Groom',
    meetBadgeBride: 'The Bride',
    footerTitle: 'Carved in Eternity',
  },
  peaks: {
    family: 'peaks',
    cardClass: 'theme-card-peaks',
    invocation: '✦ WRITTEN ABOVE THE CLOUDS ✦',
    closingEmoji: '🏔️',
    storyLabel: 'Mountain Postcard',
    meetBadgeGroom: 'The Groom',
    meetBadgeBride: 'The Bride',
    footerTitle: 'Where Earth Meets Heaven',
  },
  resort: {
    family: 'coastal',
    cardClass: 'theme-card-coastal',
    invocation: '✦ BY THE SHORES OF FOREVER ✦',
    closingEmoji: '🐚',
    storyLabel: 'Messages in the Sand',
    meetBadgeGroom: 'The Groom',
    meetBadgeBride: 'The Bride',
    footerTitle: 'Sunsets & Barefoot Vows',
  },
  'luxury-resort': { alias: 'resort' },
  water: { alias: 'resort' },
  kalyanam: {
    family: 'kalyanam',
    cardClass: 'theme-card-temple',
    invocation: '॥ शुभ कल्याणं · श्री गणेशाय नमः ॥',
    closingEmoji: '🪔',
    storyLabel: 'Sacred Notes',
    meetBadgeGroom: 'Manamagan',
    meetBadgeBride: 'Manamagal',
    footerTitle: 'Subham Bhavatu!',
  },
  storybook: {
    family: 'storybook',
    cardClass: 'theme-card-folio',
    invocation: '✦ ONCE UPON A LIFETIME ✦',
    closingEmoji: '📖',
    storyLabel: 'Chapter One',
    meetBadgeGroom: 'Our Hero',
    meetBadgeBride: 'Our Heroine',
    footerTitle: 'And They Lived Happily Ever After',
  },
  '3d-pixar': {
    family: 'plush',
    cardClass: 'theme-card-plush',
    invocation: '✨ OUR FAVORITE ADVENTURE ✨',
    closingEmoji: '🎈',
    storyLabel: 'Our Journey',
    meetBadgeGroom: 'The Groom',
    meetBadgeBride: 'The Bride',
    footerTitle: 'See You at the Celebration!',
  },
  '3d-human': { alias: '3d-pixar' },
  'cute-couples': { alias: '3d-pixar' },
  watercolor: {
    family: 'watercolor',
    cardClass: 'theme-card-deckle',
    invocation: '❀ PAINTED WITH LOVE ❀',
    closingEmoji: '🎨',
    storyLabel: 'Studio Sketchbook',
    meetBadgeGroom: 'The Groom',
    meetBadgeBride: 'The Bride',
    footerTitle: 'A Watercolor Forever',
  },
  newspaper: {
    family: 'newspaper',
    cardClass: 'theme-card-press',
    invocation: 'SPECIAL WEDDING GAZETTE · EST. EDITION',
    closingEmoji: '🗞️',
    storyLabel: 'Feature Article',
    meetBadgeGroom: 'Featured Groom',
    meetBadgeBride: 'Featured Bride',
    footerTitle: 'Read All About It on Wedding Day!',
  },
  editorial: { alias: 'newspaper' },
};

export function getThemeDesign(templateId = 'caricature') {
  const raw = THEME_CONFIG_MAP[templateId];
  const resolved = raw?.alias ? THEME_CONFIG_MAP[raw.alias] : (raw || THEME_CONFIG_MAP.zardozi);
  return {
    id: templateId || 'caricature',
    ...resolved,
    isCaricature: resolved.family === 'caricature',
    isNewspaper: resolved.family === 'newspaper',
  };
}

/**
 * Generates Top Mala / Canopy SVG/HTML tailored to each selected theme.
 * Returns empty string for 'caricature' so its original ParallaxWeddingDecorations layout stays untouched.
 */
export function renderThemeTopHtml(templateId = 'caricature') {
  const { family } = getThemeDesign(templateId);
  if (family === 'caricature') return '';

  const garlands = {
    zardozi: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex flex-col items-center">
        <div class="w-full h-2.5 shadow-sm" style="background: linear-gradient(90deg, #5C0A1B, #B91C1C, #D4AF37, #B91C1C, #5C0A1B); border-bottom: 1.5px solid #D4AF37;"></div>
        <svg viewBox="0 0 800 54" class="w-full max-w-5xl h-auto drop-shadow" fill="none">
          ${[0, 160, 320, 480, 640].map(x => `
            <path d="M${x},0 Q${x + 80},34 ${x + 160},0" stroke="#D4AF37" stroke-width="2.5" fill="rgba(136,19,55,0.88)" />
            <circle cx="${x + 40}" cy="18" r="3" fill="#FEF08A" />
            <circle cx="${x + 80}" cy="24" r="4.5" fill="#D4AF37" />
            <line x1="${x + 80}" y1="28" x2="${x + 80}" y2="43" stroke="#D4AF37" stroke-width="1.5" />
            <polygon points="${x + 80},43 ${x + 75},52 ${x + 85},52" fill="#FEF08A" />
            <circle cx="${x + 120}" cy="18" r="3" fill="#FEF08A" />
          `).join('')}
        </svg>
      </div>`,
    pichwai: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex flex-col items-center">
        <svg viewBox="0 0 800 60" class="w-full max-w-4xl h-auto drop-shadow" fill="none">
          ${[40, 160, 280, 400, 520, 640, 760].map((cx, idx) => `
            <path d="M${cx - 60},0 Q${cx},22 ${cx + 60},0" stroke="#D4AF37" stroke-width="2" />
            <line x1="${cx}" y1="0" x2="${cx}" y2="${idx % 2 === 0 ? 34 : 24}" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="3,2" />
            <circle cx="${cx}" cy="${idx % 2 === 0 ? 16 : 12}" r="2.2" fill="#FFF8DC" />
            <g transform="translate(${cx}, ${idx % 2 === 0 ? 38 : 28})">
              <path d="M0,-8 C5,-2 8,4 0,10 C-8,4 -5,-2 0,-8 Z" fill="#F472B6" stroke="#D4AF37" stroke-width="1" />
              <path d="M-8,2 C-4,-2 0,0 0,8 C-6,8 -10,4 -8,2 Z" fill="#FB7185" opacity="0.85" />
              <path d="M8,2 C4,-2 0,0 0,8 C6,8 10,4 8,2 Z" fill="#FB7185" opacity="0.85" />
            </g>
          `).join('')}
        </svg>
      </div>`,
    mela: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex flex-col items-center">
        <div class="w-full h-5 flex shadow-md overflow-hidden">
          ${Array.from({ length: 18 }).map((_, i) => `<div class="flex-1 h-full rounded-b-full ${i % 2 === 0 ? 'bg-[#D97706]' : 'bg-[#BE123C]'} border-b-2 border-[#FDE047]"></div>`).join('')}
        </div>
        <div class="flex justify-around w-full max-w-3xl -mt-1 px-4 text-sm sm:text-base drop-shadow animate-sway">
          <span>🌼</span><span>🏮</span><span>🌼</span><span>🪅</span><span>🌼</span><span>🏮</span><span>🌼</span>
        </div>
      </div>`,
    rajwada: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex flex-col items-center">
        <svg viewBox="0 0 800 54" class="w-full max-w-5xl h-auto drop-shadow" fill="none">
          ${[0, 100, 200, 300, 400, 500, 600, 700].map(x => `
            <path d="M${x},0 L${x},12 C${x + 25},28 ${x + 50},18 ${x + 50},36 C${x + 50},18 ${x + 75},28 ${x + 100},12 L${x + 100},0 Z" fill="rgba(180,83,9,0.22)" stroke="#D4AF37" stroke-width="1.8" />
            <circle cx="${x + 50}" cy="41" r="4" fill="#DC2626" stroke="#D4AF37" stroke-width="1.2" />
          `).join('')}
        </svg>
      </div>`,
    nikah: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex flex-col items-center">
        <svg viewBox="0 0 800 62" class="w-full max-w-4xl h-auto drop-shadow" fill="none">
          ${[60, 180, 300, 400, 500, 620, 740].map((cx, i) => `
            <path d="M${cx - 60},0 Q${cx},22 ${cx + 60},0" stroke="#D4AF37" stroke-width="1.8" />
            <line x1="${cx}" y1="0" x2="${cx}" y2="${i % 2 === 0 ? 34 : 24}" stroke="#D4AF37" stroke-width="1.4" />
            <polygon points="${cx},${i % 2 === 0 ? 32 : 22} ${cx - 7},${i % 2 === 0 ? 44 : 34} ${cx},${i % 2 === 0 ? 54 : 44} ${cx + 7},${i % 2 === 0 ? 44 : 34}" fill="#FDE047" stroke="#B45309" stroke-width="1.3" />
          `).join('')}
        </svg>
      </div>`,
    aladdin: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex flex-col items-center">
        <svg viewBox="0 0 800 58" class="w-full max-w-4xl h-auto drop-shadow" fill="none">
          ${[80, 200, 320, 400, 480, 600, 720].map((cx, i) => `
            <path d="M${cx - 60},0 Q${cx},20 ${cx + 60},0" stroke="#D4AF37" stroke-width="1.8" />
            <line x1="${cx}" y1="0" x2="${cx}" y2="${i % 2 === 0 ? 32 : 22}" stroke="#D4AF37" stroke-width="1.3" />
            <path d="M${cx},${i % 2 === 0 ? 32 : 22} L${cx + 4},${i % 2 === 0 ? 40 : 30} L${cx + 12},${i % 2 === 0 ? 42 : 32} L${cx + 4},${i % 2 === 0 ? 45 : 35} L${cx},${i % 2 === 0 ? 53 : 43} L${cx - 4},${i % 2 === 0 ? 45 : 35} L${cx - 12},${i % 2 === 0 ? 42 : 32} L${cx - 4},${i % 2 === 0 ? 40 : 30} Z" fill="#FBBF24" />
          `).join('')}
        </svg>
      </div>`,
    rangla: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex flex-col items-center">
        <div class="w-full h-3.5" style="background: repeating-linear-gradient(135deg, #DB2777 0px 14px, #F59E0B 14px 28px, #10B981 28px 42px);"></div>
        <div class="flex justify-around w-full max-w-4xl px-2 -mt-0.5 text-sm sm:text-base drop-shadow animate-sway">
          <span>🔔</span><span>🌺</span><span>🥁</span><span>🌺</span><span>🔔</span><span>🌺</span><span>🔔</span>
        </div>
      </div>`,
    truck: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex flex-col items-center">
        <div class="w-full h-3.5 border-b-2 border-black" style="background: repeating-linear-gradient(90deg, #F59E0B 0 24px, #EC4899 24px 48px, #06B6D4 48px 72px, #22C55E 72px 96px);"></div>
        <div class="flex items-center justify-between w-full max-w-3xl px-4 -mt-0.5 text-sm drop-shadow">
          <span>🧿</span><span>💐</span><span class="px-2 py-0.5 bg-amber-400 text-black text-[9px] font-black uppercase tracking-widest border border-black rounded-b-md shadow">HORN OK PLEASE</span><span>💐</span><span>🧿</span>
        </div>
      </div>`,
    bougain: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex justify-center">
        <svg viewBox="0 0 800 54" class="w-full max-w-4xl h-auto drop-shadow" fill="none">
          <path d="M0,6 Q200,26 400,8 Q600,26 800,6" stroke="#4D7C0F" stroke-width="2.5" />
          ${[45, 130, 220, 310, 400, 490, 580, 670, 755].map((cx, i) => `
            <ellipse cx="${cx - 12}" cy="16" rx="9" ry="4" transform="rotate(-20 ${cx - 12} 16)" fill="#65A30D" opacity="0.85" />
            <circle cx="${cx}" cy="${i % 2 === 0 ? 22 : 16}" r="7" fill="${i % 3 === 0 ? '#DB2777' : '#F472B6'}" />
            <circle cx="${cx + 7}" cy="${i % 2 === 0 ? 18 : 24}" r="5.5" fill="#EC4899" />
            <circle cx="${cx}" cy="${i % 2 === 0 ? 22 : 16}" r="2" fill="#FEF08A" />
          `).join('')}
        </svg>
      </div>`,
    papercraft: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex justify-center">
        <svg viewBox="0 0 800 52" class="w-full max-w-4xl h-auto drop-shadow" fill="none">
          <path d="M0,4 Q200,24 400,4 Q600,24 800,4" stroke="#C5A880" stroke-width="1.8" stroke-dasharray="5,4" />
          ${[60, 180, 300, 400, 500, 620, 740].map((cx, i) => `
            <g transform="translate(${cx}, ${i % 2 === 0 ? 22 : 16})">
              <circle r="11" fill="#FBCFE8" opacity="0.92" />
              <circle r="7" fill="#FFFDF9" />
              <circle r="3" fill="#F59E0B" />
            </g>
          `).join('')}
        </svg>
      </div>`,
    ballroom: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex flex-col items-center">
        <svg viewBox="0 0 800 58" class="w-full max-w-4xl h-auto drop-shadow" fill="none">
          ${[0, 200, 400, 600].map(x => `
            <path d="M${x},0 Q${x + 100},28 ${x + 200},0" stroke="#D4AF37" stroke-width="2" />
            <circle cx="${x + 100}" cy="18" r="2.5" fill="#FFF8DC" />
            <polygon points="${x + 100},20 ${x + 95},34 ${x + 100},46 ${x + 105},34" fill="#FEF9C3" fill-opacity="0.9" stroke="#D4AF37" stroke-width="1" />
          `).join('')}
        </svg>
      </div>`,
    marble: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex flex-col items-center">
        <div class="w-full h-2 border-b" style="background: linear-gradient(90deg, transparent, var(--pal-accent), transparent); opacity: 0.75;"></div>
        <svg viewBox="0 0 800 36" class="w-full max-w-4xl h-auto opacity-85" fill="none">
          ${[80, 240, 400, 560, 720].map(cx => `
            <path d="M${cx - 35},2 Q${cx},18 ${cx + 35},2" stroke="#C5A880" stroke-width="1.5" />
            <circle cx="${cx}" cy="18" r="4" fill="#10B981" stroke="#C5A880" stroke-width="1.2" />
          `).join('')}
        </svg>
      </div>`,
    peaks: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex flex-col items-center">
        <svg viewBox="0 0 800 44" class="w-full max-w-4xl h-auto drop-shadow-sm" fill="none">
          <path d="M0,4 Q200,26 400,6 Q600,26 800,4" stroke="#64748B" stroke-width="1.4" />
          ${[50, 120, 190, 260, 330, 400, 470, 540, 610, 680, 750].map((cx, i) => `
            <polygon points="${cx - 16},10 ${cx + 16},10 ${cx},30" fill="${['#93C5FD', '#FDE68A', '#F9A8D4', '#A7F3D0', '#DDD6FE'][i % 5]}" opacity="0.9" />
          `).join('')}
        </svg>
      </div>`,
    coastal: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex flex-col items-center">
        <svg viewBox="0 0 800 50" class="w-full max-w-4xl h-auto drop-shadow-sm" fill="none">
          ${[55, 170, 285, 400, 515, 630, 745].map((cx, i) => `
            <path d="M${cx - 57},0 Q${cx},20 ${cx + 57},0" stroke="#7DD3FC" stroke-width="2" />
            <circle cx="${cx}" cy="${i % 2 === 0 ? 22 : 16}" r="5.5" fill="${i % 2 === 0 ? '#FDF2F8' : '#FEF3C7'}" stroke="#38BDF8" stroke-width="1.2" />
          `).join('')}
        </svg>
      </div>`,
    kalyanam: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex flex-col items-center">
        <div class="w-full h-2.5" style="background: linear-gradient(90deg, #166534, #15803D, #D4AF37, #15803D, #166534);"></div>
        <svg viewBox="0 0 800 54" class="w-full max-w-4xl h-auto drop-shadow" fill="none">
          ${[45, 135, 225, 315, 400, 485, 575, 665, 755].map(cx => `
            <path d="M${cx},4 L${cx - 12},26 C${cx - 4},30 ${cx + 4},30 ${cx + 12},26 Z" fill="#16A34A" stroke="#14532D" stroke-width="1" />
            <circle cx="${cx}" cy="34" r="5" fill="#F8FAFC" stroke="#D4AF37" stroke-width="1.3" />
            <circle cx="${cx}" cy="44" r="3.5" fill="#F59E0B" />
          `).join('')}
        </svg>
      </div>`,
    storybook: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex flex-col items-center">
        <svg viewBox="0 0 800 48" class="w-full max-w-4xl h-auto drop-shadow-sm" fill="none">
          <path d="M0,6 Q200,24 400,6 Q600,24 800,6" stroke="#B08968" stroke-width="1.8" />
          ${[70, 190, 310, 400, 490, 610, 730].map((cx, i) => `
            <circle cx="${cx}" cy="${i % 2 === 0 ? 22 : 16}" r="4" fill="#FDE047" opacity="0.9" />
            <path d="M${cx - 10},12 Q${cx - 16},20 ${cx - 8},24" stroke="#65A30D" stroke-width="1.4" />
          `).join('')}
        </svg>
      </div>`,
    plush: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex flex-col items-center">
        <svg viewBox="0 0 800 50" class="w-full max-w-4xl h-auto drop-shadow" fill="none">
          ${[60, 170, 285, 400, 515, 630, 740].map((cx, i) => `
            <path d="M${cx - 57},0 Q${cx},22 ${cx + 57},0" stroke="#F472B6" stroke-width="2" />
            <circle cx="${cx}" cy="${i % 2 === 0 ? 22 : 18}" r="7" fill="${['#FB7185', '#FBBF24', '#38BDF8', '#A78BFA'][i % 4]}" />
            <circle cx="${cx - 2}" cy="${i % 2 === 0 ? 20 : 16}" r="2" fill="#FFFFFF" opacity="0.7" />
          `).join('')}
        </svg>
      </div>`,
    watercolor: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none flex flex-col items-center">
        <svg viewBox="0 0 800 48" class="w-full max-w-4xl h-auto opacity-85" fill="none">
          <path d="M0,10 Q200,28 400,10 Q600,28 800,10" stroke="#A7C4A0" stroke-width="2" />
          ${[75, 200, 325, 475, 600, 725].map((cx, i) => `
            <ellipse cx="${cx}" cy="20" rx="10" ry="6" fill="${i % 2 === 0 ? '#F9A8D4' : '#FDE68A'}" fill-opacity="0.75" />
          `).join('')}
        </svg>
      </div>`,
    newspaper: `
      <div class="fixed top-0 inset-x-0 z-30 pointer-events-none select-none">
        <div class="w-full h-1.5" style="background-color: var(--pal-heading);"></div>
        <div class="w-full h-0.5 mt-0.5" style="background-color: var(--pal-heading); opacity: 0.7;"></div>
      </div>`,
  };

  return garlands[family] || garlands.zardozi;
}

/**
 * Generates left & right side hanging obstacles / corner motifs specific to each theme.
 * Compact fixed-edge framing so mobile 390px cards stay readable without overlap.
 */
export function renderThemeSideHtml(templateId = 'caricature') {
  const { family } = getThemeDesign(templateId);
  if (family === 'caricature') return '';

  const sideSets = {
    zardozi: { leftIcon: '🪷', rightIcon: '✨', midLeft: '🏺', midRight: '🦚', stroke: '#D4AF37', fill: '#B91C1C', label: 'Zari' },
    pichwai: { leftIcon: '🪷', rightIcon: '🔔', midLeft: '🐄', midRight: '🪷', stroke: '#D4AF37', fill: '#F472B6', label: 'Lotus' },
    mela: { leftIcon: '🎡', rightIcon: '🏮', midLeft: '🌼', midRight: '🪅', stroke: '#F59E0B', fill: '#EF4444', label: 'Mela' },
    rajwada: { leftIcon: '🦚', rightIcon: '🪔', midLeft: '🏰', midRight: '♛', stroke: '#D4AF37', fill: '#991B1B', label: 'Rajwada' },
    nikah: { leftIcon: '🏮', rightIcon: '🌙', midLeft: '🕌', midRight: '✨', stroke: '#D4AF37', fill: '#059669', label: 'Noor' },
    aladdin: { leftIcon: '🪔', rightIcon: '🌙', midLeft: '✨', midRight: '🦚', stroke: '#FBBF24', fill: '#4F46E5', label: 'Magic' },
    rangla: { leftIcon: '🥁', rightIcon: '🔔', midLeft: '🌺', midRight: '💃', stroke: '#F59E0B', fill: '#DB2777', label: 'Viah' },
    truck: { leftIcon: '🧿', rightIcon: '🍋', midLeft: '🌸', midRight: '🚛', stroke: '#000000', fill: '#EC4899', label: 'Desi' },
    bougain: { leftIcon: '🌺', rightIcon: '🦋', midLeft: '🌿', midRight: '🌸', stroke: '#4D7C0F', fill: '#DB2777', label: 'Flora' },
    papercraft: { leftIcon: '🕊️', rightIcon: '🌸', midLeft: '✿', midRight: '🍃', stroke: '#C5A880', fill: '#F9A8D4', label: 'Craft' },
    ballroom: { leftIcon: '🥂', rightIcon: '✨', midLeft: '💎', midRight: '🎻', stroke: '#D4AF37', fill: '#FDE68A', label: 'Gala' },
    marble: { leftIcon: '🏛️', rightIcon: '✿', midLeft: '🌿', midRight: '❖', stroke: '#C5A880', fill: '#10B981', label: 'Marble' },
    peaks: { leftIcon: '🌲', rightIcon: '🦅', midLeft: '🏔️', midRight: '❄️', stroke: '#64748B', fill: '#93C5FD', label: 'Peaks' },
    coastal: { leftIcon: '🌴', rightIcon: '🐚', midLeft: '🌊', midRight: '🌺', stroke: '#0284C7', fill: '#38BDF8', label: 'Coast' },
    kalyanam: { leftIcon: '🪔', rightIcon: '🔔', midLeft: '🪷', midRight: '🥥', stroke: '#D4AF37', fill: '#15803D', label: 'Temple' },
    storybook: { leftIcon: '📖', rightIcon: '✒️', midLeft: '🌟', midRight: '🕯️', stroke: '#B08968', fill: '#FDE047', label: 'Story' },
    plush: { leftIcon: '☁️', rightIcon: '🎈', midLeft: '💖', midRight: '⭐', stroke: '#F472B6', fill: '#FB7185', label: '3D' },
    watercolor: { leftIcon: '🎨', rightIcon: '🖌️', midLeft: '✿', midRight: '🌿', stroke: '#84A98C', fill: '#F472B6', label: 'Art' },
    newspaper: { leftIcon: '❧', rightIcon: '❦', midLeft: '★', midRight: '📰', stroke: '#1E1E1E', fill: '#1E1E1E', label: 'Press' },
  };

  const s = sideSets[family] || sideSets.zardozi;

  return `
    <div class="fixed inset-0 pointer-events-none z-10 overflow-hidden select-none" aria-hidden="true">
      <!-- Left Hanging Side String & Mid-Page Obstacles -->
      <div class="parallax-garland absolute top-14 left-0.5 sm:left-2 flex flex-col items-center gap-7 opacity-75">
        <div class="w-px h-10" style="background: linear-gradient(to bottom, ${s.stroke}, transparent);"></div>
        <span class="text-base sm:text-xl drop-shadow animate-sway">${s.leftIcon}</span>
        <div class="w-2.5 h-2.5 rotate-45 border" style="border-color: ${s.stroke}; background: ${s.fill}; opacity: 0.65;"></div>
        <span class="text-sm sm:text-lg opacity-80 animate-float-gentle">${s.midLeft}</span>
        <div class="w-px h-14" style="background: linear-gradient(to bottom, ${s.stroke}, transparent);"></div>
        <span class="text-base sm:text-xl drop-shadow opacity-70 animate-sway">${s.leftIcon}</span>
      </div>

      <!-- Right Hanging Side String & Mid-Page Obstacles -->
      <div class="parallax-garland absolute top-14 right-0.5 sm:right-2 flex flex-col items-center gap-7 opacity-75">
        <div class="w-px h-10" style="background: linear-gradient(to bottom, ${s.stroke}, transparent);"></div>
        <span class="text-base sm:text-xl drop-shadow animate-sway" style="animation-delay: 0.4s;">${s.rightIcon}</span>
        <div class="w-2.5 h-2.5 rotate-45 border" style="border-color: ${s.stroke}; background: ${s.fill}; opacity: 0.65;"></div>
        <span class="text-sm sm:text-lg opacity-80 animate-float-gentle" style="animation-delay: 0.8s;">${s.midRight}</span>
        <div class="w-px h-14" style="background: linear-gradient(to bottom, ${s.stroke}, transparent);"></div>
        <span class="text-base sm:text-xl drop-shadow opacity-70 animate-sway" style="animation-delay: 0.6s;">${s.rightIcon}</span>
      </div>

      <!-- Large Faint Side Corner Watermark Medallions -->
      <div class="parallax-motif hidden sm:block absolute top-[44%] -left-10 opacity-15" data-speed="0.06" data-rot="-12">
        <svg viewBox="0 0 100 100" width="96" height="96" fill="none">
          <circle cx="50" cy="50" r="42" stroke="${s.stroke}" stroke-width="2" stroke-dasharray="5,4" />
          <circle cx="50" cy="50" r="28" stroke="${s.stroke}" stroke-width="1.5" />
          <polygon points="50,14 60,40 86,50 60,60 50,86 40,60 14,50 40,40" fill="${s.fill}" fill-opacity="0.35" stroke="${s.stroke}" stroke-width="1.2" />
        </svg>
      </div>
      <div class="parallax-motif hidden sm:block absolute top-[68%] -right-10 opacity-15" data-speed="-0.05" data-rot="15">
        <svg viewBox="0 0 100 100" width="96" height="96" fill="none">
          <circle cx="50" cy="50" r="42" stroke="${s.stroke}" stroke-width="2" stroke-dasharray="5,4" />
          <circle cx="50" cy="50" r="28" stroke="${s.stroke}" stroke-width="1.5" />
          <polygon points="50,14 60,40 86,50 60,60 50,86 40,60 14,50 40,40" fill="${s.fill}" fill-opacity="0.35" stroke="${s.stroke}" stroke-width="1.2" />
        </svg>
      </div>
    </div>
  `;
}

/**
 * Generates theme-authentic divider between events.
 */
export function renderThemeDividerHtml(templateId = 'caricature') {
  const { family } = getThemeDesign(templateId);
  if (family === 'caricature') {
    return `
      <div class="w-full flex flex-col items-center my-6 overflow-hidden pointer-events-none select-none scroll-reveal reveal-scooter">
        <div class="relative w-72 h-16 flex items-center justify-center">
          <svg viewBox="0 0 280 60" class="w-full h-full" fill="none">
            <path d="M15,48 Q140,-8 265,48" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="6,5" class="animate-road-dash" />
          </svg>
          <div class="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            <span class="text-2xl drop-shadow-md transform -rotate-3">🛵</span>
            <span class="text-xs inv-muted">💨</span>
          </div>
        </div>
      </div>`;
  }

  const badgeMap = {
    zardozi: ['🪡', '✦', '✨'],
    pichwai: ['🌿', '🪷', '🌿'],
    mela: ['🌼', '🎡', '🌼'],
    rajwada: ['♛', '🦚', '♛'],
    nikah: ['☽', '✦', '☾'],
    aladdin: ['✨', '🪔', '🌙'],
    rangla: ['🥁', '🔔', '🥁'],
    truck: ['🚛', '🧿', '🌺'],
    bougain: ['🌸', '🦋', '🌿'],
    papercraft: ['❀', '🕊️', '❀'],
    ballroom: ['❖', '🥂', '❖'],
    marble: ['✿', '🏛️', '✿'],
    peaks: ['⛰️', '☀️', '⛰️'],
    coastal: ['🐚', '🌊', '🐚'],
    kalyanam: ['🪔', '🪷', '🪔'],
    storybook: ['📖', '✨', '✒️'],
    plush: ['☁️', '💖', '☁️'],
    watercolor: ['🎨', '✿', '🖌️'],
    newspaper: ['❦', '★', '❧'],
  };

  const [l, c, r] = badgeMap[family] || ['✦', '❖', '✦'];
  return `
    <div class="w-full flex items-center justify-center gap-3 my-6 pointer-events-none select-none px-6 scroll-reveal">
      <div class="h-px flex-1" style="background: linear-gradient(90deg, transparent, var(--pal-rule)); opacity: 0.6;"></div>
      <div class="flex items-center gap-2 px-3 py-1 rounded-full border shadow-2xs" style="background: var(--pal-card-surface); border-color: var(--pal-card-border);">
        <span class="text-xs opacity-85">${l}</span>
        <span class="text-base drop-shadow-xs">${c}</span>
        <span class="text-xs opacity-85">${r}</span>
      </div>
      <div class="h-px flex-1" style="background: linear-gradient(270deg, transparent, var(--pal-rule)); opacity: 0.6;"></div>
    </div>`;
}

/**
 * Shared CSS rules injected into both src/index.css and standaloneHtml so fonts, dark/light contrast,
 * and distinct per-theme card architectures look identical everywhere.
 */
export const SHARED_INVITATION_CSS = `
  .inv-theme-root {
    font-family: var(--font-body, 'Cormorant Garamond', Georgia, serif);
    background-color: var(--pal-bg, #FAF7F2);
    color: var(--pal-text, #2B1E17);
  }
  .inv-theme-root h1,
  .inv-theme-root h2,
  .inv-theme-root h3,
  .inv-theme-root h4,
  .inv-theme-root .font-royal,
  .inv-theme-root .inv-heading {
    font-family: var(--font-heading, 'Cinzel', Georgia, serif) !important;
    color: var(--pal-heading);
  }
  .inv-theme-root .font-sans,
  .inv-theme-root .font-serif:not(h1):not(h2):not(h3):not(h4) {
    font-family: var(--font-body, 'Cormorant Garamond', Georgia, serif) !important;
  }
  .inv-theme-root .font-cursive,
  .inv-theme-root .font-script,
  .inv-theme-root .inv-script {
    font-family: var(--font-script, 'Great Vibes', cursive) !important;
  }
  .inv-theme-root .inv-eyebrow {
    font-family: var(--font-script, 'Great Vibes', cursive) !important;
    color: var(--pal-eyebrow) !important;
  }
  .inv-theme-root .inv-text { color: var(--pal-text) !important; }
  .inv-theme-root .inv-muted { color: var(--pal-muted) !important; }
  .inv-theme-root .inv-subtle { color: var(--pal-subtle) !important; }
  .inv-theme-root .inv-accent { color: var(--pal-accent) !important; }
  .inv-theme-root .inv-rule {
    background: linear-gradient(90deg, transparent, var(--pal-rule), transparent);
  }
  .inv-theme-root .inv-pill {
    background-color: var(--pal-pill-bg);
    color: var(--pal-pill-text);
    border-color: var(--pal-pill-border);
  }
  .inv-theme-root .inv-btn-primary {
    background-color: var(--pal-btn-bg) !important;
    color: var(--pal-btn-text) !important;
  }
  .inv-theme-root .inv-btn-secondary {
    background-color: var(--pal-btn-sec-bg) !important;
    color: var(--pal-btn-sec-text) !important;
    border: 1px solid var(--pal-card-border) !important;
  }
  .inv-theme-root .inv-surface {
    background-color: var(--pal-card-surface);
    color: var(--pal-text);
    border-color: var(--pal-card-border);
  }
  .inv-theme-root .inv-modal {
    background-color: var(--pal-modal-bg);
    color: var(--pal-text);
    border-color: var(--pal-card-border);
  }
  .inv-theme-root .inv-sticky {
    background-color: var(--pal-sticky-bg);
    border-color: var(--pal-sticky-border);
    color: var(--pal-sticky-text);
  }
  .inv-theme-root .inv-hero-img-wrap {
    background-color: var(--pal-hero-img-bg);
  }

  /* Ensure residual utility text/bg classes stay high-contrast when Dark palette is active */
  .inv-theme-root.inv-dark [class*="text-stone-9"],
  .inv-theme-root.inv-dark [class*="text-stone-8"],
  .inv-theme-root.inv-dark [class*="text-[#2B1E17]"] {
    color: var(--pal-heading) !important;
  }
  .inv-theme-root.inv-dark [class*="text-stone-7"],
  .inv-theme-root.inv-dark [class*="text-stone-6"],
  .inv-theme-root.inv-dark [class*="text-stone-5"],
  .inv-theme-root.inv-dark [class*="text-stone-4"] {
    color: var(--pal-muted) !important;
  }
  .inv-theme-root.inv-dark .border-stone-100,
  .inv-theme-root.inv-dark .border-stone-200 {
    border-color: var(--pal-card-border) !important;
  }

  /* Base Glass Card Surface (~20% frosted blur) */
  .inv-theme-root .inv-card,
  .inv-theme-root .inv-hero-card,
  .inv-theme-root .inv-arch-card,
  .inv-theme-root .inv-polaroid {
    background-color: var(--pal-card-bg);
    border: 2px solid var(--pal-card-border);
    color: var(--pal-text);
    -webkit-backdrop-filter: blur(2.5px);
    backdrop-filter: blur(2.5px);
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  }

  /* DISTINCT CARD ARCHITECTURES PER SELECTED THEME */
  .theme-card-caricature .inv-hero-card { border-radius: 60px 60px 24px 24px; border-width: 3px; }
  .theme-card-caricature .inv-arch-card { border-radius: 44px 44px 16px 16px; }
  .theme-card-caricature .inv-card { border-radius: 16px; }

  .theme-card-zari .inv-hero-card,
  .theme-card-zari .inv-arch-card {
    border-radius: 4px;
    outline: 1.5px dashed var(--pal-accent);
    outline-offset: -7px;
    box-shadow: 0 14px 36px -8px rgba(0,0,0,0.32), inset 0 0 0 1px var(--pal-card-border);
  }
  .theme-card-zari .inv-card {
    border-radius: 6px;
    outline: 1px dashed var(--pal-accent);
    outline-offset: -5px;
  }
  .theme-card-zari .inv-polaroid { border-radius: 2px; border-width: 2.5px; }

  .theme-card-pichwai .inv-hero-card,
  .theme-card-pichwai .inv-arch-card {
    border-radius: 200px 200px 18px 18px;
    border-width: 2.5px;
    box-shadow: 0 18px 40px -10px rgba(0,0,0,0.4), inset 0 0 22px rgba(212,175,55,0.12);
  }
  .theme-card-pichwai .inv-card { border-radius: 22px 22px 12px 12px; }

  .theme-card-mela .inv-hero-card,
  .theme-card-mela .inv-card {
    border-radius: 20px;
    border-style: dashed;
    border-width: 2.5px;
    box-shadow: 0 10px 0 -4px var(--pal-pill-bg), 0 16px 28px -6px rgba(0,0,0,0.18);
  }
  .theme-card-mela .inv-arch-card { border-radius: 90px 90px 16px 16px; border-style: dashed; border-width: 2.5px; }

  .theme-card-rajwada .inv-hero-card,
  .theme-card-rajwada .inv-arch-card {
    border-radius: 110px 110px 6px 6px;
    border-width: 3px;
    box-shadow: inset 0 0 0 4px var(--pal-card-surface), 0 18px 34px -8px rgba(0,0,0,0.28);
  }
  .theme-card-rajwada .inv-card {
    border-radius: 12px 12px 4px 4px;
    border-top-width: 5px;
    box-shadow: inset 0 0 0 2px rgba(212,175,55,0.18), 0 10px 24px -6px rgba(0,0,0,0.2);
  }

  .theme-card-mughal .inv-hero-card,
  .theme-card-mughal .inv-arch-card {
    border-radius: 50% 50% 10px 10px / 22% 22% 10px 10px;
    border-width: 2.5px;
    outline: 1px solid var(--pal-card-border);
    outline-offset: -6px;
  }
  .theme-card-mughal .inv-card {
    border-radius: 26px 26px 8px 8px;
    outline: 1px solid var(--pal-card-border);
    outline-offset: -5px;
  }

  .theme-card-phulkari .inv-hero-card,
  .theme-card-phulkari .inv-card,
  .theme-card-phulkari .inv-arch-card {
    border-radius: 18px;
    border-style: double;
    border-width: 4px;
    box-shadow: 4px 4px 0 var(--pal-card-border), 0 14px 28px -8px rgba(0,0,0,0.2);
  }

  .theme-card-truck .inv-hero-card,
  .theme-card-truck .inv-card,
  .theme-card-truck .inv-arch-card,
  .theme-card-truck .inv-polaroid {
    border-radius: 6px;
    border-width: 2.5px;
    border-color: var(--pal-heading);
    box-shadow: 5px 5px 0 var(--pal-accent);
  }

  .theme-card-floral .inv-hero-card,
  .theme-card-floral .inv-card {
    border-radius: 32px;
    border-width: 1.5px;
    box-shadow: 0 12px 32px -8px rgba(0,0,0,0.16), inset 0 0 0 3px rgba(255,255,255,0.16);
  }
  .theme-card-floral .inv-arch-card { border-radius: 120px 120px 30px 30px; border-width: 1.5px; }

  .theme-card-papercraft .inv-hero-card,
  .theme-card-papercraft .inv-card {
    border-radius: 14px;
    border-width: 1.5px;
    box-shadow: 0 6px 0 -2px var(--pal-card-border), 0 16px 28px -6px rgba(0,0,0,0.14);
  }
  .theme-card-papercraft .inv-arch-card { border-radius: 72px 72px 14px 14px; }

  .theme-card-deco .inv-hero-card,
  .theme-card-deco .inv-card,
  .theme-card-deco .inv-arch-card,
  .theme-card-deco .inv-polaroid {
    border-radius: 0px;
    border-width: 2px;
    outline: 1px solid var(--pal-accent);
    outline-offset: -6px;
    box-shadow: 0 16px 36px -10px rgba(0,0,0,0.3);
  }

  .theme-card-marble .inv-hero-card,
  .theme-card-marble .inv-card {
    border-radius: 16px;
    border-width: 1.5px;
    outline: 1px solid var(--pal-card-border);
    outline-offset: -5px;
  }
  .theme-card-marble .inv-arch-card { border-radius: 140px 140px 10px 10px; }

  .theme-card-peaks .inv-hero-card,
  .theme-card-peaks .inv-card {
    border-radius: 12px;
    border-style: dashed;
    border-width: 1.5px;
    outline: 2px solid var(--pal-card-surface);
    outline-offset: 2px;
  }

  .theme-card-coastal .inv-hero-card,
  .theme-card-coastal .inv-arch-card {
    border-radius: 140px 140px 28px 28px;
    border-width: 1.5px;
  }
  .theme-card-coastal .inv-card { border-radius: 26px; border-width: 1.5px; }

  .theme-card-temple .inv-hero-card,
  .theme-card-temple .inv-arch-card {
    border-radius: 28px 28px 6px 6px;
    border-width: 3px;
    border-top-width: 6px;
    outline: 1.5px solid var(--pal-accent);
    outline-offset: -6px;
  }
  .theme-card-temple .inv-card {
    border-radius: 10px;
    border-top-width: 4px;
    outline: 1px solid var(--pal-card-border);
    outline-offset: -4px;
  }

  .theme-card-folio .inv-hero-card,
  .theme-card-folio .inv-card {
    border-radius: 8px 20px 20px 8px;
    border-left-width: 6px;
    border-width: 2px;
  }
  .theme-card-folio .inv-arch-card { border-radius: 30px 30px 12px 12px; }

  .theme-card-plush .inv-hero-card,
  .theme-card-plush .inv-card,
  .theme-card-plush .inv-arch-card {
    border-radius: 32px;
    border-width: 2.5px;
    box-shadow: 0 10px 26px -6px rgba(0,0,0,0.2), inset 0 2px 6px rgba(255,255,255,0.45);
  }

  .theme-card-deckle .inv-hero-card,
  .theme-card-deckle .inv-card {
    border-radius: 18px 6px 20px 8px;
    border-width: 1.5px;
    box-shadow: 0 10px 24px -6px rgba(0,0,0,0.14);
  }

  .theme-card-press .inv-hero-card,
  .theme-card-press .inv-card,
  .theme-card-press .inv-arch-card,
  .theme-card-press .inv-polaroid {
    border-radius: 0px;
    border-style: double;
    border-width: 4px;
    border-color: var(--pal-heading);
    box-shadow: none;
  }
`;
