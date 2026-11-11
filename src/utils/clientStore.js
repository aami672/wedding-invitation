import { DEFAULT_INVITATION_DATA } from '../data/presets';

const ACTIVE_SLUG_KEY = 'wishlys_active_client_slug';
const REGISTRY_KEY = 'wishlys_clients_registry';
const LEGACY_SAVED_KEY = 'wishlys_free_saved_data';
const PUBLISHED_PREFIX = 'wishlys_published_data_';

// Eagerly bundle any saved client JSONs from src/data/clients/*.json so deployed builds also preload saved clients
const BUNDLED_CLIENT_MODULES = import.meta.glob('../data/clients/*.json', { eager: true });

export function computeCoupleSlug(hosts) {
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
  const base = cloneClientData(DEFAULT_INVITATION_DATA);
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
    events: Array.isArray(src.events) && src.events.length > 0 ? src.events : base.events,
    gallery: Array.isArray(src.gallery) && !(src.gallery[0]?.url && src.gallery[0].url.includes('unsplash')) ? src.gallery : base.gallery,
    travel: Array.isArray(src.travel) ? src.travel : base.travel,
    customSections: Array.isArray(src.customSections) ? src.customSections : base.customSections,
  };

  if (!merged.monogram?.initials && (merged.hosts?.bride || merged.hosts?.groom)) {
    const bI = (merged.hosts?.bride || 'B').trim()[0]?.toUpperCase() || 'B';
    const gI = (merged.hosts?.groom || 'G').trim()[0]?.toUpperCase() || 'G';
    merged.monogram.initials = `${bI} & ${gI}`;
  }
  if (!merged.photos.cover || /caricature\.webp|scooter_couple\.webp|zardozi|truck|04-pheras\.webp/.test(merged.photos.cover)) {
    merged.photos.cover = base.photos.cover;
  }
  if (!merged.photos.bride || merged.photos.bride.includes('unsplash')) {
    merged.photos.bride = base.photos.bride;
  }
  if (!merged.photos.groom || merged.photos.groom.includes('unsplash')) {
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

export function getActiveClientSlug() {
  try {
    return localStorage.getItem(ACTIVE_SLUG_KEY) || '';
  } catch {
    return '';
  }
}

export function setActiveClientSlug(slug) {
  try {
    if (slug) localStorage.setItem(ACTIVE_SLUG_KEY, slug);
    else localStorage.removeItem(ACTIVE_SLUG_KEY);
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
      const res = await fetch(`./api/clients?slug=${encodeURIComponent(slug)}`);
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
  const slug = computeCoupleSlug(data?.hosts);
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
    localStorage.setItem(LEGACY_SAVED_KEY, json);
  } catch {
    // Ignore duplicate quota overflow cleanly; client data stays in PUBLISHED_PREFIX + IDB
  }

  if (extraMeta.setActive !== false) {
    setActiveClientSlug(slug);
  }

  registry[slug] = meta;
  writeRegistry(registry);

  // Mirror to IndexedDB asynchronously for unlimited offline persistence
  saveClientToIdb(slug, data).catch(() => {});

  return { slug, meta };
}

export async function saveClientToServer(slug, data) {
  if (typeof window === 'undefined' || window.location.hostname.includes('github.io')) {
    return false;
  }
  try {
    const res = await fetch('./api/save-client', {
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

export function getInitialClientData() {
  try {
    if (typeof window !== 'undefined') {
      const urlSlug = new URLSearchParams(window.location.search).get('client');
      if (urlSlug) {
        const fromUrl = getSavedClient(urlSlug);
        if (fromUrl) {
          setActiveClientSlug(urlSlug);
          return fromUrl;
        }
      }
    }

    const activeSlug = getActiveClientSlug();
    if (activeSlug) {
      const fromActive = getSavedClient(activeSlug);
      if (fromActive) return fromActive;
    }

    const legacyRaw = localStorage.getItem(LEGACY_SAVED_KEY);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw);
      if (parsed && typeof parsed === 'object' && parsed.hosts) {
        const merged = mergeClientWithDefaults(parsed);
        const slug = computeCoupleSlug(merged.hosts);
        saveClientLocal(merged, { setActive: true });
        setActiveClientSlug(slug);
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
