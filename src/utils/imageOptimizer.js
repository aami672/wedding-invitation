/**
 * Image Optimizer for Standalone Offline HTML Invitations
 * Compresses images so the final standalone HTML file stays under 5MB,
 * preventing iPhone Safari / QuickLook 10MB memory crashes while maintaining
 * crisp Retina display quality.
 */

import { resolveAssetUrl } from './appAssets';

export async function toBase64Optimized(url, maxDimension = 1600, quality = 0.90, preserveAlpha = false) {
  if (!url) return '';
  if (typeof window === 'undefined') return url;

  const resolvedUrl = resolveAssetUrl(url);

  return new Promise((resolve) => {
    // If it's an SVG data URI or simple text, return directly
    if (resolvedUrl.startsWith('data:image/svg+xml')) {
      return resolve(resolvedUrl);
    }

    const img = new window.Image();
    img.crossOrigin = 'anonymous';

    const timer = setTimeout(() => {
      // Fallback if loading takes too long
      fallbackFetch(resolvedUrl).then(resolve);
    }, 4000);

    img.onload = () => {
      clearTimeout(timer);
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          return fallbackFetch(resolvedUrl).then(resolve);
        }

        // Downscale maintaining aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!preserveAlpha) {
          // Fill background for photos to ensure clean JPEG compression
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } else {
          // Transparent stickers & caricatures
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          let dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/png');
          }
          resolve(dataUrl);
        }
      } catch (err) {
        fallbackFetch(resolvedUrl).then(resolve);
      }
    };

    img.onerror = () => {
      clearTimeout(timer);
      fallbackFetch(resolvedUrl).then(resolve);
    };

    img.src = resolvedUrl;
  });
}

async function fallbackFetch(url) {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(url);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    return url;
  }
}
