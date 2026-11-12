import { DEFAULT_INVITATION_DATA, OCCASIONS } from '../data/presets';
import { NON_WEDDING_OCCASION_IDS, createOccasionClientTemplate } from '../data/occasionStudios';

const ACTIVE_SLUG_KEY = 'wishlys_active_client_slug';
const OCCASION_ACTIVE_SLUG_PREFIX = 'wishlys_active_client_slug_';
const REGISTRY_KEY = 'wishlys_clients_registry';
const LEGACY_SAVED_KEY = 'wishlys_free_saved_data';
const PUBLISHED_PREFIX = 'wishlys_published_data_';

// Eagerly bundle any saved client JSONs from src/data/clients/*.json so deployed builds also preload saved clients
const BUNDLED_CLIENT_MODULES = import.meta.glob('../data/clients/*.json', { eager: true });

export function computeCoupleSlug(hosts, customSlug = '') {
  if (customSlug && typeof customSlug === 'string' && customSlug.trim()) {
    const clean = customSlug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    if (clean) return clean;
  }
  const brideStr = (hosts?.bride || 'bride')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const groomStr = (hosts?.groom || 'groom')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${brideStr || 'bride'}-and-${groomStr || 'groom'}`;
}

export function cloneClientData(data) {
  return JSON.parse(JSON.stringify(data));
}

export function mergeClientWithDefaults(raw) {
  if (!raw || typeof raw !== 'object') {
    return cloneClientData(DEFAULT_INVITATION_DATA);
  }

  const isCustomOccasion = Boolean(raw?.occasion && NON_WEDDING_OCCASION_IDS.includes(raw.occasion));
  const base = cloneClientData(isCustomOccasion ? createOccasionClientTemplate(raw.occasion, raw.birthdayStyle) : DEFAULT_INVITATION_DATA);
  const normalizedText = JSON.stringify(raw)
    .replaceAll('"/images/', '"./images/')
    .replaceAll('"/audio/', '"./audio/');
  const src = JSON.parse(normalizedText);

  const merged = {
    ...base,
    ...src,
    typography: { ...base.typography, ...(src.typography || {}) },
    atmosphere: { ...base.atmosphere, ...(src.atmosphere || { style: src.effect || base.atmosphere.style, intensity: 'medium' }) },
    monogram: { ...base.monogram, ...(src.monogram || {}) },
    photos: { ...base.photos, ...(src.photos || {}) },
    hosts: { ...base.hosts, ...(src.hosts || {}) },
    rsvp: { ...base.rsvp, ...(src.rsvp || {}) },
    ...(isCustomOccasion ? { rsvpConfig: { ...(base.rsvpConfig || {}), ...(src.rsvpConfig || {}) } } : {}),
    events: Array.isArray(src.events) && src.events.length > 0 ? src.events : base.events,
    gallery: isCustomOccasion ? (Array.isArray(src.gallery) ? src.gallery : base.gallery) : (Array.isArray(src.gallery) && !(src.gallery[0]?.url && src.gallery[0].url.includes('unsplash')) ? src.gallery : base.gallery),
    travel: Array.isArray(src.travel) ? src.travel : base.travel,
    customSections: Array.isArray(src.customSections) ? src.customSections : base.customSections,
  };

  if (!merged.monogram?.initials && (merged.hosts?.bride || merged.hosts?.groom)) {
    const bI = (merged.hosts?.bride || 'B').trim()[0]?.toUpperCase() || 'B';
    const gI = (merged.hosts?.groom || 'G').trim()[0]?.toUpperCase() || 'G';
    merged.monogram.initials = `${bI} & ${gI}`;
  }
  if (!isCustomOccasion && (!merged.photos.cover || /caricature\.webp|scooter_couple\.webp|zardozi|truck|04-pheras\.webp/.test(merged.photos.cover))) {
    merged.photos.cover = base.photos.cover;
  }
  if (!isCustomOccasion && (!merged.photos.bride || merged.photos.bride.includes('unsplash'))) {
    merged.photos.bride = base.photos.bride;
  }
  if (!isCustomOccasion && (!merged.photos.groom || merged.photos.groom.includes('unsplash'))) {
    merged.photos.groom = base.photos.groom;
  }
  return merged;
}

function getBundledClientsMap() {
  const map = {};
  for (const [pathKey, mod] of Object.entries(BUNDLED_CLIENT_MODULES)) {
    const fileMatch = pathKey.match(/\/([^/]+)\.json$/);
    if (!fileMatch) continue;
    const slug = fileMatch[1];
    const raw = mod?.default || mod;
    if (raw && typeof raw === 'object') {
      map[slug] = raw;
    }
  }
  return map;
}

function readRegistry() {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeRegistry(registry) {
  try {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
  } catch (e) {
    console.warn('Could not save clients registry:', e);
  }
}

function buildMetaFromData(slug, data, existing = {}, extraMeta = {}) {
  return {
    slug,
    bride: data?.hosts?.bride || existing.bride || 'Bride',
    groom: data?.hosts?.groom || existing.groom || 'Groom',
    occasion: data?.occasion || existing.occasion || 'wedding',
    date: data?.hosts?.date || existing.date || '',
    city: data?.hosts?.city || existing.city || '',
    template: data?.template || existing.template || DEFAULT_INVITATION_DATA.template,
    palette: data?.palette || existing.palette || DEFAULT_INVITATION_DATA.palette,
    revealStyle: data?.revealStyle || existing.revealStyle || DEFAULT_INVITATION_DATA.revealStyle,
    publishedUrl: extraMeta.publishedUrl ?? existing.publishedUrl ?? null,
    updatedAt: new Date().toISOString(),
  };
}

// Lightweight IndexedDB fallback so large multi-client media never fails localStorage quota
const IDB_NAME = 'wishlys_clients_db';
const IDB_STORE = 'clients';

function openClientsIdb() {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'slug' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function saveClientToIdb(slug, data) {
  const db = await openClientsIdb();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put({ slug, data, updatedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

export async function loadClientFromIdb(slug) {
  const db = await openClientsIdb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(slug);
      req.onsuccess = () => resolve(req.result?.data ? mergeClientWithDefaults(req.result.data) : null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export function getActiveClientSlug(occasionId = 'wedding') {
  try {
    const key = occasionId && occasionId !== 'wedding' ? `${OCCASION_ACTIVE_SLUG_PREFIX}${occasionId}` : ACTIVE_SLUG_KEY;
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

export function setActiveClientSlug(slug, occasionId = 'wedding') {
  try {
    const key = occasionId && occasionId !== 'wedding' ? `${OCCASION_ACTIVE_SLUG_PREFIX}${occasionId}` : ACTIVE_SLUG_KEY;
    if (slug) localStorage.setItem(key, slug);
    else localStorage.removeItem(key);
  } catch {
    // ignore storage restrictions
  }
}

export function listSavedClients() {
  const registry = readRegistry();
  const bundled = getBundledClientsMap();
  const merged = { ...registry };

  for (const [slug, raw] of Object.entries(bundled)) {
    if (!merged[slug]) {
      merged[slug] = {
        ...buildMetaFromData(slug, raw),
        updatedAt: '2026-01-01T00:00:00.000Z',
        isBundledOnly: true,
      };
    }
  }

  return Object.values(merged).sort((a, b) => {
    return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
  });
}

export function getSavedClient(slug) {
  if (!slug) return null;
  try {
    const raw = localStorage.getItem(PUBLISHED_PREFIX + slug);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return mergeClientWithDefaults(parsed);
      }
    }
  } catch {
    // fallback below
  }

  const bundled = getBundledClientsMap();
  if (bundled[slug]) {
    return mergeClientWithDefaults(bundled[slug]);
  }
  return null;
}

export async function getSavedClientAsync(slug) {
  const syncData = getSavedClient(slug);
  if (syncData) return syncData;

  const idbData = await loadClientFromIdb(slug);
  if (idbData) return idbData;

  if (typeof window !== 'undefined' && !window.location.hostname.includes('github.io')) {
    try {
      const res = await fetch(`/api/clients?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.client?.data) {
          return mergeClientWithDefaults(json.client.data);
        }
      }
    } catch {
      // silent in static builds
    }
  }
  return null;
}

