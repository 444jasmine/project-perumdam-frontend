const STORAGE_KEY = 'pdamsurvey_api_base_url';

function isLoopbackHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function isLocalhostUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    return isLoopbackHost(parsed.hostname);
  } catch {
    return false;
  }
}

function getEnvApiBaseUrl() {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return String(import.meta.env.VITE_API_BASE_URL).replace(/\/$/, '');
  }

  return '';
}

export function getApiBaseUrl() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const envBase = getEnvApiBaseUrl();

  if (saved) {
    // If app opened from phone/LAN and saved URL points to localhost, ignore it.
    if (isLocalhostUrl(saved) && !isLoopbackHost(window.location.hostname)) {
      return envBase;
    }

    return saved;
  }

  return envBase;
}

export function setApiBaseUrl(url) {
  localStorage.setItem(STORAGE_KEY, url.replace(/\/$/, ''));
}

export function buildApiUrl(path) {
  const base = getApiBaseUrl();
  if (!base) {
    return path;
  }

  return `${base}${path}`;
}
