import {
  login,
  getItems,
  createSurvey,
  getSurveyResults,
  getReceiptUrl,
  uploadDocument
} from './api.js';
import { getApiBaseUrl, setApiBaseUrl } from './config.js';

const state = {
  user: null,
  items: []
};

const elements = {
  apiBaseUrl: document.getElementById('apiBaseUrl'),
  saveConfigBtn: document.getElementById('saveConfigBtn'),
  status: document.getElementById('status'),
  loginForm: document.getElementById('loginForm'),
  logoutBtn: document.getElementById('logoutBtn'),
  username: document.getElementById('username'),
  password: document.getElementById('password'),
  loginOutput: document.getElementById('loginOutput'),
  loadItemsBtn: document.getElementById('loadItemsBtn'),
  itemsTableBody: document.getElementById('itemsTableBody'),
  surveyForm: document.getElementById('surveyForm'),
  surveyTitle: document.getElementById('surveyTitle'),
  surveyDescription: document.getElementById('surveyDescription'),
  surveyOutput: document.getElementById('surveyOutput'),
  loadResultsBtn: document.getElementById('loadResultsBtn'),
  resultsTableBody: document.getElementById('resultsTableBody'),
  uploadForm: document.getElementById('uploadForm'),
  documentFile: document.getElementById('documentFile'),
  uploadOutput: document.getElementById('uploadOutput')
};

function setStatus(message, isError = false) {
  elements.status.textContent = message;
  elements.status.style.color = isError ? '#b91c1c' : '#166534';
}

function toJson(value) {
  return JSON.stringify(value, null, 2);
}

function renderItems(items) {
  elements.itemsTableBody.innerHTML = '';

  if (!Array.isArray(items) || items.length === 0) {
    elements.itemsTableBody.innerHTML = '<tr><td colspan="5">Tidak ada data item</td></tr>';
    return;
  }

  for (const item of items) {
    const row = document.createElement('tr');
    const itemId = item._id || item.id;

    row.innerHTML = `
      <td><input type="checkbox" class="item-check" value="${itemId}" /></td>
      <td>${item.name || '-'}</td>
      <td>${item.satuan || '-'}</td>
      <td>${Number(item.price || 0).toLocaleString('id-ID')}</td>
      <td>${itemId || '-'}</td>
    `;

    elements.itemsTableBody.appendChild(row);
  }
}

function renderResults(results) {
  elements.resultsTableBody.innerHTML = '';

  if (!Array.isArray(results) || results.length === 0) {
    elements.resultsTableBody.innerHTML = '<tr><td colspan="4">Belum ada hasil survey</td></tr>';
    return;
  }

  for (const result of results) {
    const row = document.createElement('tr');
    const id = result._id || result.id;
    const createdAt = result.createdAt ? new Date(result.createdAt).toLocaleString('id-ID') : '-';
    const receiptUrl = id ? getReceiptUrl(id) : '#';

    row.innerHTML = `
      <td>${result.title || '-'}</td>
      <td>${result.description || '-'}</td>
      <td>${createdAt}</td>
      <td>${id ? `<a href="${receiptUrl}" target="_blank" rel="noopener noreferrer">Lihat PDF</a>` : '-'}</td>
    `;

    elements.resultsTableBody.appendChild(row);
  }
}

function getSelectedItemIds() {
  const checks = document.querySelectorAll('.item-check:checked');
  return Array.from(checks).map((checkbox) => checkbox.value);
}

function initializeConfig() {
  elements.apiBaseUrl.value = getApiBaseUrl();

  elements.saveConfigBtn.addEventListener('click', () => {
    const nextBaseUrl = elements.apiBaseUrl.value.trim();

    if (!nextBaseUrl) {
      setStatus('Base URL API tidak boleh kosong', true);
      return;
    }

    setApiBaseUrl(nextBaseUrl);
    setStatus(`Konfigurasi tersimpan: ${nextBaseUrl}`);
  });
}

function initializeAuth() {
  elements.loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      const response = await login(elements.username.value.trim(), elements.password.value.trim());
      state.user = response?.user || null;
      elements.loginOutput.textContent = toJson(response);
      setStatus('Login berhasil');
    } catch (error) {
      elements.loginOutput.textContent = error.message;
      setStatus(`Login gagal: ${error.message}`, true);
    }
  });

  elements.logoutBtn.addEventListener('click', () => {
    state.user = null;
    elements.username.value = '';
    elements.password.value = '';
    elements.loginOutput.textContent = 'Logout berhasil';
    setStatus('Session frontend dibersihkan');
  });
}

function initializeItems() {
  elements.loadItemsBtn.addEventListener('click', async () => {
    try {
      const items = await getItems();
      state.items = Array.isArray(items) ? items : [];
      renderItems(state.items);
      setStatus(`Berhasil memuat ${state.items.length} item`);
    } catch (error) {
      setStatus(`Gagal memuat item: ${error.message}`, true);
    }
  });
}

function initializeSurvey() {
  elements.surveyForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const selectedItemIds = getSelectedItemIds();
    const payload = {
      title: elements.surveyTitle.value.trim(),
      description: elements.surveyDescription.value.trim(),
      items: selectedItemIds
    };

    try {
      const response = await createSurvey(payload);
      elements.surveyOutput.textContent = toJson(response);
      setStatus('Survey berhasil disimpan');
    } catch (error) {
      elements.surveyOutput.textContent = error.message;
      setStatus(`Gagal membuat survey: ${error.message}`, true);
    }
  });
}

function initializeResults() {
  elements.loadResultsBtn.addEventListener('click', async () => {
    try {
      const results = await getSurveyResults();
      renderResults(results);
      setStatus('Hasil survey berhasil dimuat');
    } catch (error) {
      setStatus(`Gagal memuat hasil survey: ${error.message}`, true);
    }
  });
}

function initializeUpload() {
  elements.uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = elements.documentFile.files?.[0];

    if (!file) {
      setStatus('Pilih file sebelum upload', true);
      return;
    }

    try {
      const response = await uploadDocument(file);
      elements.uploadOutput.textContent = toJson(response);
      setStatus('Upload dokumen berhasil');
    } catch (error) {
      elements.uploadOutput.textContent = error.message;
      setStatus(`Upload gagal: ${error.message}`, true);
    }
  });
}

function bootstrap() {
  initializeConfig();
  initializeAuth();
  initializeItems();
  initializeSurvey();
  initializeResults();
  initializeUpload();
}

bootstrap();
