import { buildApiUrl } from './config.js';

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
    const message = (body && body.message) || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return body;
}

export async function login(username, password) {
  const form = new FormData();
  form.append('username', username);
  form.append('password', password);

  const response = await fetch(buildApiUrl('/api/auth/login'), {
    method: 'POST',
    body: form
  });

  return parseResponse(response);
}

export async function getItems() {
  const response = await fetch(buildApiUrl('/api/items'));
  return parseResponse(response);
}

export async function createSurvey(payload) {
  const response = await fetch(buildApiUrl('/api/surveys'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function getSurveyResults() {
  const response = await fetch(buildApiUrl('/api/results'));
  return parseResponse(response);
}

export function getReceiptUrl(surveyId) {
  return buildApiUrl(`/api/results/${surveyId}/receipt.pdf`);
}

export async function uploadDocument(file) {
  const form = new FormData();
  form.append('document', file);

  const response = await fetch(buildApiUrl('/api/uploads/upload'), {
    method: 'POST',
    body: form
  });

  return parseResponse(response);
}
