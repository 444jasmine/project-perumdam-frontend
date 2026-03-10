const STORAGE_KEY = 'pdamsurvey_api_base_url';

function getEnvApiBaseUrl() {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return String(import.meta.env.VITE_API_BASE_URL).replace(/\/$/, '');
  }

  return 'http://localhost:3000';
}

export function getApiBaseUrl() {
  return localStorage.getItem(STORAGE_KEY) || getEnvApiBaseUrl();
}

export function setApiBaseUrl(url) {
  localStorage.setItem(STORAGE_KEY, url.replace(/\/$/, ''));
}

export function buildApiUrl(path) {
  return `${getApiBaseUrl()}${path}`;
}
