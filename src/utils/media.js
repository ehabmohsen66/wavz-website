/**
 * Safely resolves media URLs (uploads, static assets, legacy wp-content paths)
 * preventing broken localhost references and resolving legacy paths to local assets.
 */
export function getMediaUrl(path, fallback = '') {
  if (!path) return fallback;

  if (typeof path === 'string') {
    // 1. Map legacy WordPress upload URLs or paths to local /blog-images/
    if (path.includes('wp-content/uploads/')) {
      const filename = path.split('/').pop()?.split('?')[0];
      if (filename) {
        return `/blog-images/${filename}`;
      }
    }

    // 2. If it is an absolute URL pointing to wavz.com.eg, normalize it
    if (path.startsWith('http://') || path.startsWith('https://')) {
      try {
        const parsed = new URL(path);
        if (parsed.hostname === 'wavz.com.eg' || parsed.hostname === 'www.wavz.com.eg') {
          if (parsed.pathname.includes('wp-content/uploads/')) {
            const filename = parsed.pathname.split('/').pop()?.split('?')[0];
            return `/blog-images/${filename}`;
          }
          return parsed.pathname;
        }
      } catch (e) {}
      return path;
    }

    if (path.startsWith('data:')) {
      return path;
    }
  }

  const rawUrl = import.meta.env.VITE_API_URL || '/api';
  const isLocal = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === ''
  );
  const base = (!isLocal && rawUrl.includes('localhost')) ? '' : rawUrl.replace(/\/api\/?$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
