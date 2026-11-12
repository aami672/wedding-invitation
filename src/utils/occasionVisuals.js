import {
  OCCASION_PALETTES,
  ENGAGEMENT_TEMPLATES,
  BIRTHDAY_COLOR_THEMES,
  BIRTHDAY_FONTS,
  HOUSEWARMING_THEMES,
  HOUSE_PARTY_THEMES,
  BABY_THEMES,
  HOLY_COMMUNION_THEMES,
  HOLY_COMMUNION_SACRAMENTS,
  OCCASION_MUSIC_TRACKS,
} from '../data/occasionStudios';

export function resolveFontFamily(fontIdOrName, fallback = '"Cormorant Garamond", serif') {
  if (!fontIdOrName) return fallback;
  const bdayMatch = BIRTHDAY_FONTS.find(
    f => f.id.toLowerCase() === fontIdOrName.toLowerCase() || f.label.toLowerCase() === fontIdOrName.toLowerCase()
  );
  if (bdayMatch) return bdayMatch.family;
  if (fontIdOrName.includes('"') || fontIdOrName.includes("'")) return fontIdOrName;
  return `"${fontIdOrName}", sans-serif`;
}

export function resolveOccasionVisuals(data = {}) {
  const occ = data?.occasion || 'engagement';
  const hosts = data?.hosts || {};

  let themeList = ENGAGEMENT_TEMPLATES;
  if (occ === 'housewarming') themeList = HOUSEWARMING_THEMES;
  else if (occ === 'house-party') themeList = HOUSE_PARTY_THEMES;
  else if (occ === 'baby-shower' || occ === 'annaprashan') themeList = BABY_THEMES;
  else if (occ === 'holy-communion') themeList = HOLY_COMMUNION_THEMES;

  const matchedTemplate = themeList.find(t => t.id === data.template) || themeList[0];

  let paletteObj = matchedTemplate;
  if (occ === 'engagement') {
    const pal = OCCASION_PALETTES.find(p => p.id === data.palette);
    paletteObj = pal || matchedTemplate;
  } else if (occ === 'birthday') {
    paletteObj = BIRTHDAY_COLOR_THEMES.find(c => c.id === data.palette) || BIRTHDAY_COLOR_THEMES[0];
  } else {
    paletteObj = themeList.find(t => t.id === (data.palette || data.template)) || matchedTemplate;
  }

  const dark = Boolean(paletteObj?.dark);
  const theme = {
    id: matchedTemplate?.id || 'classic',
    name: matchedTemplate?.name || 'Classic',
    bg: paletteObj?.bg || (dark ? '#12100E' : '#FAF6EE'),
    surface: paletteObj?.surface || (dark ? '#1C1815' : '#FFFFFF'),
    text: paletteObj?.text || (dark ? '#FAF4E8' : '#241C16'),
    muted: paletteObj?.muted || (dark ? 'rgba(250,244,232,0.72)' : 'rgba(36,28,22,0.68)'),
    accent: paletteObj?.accent || '#C5A880',
    secondary: paletteObj?.secondary || paletteObj?.accent || '#C5A880',
    dark,
  };

  let headingFont = '"Cormorant Garamond", "Montserrat", serif';
  let sectionFont = '"Montserrat", sans-serif';
  let bodyFont = '"Plus Jakarta Sans", sans-serif';

  if (occ === 'birthday') {
    headingFont = resolveFontFamily(data.nameFont, '"Bagel Fat One", "Fredoka", sans-serif');
    sectionFont = resolveFontFamily(data.sectionFont, '"Fredoka", "Montserrat", sans-serif');
  } else if (occ === 'engagement' || occ === 'holy-communion') {
    headingFont = resolveFontFamily(data.typography?.headingFont, '"Cormorant Garamond", "Montserrat", serif');
    bodyFont = resolveFontFamily(data.typography?.bodyFont, '"Plus Jakarta Sans", sans-serif');
  } else if (occ === 'housewarming' || occ === 'house-party') {
    headingFont = data.template === 'blueprint' ? '"Courier New", monospace' : '"Montserrat", sans-serif';
    sectionFont = '"Montserrat", sans-serif';
  } else {
    headingFont = '"Fredoka", "Montserrat", sans-serif';
  }

  const sacramentMeta = occ === 'holy-communion'
    ? (HOLY_COMMUNION_SACRAMENTS.find(s => s.id === (data.sacrament || 'communion')) || HOLY_COMMUNION_SACRAMENTS[0])
    : null;

  const primaryTitle = occ === 'engagement'
    ? `${hosts.bride || 'Shanaya'} & ${hosts.groom || 'Aarav'}`
    : (occ === 'housewarming' || occ === 'house-party')
      ? (hosts.householdName || `${hosts.bride || 'Riya'} & ${hosts.groom || 'Arjun'}`)
      : occ === 'annaprashan'
        ? `${hosts.bride || 'Aarav'}’s Annaprashan`
        : occ === 'baby-shower'
          ? `Baby ${hosts.bride ? `& ${hosts.bride}` : 'Shower'}`
          : occ === 'birthday'
            ? `${hosts.bride || 'Aarav'}’s Birthday`
            : `${hosts.bride || 'Aanya'}`;

  const occTracks = OCCASION_MUSIC_TRACKS[occ] || OCCASION_MUSIC_TRACKS.engagement;
  const activeTrack = occTracks.find(t => t.id === data.music) || occTracks[0];

  return {
    theme,
    matchedTemplate,
    headingFont,
    sectionFont,
    bodyFont,
    sacramentMeta,
    primaryTitle,
    activeTrack,
  };
}

export function formatReadableDate(isoOrText) {
  if (!isoOrText) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(isoOrText).trim())) {
    return isoOrText;
  }
  const d = new Date(`${isoOrText}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoOrText;
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
