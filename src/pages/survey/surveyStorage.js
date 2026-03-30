const STATUS_KEY = 'pdamsurvey_status_map';
const DRAFT_KEY = 'pdamsurvey_draft_map';
const SURVEY_RESULT_KEY = 'pdamsurvey_result_map';
const CUSTOMER_FORM_KEY = 'pdamsurvey_customer_form_map';

function safeParse(rawValue, fallback) {
  if (!rawValue) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(rawValue);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function readStatusMap() {
  return safeParse(localStorage.getItem(STATUS_KEY), {});
}

function writeStatusMap(nextMap) {
  localStorage.setItem(STATUS_KEY, JSON.stringify(nextMap));
}

function readDraftMap() {
  return safeParse(localStorage.getItem(DRAFT_KEY), {});
}

function writeDraftMap(nextMap) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(nextMap));
}

function readSurveyResultMap() {
  return safeParse(localStorage.getItem(SURVEY_RESULT_KEY), {});
}

function writeSurveyResultMap(nextMap) {
  localStorage.setItem(SURVEY_RESULT_KEY, JSON.stringify(nextMap));
}

function readCustomerFormMap() {
  return safeParse(localStorage.getItem(CUSTOMER_FORM_KEY), {});
}

function writeCustomerFormMap(nextMap) {
  localStorage.setItem(CUSTOMER_FORM_KEY, JSON.stringify(nextMap));
}

export function getStoredStatusByCustomerId(customerId) {
  const map = readStatusMap();
  return map[String(customerId)] || null;
}

export function setStoredStatusByCustomerId(customerId, status) {
  const map = readStatusMap();
  map[String(customerId)] = status;
  writeStatusMap(map);
}

export function saveSurveyDraft(customerId, payload) {
  const map = readDraftMap();
  map[String(customerId)] = payload;
  writeDraftMap(map);
}

export function getSurveyDraft(customerId) {
  const map = readDraftMap();
  return map[String(customerId)] || null;
}

export function clearSurveyDraft(customerId) {
  const map = readDraftMap();
  delete map[String(customerId)];
  writeDraftMap(map);
}

export function setSurveyResultIdByCustomerId(customerId, surveyResultId) {
  const map = readSurveyResultMap();
  map[String(customerId)] = surveyResultId;
  writeSurveyResultMap(map);
}

export function getSurveyResultIdByCustomerId(customerId) {
  const map = readSurveyResultMap();
  return map[String(customerId)] || null;
}

export function getCustomerFormByCustomerId(customerId) {
  const map = readCustomerFormMap();
  return map[String(customerId)] || null;
}

export function saveCustomerFormByCustomerId(customerId, payload) {
  const map = readCustomerFormMap();
  map[String(customerId)] = payload;
  writeCustomerFormMap(map);
  return map[String(customerId)];
}
