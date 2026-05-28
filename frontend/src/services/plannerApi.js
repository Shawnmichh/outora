import { API_V1_PREFIX } from './api/config';
import { apiRequest } from './api/httpClient';

const PLANNER_BASE = `${API_V1_PREFIX}/planner`;

/**
 * Maps frontend questionnaire state to the API payload (camelCase).
 * @param {object} formData - questionnaire form state
 * @param {{ latitude: number, longitude: number } | null} [coordinates] - optional browser location
 */
export function mapQuestionnaireToApi(formData, coordinates = null) {
  const payload = {
    userType: formData.userType,
    numberOfPeople: formData.numberOfPeople,
    budget: formData.budget,
    transportMode: formData.transportMode,
    outingVibe: formData.outingVibe,
    foodPreference: formData.foodPreference,
    mealPreferences: formData.mealPreferences || [],  // NEW: Multi-select meal timing
<<<<<<< HEAD
    moviePreference: formData.moviePreference || 'maybe',  // NEW: Movie/entertainment preference
=======
>>>>>>> d3c121908167cc75070a0def7dda712af6d61559
    startTime: formData.startTime,
    endTime: formData.endTime,
  };

  const lat = coordinates?.latitude ?? formData.latitude;
  const lng = coordinates?.longitude ?? formData.longitude;

  if (lat != null && lng != null) {
    payload.latitude = lat;
    payload.longitude = lng;
  }

  return payload;
}

/**
 * POST /api/v1/planner/generate-plan/
 * @param {object} formData - questionnaire form state
 * @param {{ latitude: number, longitude: number } | null} [coordinates] - optional browser location
 * @returns {Promise<object>} generated outing plan
 */
export async function generatePlan(formData, coordinates = null) {
  return apiRequest(`${PLANNER_BASE}/generate-plan/`, {
    method: 'POST',
    body: mapQuestionnaireToApi(formData, coordinates),
  });
}
