// Shared route and asset URL helpers for Paigaam occasion studio paths

export const OCCASION_ROUTE_SLUGS = {
  wedding: '',
  engagement: 'engagement-invitation',
  birthday: 'birthday-invitation',
  housewarming: 'housewarming-invitation',
  'house-party': 'house-party-invitation',
  'baby-shower': 'baby-shower-invitation',
  annaprashan: 'annaprashan-invitation',
  'holy-communion': 'holy-communion-invitation',
};

export const NON_WEDDING_ROUTE_SLUGS = Object.entries(OCCASION_ROUTE_SLUGS)
  .filter(([id, slug]) => id !== 'wedding' && Boolean(slug))
  .map(([, slug]) => slug);

export function getOccasionFromLocation() {
  if (typeof window === 'undefined') return null;

  const pathname = (window.location.pathname || '/').replace(/\/index\.html$/i, '/');
  for (const [occId, slug] of Object.entries(OCCASION_ROUTE_SLUGS)) {
    if (!slug) continue;
    const re = new RegExp(`/${slug}/?$`, 'i');
    if (re.test(pathname)) {
      return occId;
    }
  }

  if (window.__PAIGAAM_OCCASION__ && OCCASION_ROUTE_SLUGS[window.__PAIGAAM_OCCASION__] !== undefined) {
    return window.__PAIGAAM_OCCASION__;
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const paramOcc = params.get('occasion');
    if (paramOcc && OCCASION_ROUTE_SLUGS[paramOcc] !== undefined) {
      return paramOcc;
    }
  } catch {
    // ignore URL parsing errors
  }

  return null;
}

export function getSiteRootPath() {
  if (typeof window === 'undefined') return '/';
  let pathname = (window.location.pathname || '/').replace(/\/index\.html$/i, '/');

  for (const slug of NON_WEDDING_ROUTE_SLUGS) {
    const re = new RegExp(`/${slug}/?$`, 'i');
    if (re.test(pathname)) {
      pathname = pathname.replace(re, '/');
      break;
    }
  }

  if (!pathname.endsWith('/')) {
    pathname += '/';
  }
  return pathname;
}

export function getSiteRootUrl() {
  if (typeof window === 'undefined') return '/';
  return `${window.location.origin}${getSiteRootPath()}`;
}

export function getOccasionUrl(occasionId = 'wedding') {
  const slug = OCCASION_ROUTE_SLUGS[occasionId] || '';
  const rootUrl = getSiteRootUrl();
  return slug ? `${rootUrl}${slug}/#studio` : `${rootUrl}#studio`;
}

export function resolveAssetUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (/^(data:|blob:|https?:|\/\/)/i.test(url)) return url;
  if (typeof window === 'undefined') return url;

  const rootPath = getSiteRootPath();
  if (url.startsWith('./')) {
    return `${rootPath}${url.slice(2)}`;
  }
  if (
    url.startsWith('../images/') ||
    url.startsWith('../audio/') ||
    url.startsWith('../published/')
  ) {
    return `${rootPath}${url.slice(3)}`;
  }
  if (
    (url.startsWith('/images/') ||
      url.startsWith('/audio/') ||
      url.startsWith('/published/')) &&
    rootPath !== '/' &&
    !url.startsWith(rootPath)
  ) {
    return `${rootPath}${url.slice(1)}`;
  }
  return url;
}

export function resolvePublishedUrl(slug) {
  const cleanSlug = (slug || 'invitation').replace(/\.html$/i, '');
  return `${getSiteRootUrl()}published/${cleanSlug}.html`;
}

export function toCanonicalAssetUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (typeof window === 'undefined') return url;
  const rootPath = getSiteRootPath();
  if (url.startsWith(`${rootPath}images/`)) {
    return `./${url.slice(rootPath.length)}`;
  }
  if (url.startsWith(`${rootPath}audio/`)) {
    return `./${url.slice(rootPath.length)}`;
  }
  return url;
}