export function saveClientLocal(data, extraMeta = {}) {
  const slug = computeCoupleSlug(data?.hosts, data?.customSlug);
  const registry = readRegistry();
  const existing = registry[slug] || {};
  const meta = buildMetaFromData(slug, data, existing, extraMeta);

  const json = JSON.stringify(data);
  try {
    localStorage.setItem(PUBLISHED_PREFIX + slug, json);
  } catch (e) {
    console.warn('localStorage client quota warning:', e);
  }

  try {
    if (!data?.occasion || data.occasion === 'wedding') localStorage.setItem(LEGACY_SAVED_KEY, json);
  } catch {
    // Ignore duplicate quota overflow cleanly; client data stays in PUBLISHED_PREFIX + IDB
  }

  if (extraMeta.setActive !== false) {
    setActiveClientSlug(slug, data?.occasion || 'wedding');
  }

  registry[slug] = meta;
  writeRegistry(registry);

  // Mirror to IndexedDB asynchronously for unlimited offline persistence
  saveClientToIdb(slug, data).catch(() => {});

  return { slug, meta };
}

export async function saveClientToServer(slug, data) {
  if (typeof window === 'undefined' || !import.meta.env.DEV || window.location.hostname.includes('github.io')) {
    return false;
  }
  try {
    const res = await fetch('/api/save-client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, data }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function saveClientFull(data, extraMeta = {}) {
  const result = saveClientLocal(data, extraMeta);
  const serverPromise = saveClientToServer(result.slug, data);
  if (extraMeta.awaitServer) {
    await serverPromise;
  } else {
    serverPromise.catch(() => {});
  }
  return result;
}

export function removeSavedClient(slug) {
  if (!slug) return;
  try {
    localStorage.removeItem(PUBLISHED_PREFIX + slug);
    const registry = readRegistry();
    delete registry[slug];
    writeRegistry(registry);
  } catch {
    // ignore
  }
}

const OCCASION_STARTERS = {
  engagement: {
    hosts: {
      bride: 'Ananya',
      groom: 'Vikram',
      date: '2026-11-18',
      city: 'Jaipur',
      storyTitle: 'We Said Yes',
      storyText: 'Surrounded by candlelight and roses, a quiet promise turned into our favourite celebration.',
    },
    events: [
      { id: 'ring-ceremony', name: 'Ring Ceremony & High Tea', date: '2026-11-18', time: '5:30 PM onwards', venue: 'Rambagh Lawns, Jaipur', attire: 'Indo-Western Pastel', description: 'Join us for the exchange of rings, champagne toasts, and live acoustic sitar.' },
      { id: 'engagement-soiree', name: 'Evening Soiree & Dinner', date: '2026-11-18', time: '8:30 PM onwards', venue: 'Peacock Courtyard, Jaipur', attire: 'Evening Formals', description: 'Music, dancing under fairy lights, and a curated royal dinner.' },
    ],
  },
  birthday: {
    hosts: {
      bride: 'Aarav',
      groom: 'Kapoor Family',
      date: '2026-10-24',
      city: 'Mumbai',
      storyTitle: 'Chapter Thirty',
      storyText: 'Three decades of laughter, midnight drives, and unforgettable friendships deserve a celebration.',
    },
    events: [
      { id: 'birthday-soiree', name: 'Sunset Cocktails & Toast', date: '2026-10-24', time: '7:30 PM onwards', venue: 'The Terrace Atelier, Mumbai', attire: 'Cocktail Chic', description: 'Raising a glass to thirty golden years with good music and warm company.' },
    ],
  },
  housewarming: {
    hosts: {
      bride: 'Meera',
      groom: 'Rohan',
      date: '2026-12-05',
      city: 'Bengaluru',
      storyTitle: 'Gruha Pravesh',
      storyText: 'With gratitude and joy, we welcome our loved ones as we light the first diya in our new home.',
    },
    events: [
      { id: 'griha-puja', name: 'Gruha Pravesh Puja', date: '2026-12-05', time: '10:00 AM', venue: 'Villa 14, Palm Meadows, Bengaluru', attire: 'Traditional Silk & Kurta', description: 'Sacred morning prayers, marigold garlands, and traditional festive lunch.' },
    ],
  },
  'house-party': {
    hosts: {
      bride: 'Rhea',
      groom: 'Kabir',
      date: '2026-11-28',
      city: 'New Delhi',
      storyTitle: 'The Autumn Soiree',
      storyText: 'Good vinyls, candlelit tables, and long overdue conversations with our favourite people.',
    },
    events: [
      { id: 'autumn-soiree', name: 'Rooftop Supper & Music', date: '2026-11-28', time: '8:00 PM till late', venue: 'The Conservatory Residence, New Delhi', attire: 'Smart Evening Casual', description: 'Craft mocktails, wood-fired supper, and late-night vinyl sessions.' },
    ],
  },
  'baby-shower': {
    hosts: {
      bride: 'Neha',
      groom: 'Arjun',
      date: '2026-12-12',
      city: 'Pune',
      storyTitle: 'Godh Bharai',
      storyText: 'Tiny feet are on their way! Come bless the parents-to-be with love, laughter, and sweet wishes.',
    },
    events: [
      { id: 'godh-bharai', name: 'Blessings & High Tea', date: '2026-12-12', time: '4:00 PM onwards', venue: 'Banyan Courtyard, Pune', attire: 'Pastels & Florals', description: 'Traditional blessings, fun games, and a botanical garden high tea.' },
    ],
  },
  annaprashan: {
    hosts: {
      bride: 'Baby Ved',
      groom: 'Sood Family',
      date: '2026-12-19',
      city: 'Kolkata',
      storyTitle: 'First Rice Ceremony',
      storyText: 'With folded hands and full hearts, join us for Baby Ved’s auspicious Mukhe Bhaat ceremony.',
    },
    events: [
      { id: 'mukhe-bhaat', name: 'Annaprashan & Blessing Feast', date: '2026-12-19', time: '11:30 AM onwards', venue: 'Heritage Verandah, Kolkata', attire: 'Festive Ethnic', description: 'Morning blessings for our little one followed by an heirloom Bengali lunch.' },
    ],
  },
  'holy-communion': {
    hosts: {
      bride: 'Chloe',
      groom: 'D’Souza Family',
      date: '2026-12-20',
      city: 'Goa',
      storyTitle: 'First Holy Communion',
      storyText: 'A sacred milestone in faith, grace, and thanksgiving celebrated with family and close friends.',
    },
    events: [
      { id: 'communion-mass', name: 'Holy Communion Mass & Brunch', date: '2026-12-20', time: '9:30 AM onwards', venue: 'Our Lady of Grace & Courtyard, Goa', attire: 'Sunday Whites & Pastels', description: 'Morning Mass followed by family brunch and celebratory cake.' },
    ],
  },
};

export function createOccasionStarterData(occasionId = 'wedding') {
  if (NON_WEDDING_OCCASION_IDS.includes(occasionId)) {
    return cloneClientData(createOccasionClientTemplate(occasionId));
  }
  const base = cloneClientData(DEFAULT_INVITATION_DATA);

  if (!occasionId || occasionId === 'wedding') {
    return base;
  }
  const occ = OCCASIONS.find(o => o.id === occasionId);
  const starter = OCCASION_STARTERS[occasionId] || {};
  return mergeClientWithDefaults({
    ...base,
    occasion: occasionId,
    template: occ?.defaultTemplate || base.template,
    revealStyle: occ?.defaultReveal || base.revealStyle,
    hosts: {
      ...base.hosts,
      ...(starter.hosts || {}),
    },
    monogram: {
      ...base.monogram,
      initials: starter.hosts
        ? `${(starter.hosts.bride || 'A').trim()[0]?.toUpperCase() || 'A'} & ${(starter.hosts.groom || 'B').trim()[0]?.toUpperCase() || 'B'}`
        : base.monogram.initials,
    },
    events: starter.events || base.events,
  });
}

export function getInitialClientData(preferredOccasion = null) {
  try {
    if (typeof window !== 'undefined') {
      const urlSlug = new URLSearchParams(window.location.search).get('client');
      if (urlSlug) {
        const fromUrl = getSavedClient(urlSlug);
        if (fromUrl) {
          setActiveClientSlug(urlSlug, fromUrl.occasion || 'wedding');
          return fromUrl;
        }
      }
    }

    const occKey = preferredOccasion && preferredOccasion !== 'wedding' ? preferredOccasion : 'wedding';
    const activeSlug = getActiveClientSlug(occKey);
    if (activeSlug) {
      const fromActive = getSavedClient(activeSlug);
      if (fromActive && (fromActive.occasion || 'wedding') === occKey) {
        return fromActive;
      }
    }

    if (occKey !== 'wedding') {
      const savedOccClient = listSavedClients().find(c => (c.occasion || 'wedding') === occKey);
      if (savedOccClient?.slug) {
        const loaded = getSavedClient(savedOccClient.slug);
        if (loaded) return loaded;
      }
      return createOccasionStarterData(occKey);
    }

    const legacyRaw = localStorage.getItem(LEGACY_SAVED_KEY);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw);
      if (parsed && typeof parsed === 'object' && parsed.hosts && (!parsed.occasion || parsed.occasion === 'wedding')) {
        const merged = mergeClientWithDefaults(parsed);
        const slug = computeCoupleSlug(merged.hosts);
        saveClientLocal(merged, { setActive: true });
        setActiveClientSlug(slug, merged.occasion || 'wedding');
        return merged;
      }
    }

    const bundled = getBundledClientsMap();
    if (bundled['preeti-and-ashish']) {
      return mergeClientWithDefaults(bundled['preeti-and-ashish']);
    }
  } catch (e) {
    console.warn('Could not load saved client state:', e);
  }
  return cloneClientData(DEFAULT_INVITATION_DATA);
}
