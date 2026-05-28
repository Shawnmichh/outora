export const GEOLOCATION_ERROR_CODES = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
};

export function getGeolocationErrorMessage(code) {
  switch (code) {
    case GEOLOCATION_ERROR_CODES.PERMISSION_DENIED:
      return 'Location permission denied. Recommendations will use a default area.';
    case GEOLOCATION_ERROR_CODES.POSITION_UNAVAILABLE:
      return 'Location unavailable. Recommendations will use a default area.';
    case GEOLOCATION_ERROR_CODES.TIMEOUT:
      return 'Location request timed out. Recommendations will use a default area.';
    default:
      return 'Could not detect your location. Recommendations will use a default area.';
  }
}

export function formatCoordinates(latitude, longitude, precision = 4) {
  if (latitude == null || longitude == null) return null;
  return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`;
}
