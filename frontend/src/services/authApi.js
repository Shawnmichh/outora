import { API_V1_PREFIX } from './api/config';
import { apiRequest } from './api/httpClient';

const AUTH_BASE = `${API_V1_PREFIX}/auth`;

export function registerUser(payload) {
  return apiRequest(`${AUTH_BASE}/register/`, {
    method: 'POST',
    body: payload,
    auth: false,
  });
}

export function loginUser(payload) {
  return apiRequest(`${AUTH_BASE}/login/`, {
    method: 'POST',
    body: payload,
    auth: false,
  });
}

export function logoutUser() {
  return apiRequest(`${AUTH_BASE}/logout/`, {
    method: 'POST',
  });
}

export function fetchCurrentUser() {
  return apiRequest(`${AUTH_BASE}/me/`);
}
