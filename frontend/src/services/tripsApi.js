import { API_V1_PREFIX } from './api/config';
import { apiRequest } from './api/httpClient';

const TRIPS_BASE = `${API_V1_PREFIX}/trips`;

export function saveTrip(itinerary) {
  return apiRequest(`${TRIPS_BASE}/save/`, {
    method: 'POST',
    body: { itinerary },
  });
}

export function fetchTrips() {
  return apiRequest(`${TRIPS_BASE}/`);
}

export function fetchTrip(id) {
  return apiRequest(`${TRIPS_BASE}/${id}/`);
}

export function fetchSharedTrip(shareId) {
  return apiRequest(`${API_V1_PREFIX}/shared/${shareId}/`, {
    auth: false,
  });
}

export function deleteTrip(id) {
  return apiRequest(`${TRIPS_BASE}/${id}/`, {
    method: 'DELETE',
  });
}
