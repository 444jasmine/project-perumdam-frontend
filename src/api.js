import { buildApiUrl } from './config.js';
import { clearAuthToken, getValidAuthToken } from './auth.js';

function createAuthHeaders(headers = {}) {
  const token = getValidAuthToken();

  if (!token) {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${token}`
  };
}

async function apiFetch(path, options = {}) {
  const nextOptions = {
    ...options,
    headers: createAuthHeaders(options.headers || {})
  };

  return fetch(buildApiUrl(path), nextOptions);
}

async function parseResponse(response) {
  const text = await response.text();
  let body = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
    }

    const message = (body && body.message) || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return body;
}

export async function login(username, password) {
  const form = new FormData();
  form.append('username', username);
  form.append('password', password);

  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: form
  });

  return parseResponse(response);
}

export async function getItems() {
  const response = await apiFetch('/api/items');
  return parseResponse(response);
}

export async function createSurvey(payload) {
  const response = await apiFetch('/api/surveys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function getSurveyResults() {
  const response = await apiFetch('/api/results');
  return parseResponse(response);
}

export async function getCustomers(keyword = '', limit = 300, status = '') {
  const query = new URLSearchParams();

  if (keyword.trim()) {
    query.set('q', keyword.trim());
  }

  query.set('limit', String(limit));

  if (String(status).trim()) {
    query.set('status', String(status).trim());
  }

  const response = await apiFetch(`/api/customers?${query.toString()}`);
  return parseResponse(response);
}

export async function getCustomerById(customerId) {
  const encodedId = encodeURIComponent(String(customerId || '').trim());
  const response = await apiFetch(`/api/customers/${encodedId}`);
  return parseResponse(response);
}

export async function updateCustomerStatus(customerId, status) {
  const encodedId = encodeURIComponent(String(customerId || '').trim());
  const response = await apiFetch(`/api/customers/${encodedId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  });

  return parseResponse(response);
}

export async function resetAllCustomerStatuses() {
  const response = await apiFetch('/api/customers/reset-status', {
    method: 'PATCH'
  });

  return parseResponse(response);
}

export async function getSurveyResultById(resultId) {
  const encodedId = encodeURIComponent(String(resultId || '').trim());
  const response = await apiFetch(`/api/results/${encodedId}`);
  return parseResponse(response);
}

export function getReceiptUrl(surveyId) {
  return buildApiUrl(`/api/results/${surveyId}/receipt.pdf`);
}

export async function getReceiptPdfBlob(surveyId) {
  const response = await apiFetch(`/api/results/${surveyId}/receipt.pdf`);

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
    }

    const text = await response.text();
    let message = `HTTP ${response.status}`;

    if (text) {
      try {
        const parsed = JSON.parse(text);
        message = parsed?.message || parsed?.error || message;
      } catch {
        message = text;
      }
    }

    throw new Error(message);
  }

  return response.blob();
}

export async function uploadDocument(file) {
  const form = new FormData();
  form.append('document', file);

  const response = await apiFetch('/api/uploads/upload', {
    method: 'POST',
    body: form
  });

  return parseResponse(response);
}
