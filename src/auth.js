const TOKEN_STORAGE_KEY = 'pdamsurvey_auth_token';

function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');

    if (parts.length !== 3) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const json = atob(normalized);

    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY) || '';
}

export function setAuthToken(token) {
  if (!token) {
    return;
  }

  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function isTokenExpired(token = getAuthToken()) {
  if (!token) {
    return true;
  }

  const payload = decodeJwtPayload(token);

  if (!payload || typeof payload.exp !== 'number') {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
}

export function getValidAuthToken() {
  const token = getAuthToken();

  if (!token || isTokenExpired(token)) {
    clearAuthToken();
    return '';
  }

  return token;
}

export function hasValidSession() {
  return Boolean(getValidAuthToken());
}

export function getSessionUser() {
  const token = getValidAuthToken();

  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);

  if (!payload || typeof payload !== 'object') {
    return null;
  }

  return {
    id: payload.id ? String(payload.id) : '',
    username: payload.username ? String(payload.username) : '',
    role: payload.role ? String(payload.role) : ''
  };
}

export function getSurveyorDisplayName() {
  const username = String(getSessionUser()?.username || '').trim().toLowerCase();

  const nameMap = {
    admin1: 'Nida',
    admin2: 'Fatih',
    admin3: 'Bintang'
  };

  if (username in nameMap) {
    return nameMap[username];
  }

  return 'Surveyor';
}

export function logout() {
  clearAuthToken();
}
