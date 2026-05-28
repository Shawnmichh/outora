/**
 * Google Maps Navigation Utilities
 * 
 * Generates Google Maps URLs for multi-stop navigation with preserved itinerary order.
 * Supports mobile app deep-linking and desktop browser navigation.
 */

/**
 * Map Outora transport types to Google Maps travel modes
 */
const TRAVEL_MODE_MAP = {
  driving: 'driving',
  walking: 'walking',
  bicycling: 'bicycling',
  transit: 'transit',
  car: 'driving',
  bike: 'bicycling',
  foot: 'walking',
  public_transport: 'transit',
};

/**
 * Maximum number of waypoints supported by Google Maps Directions API
 * Origin + 8 waypoints + destination = 10 total locations
 */
const MAX_WAYPOINTS = 8;

/**
 * Maximum URL length to avoid browser/server limits
 * Most browsers support 2000+ chars, but we stay conservative
 */
const MAX_URL_LENGTH = 2000;

/**
 * Extract coordinates from a stop's location field
 * Supports multiple coordinate formats from the API
 */
function getStopCoordinates(stop) {
  if (!stop?.location) return null;
  
  const { location } = stop;
  
  // Try latitude/longitude format
  if (location.latitude != null && location.longitude != null) {
    const lat = Number(location.latitude);
    const lng = Number(location.longitude);
    if (isFinite(lat) && isFinite(lng)) {
      return { lat, lng };
    }
  }
  
  // Try lat/lng format
  if (location.lat != null && location.lng != null) {
    const lat = Number(location.lat);
    const lng = Number(location.lng);
    if (isFinite(lat) && isFinite(lng)) {
      return { lat, lng };
    }
  }
  
  return null;
}

/**
 * Format a stop for Google Maps URL
 * Prefers coordinates over place names for accuracy
 */
function formatStopForUrl(stop) {
  const coords = getStopCoordinates(stop);
  
  if (coords) {
    // Use coordinates for precise location
    return `${coords.lat},${coords.lng}`;
  }
  
  // Fallback to place name (less precise but still works)
  if (stop.name) {
    return encodeURIComponent(stop.name);
  }
  
  return null;
}

/**
 * Normalize transport mode to Google Maps travel mode
 */
function normalizeTravelMode(mode) {
  if (!mode) return 'driving';
  
  const normalized = String(mode).toLowerCase().trim();
  return TRAVEL_MODE_MAP[normalized] || 'driving';
}

/**
 * Generate a Google Maps Directions URL with all itinerary stops
 * 
 * @param {Array} stops - Array of stop objects from the itinerary
 * @param {string} travelMode - Transport mode (driving, walking, bicycling, transit)
 * @returns {string|null} - Google Maps URL or null if invalid
 */
export function generateGoogleMapsUrl(stops, travelMode = 'driving') {
  // Validate input
  if (!Array.isArray(stops) || stops.length === 0) {
    console.warn('[GoogleMapsNavigation] No stops provided');
    return null;
  }
  
  // Filter out stops without valid location data
  const validStops = stops
    .filter(stop => {
      const formatted = formatStopForUrl(stop);
      if (!formatted) {
        console.warn('[GoogleMapsNavigation] Skipping stop without location:', stop.name);
        return false;
      }
      return true;
    })
    .map(stop => ({
      ...stop,
      formatted: formatStopForUrl(stop),
    }));
  
  if (validStops.length === 0) {
    console.warn('[GoogleMapsNavigation] No valid stops with location data');
    return null;
  }
  
  // Handle single stop - just open location
  if (validStops.length === 1) {
    const stop = validStops[0];
    return `https://www.google.com/maps/search/?api=1&query=${stop.formatted}`;
  }
  
  // Handle two stops - simple origin to destination
  if (validStops.length === 2) {
    const mode = normalizeTravelMode(travelMode);
    return `https://www.google.com/maps/dir/?api=1&origin=${validStops[0].formatted}&destination=${validStops[1].formatted}&travelmode=${mode}`;
  }
  
  // Handle multiple stops with waypoints
  // Clamp to Google Maps API limit
  const clampedStops = validStops.length > MAX_WAYPOINTS + 2
    ? [
        validStops[0], // origin
        ...validStops.slice(1, MAX_WAYPOINTS + 1), // intermediate waypoints
        validStops[validStops.length - 1], // destination
      ]
    : validStops;
  
  const origin = clampedStops[0].formatted;
  const destination = clampedStops[clampedStops.length - 1].formatted;
  const waypoints = clampedStops.slice(1, -1).map(s => s.formatted).join('|');
  const mode = normalizeTravelMode(travelMode);
  
  // Build URL
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${mode}`;
  
  if (waypoints) {
    url += `&waypoints=${waypoints}`;
  }
  
  // Check URL length
  if (url.length > MAX_URL_LENGTH) {
    console.warn('[GoogleMapsNavigation] URL too long, trimming waypoints');
    
    // Try with fewer waypoints
    const reducedWaypoints = clampedStops.slice(1, Math.min(5, clampedStops.length - 1));
    const trimmedWaypoints = reducedWaypoints.map(s => s.formatted).join('|');
    
    url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${mode}`;
    if (trimmedWaypoints) {
      url += `&waypoints=${trimmedWaypoints}`;
    }
  }
  
  console.log('[GoogleMapsNavigation] Generated URL:', {
    totalStops: stops.length,
    validStops: validStops.length,
    includedStops: clampedStops.length,
    travelMode: mode,
    urlLength: url.length,
  });
  
  return url;
}

/**
 * Open Google Maps navigation in a new window/tab or mobile app
 * 
 * @param {Array} stops - Array of stop objects from the itinerary
 * @param {string} travelMode - Transport mode
 * @returns {boolean} - True if navigation was opened successfully
 */
export function openGoogleMapsNavigation(stops, travelMode = 'driving') {
  const url = generateGoogleMapsUrl(stops, travelMode);
  
  if (!url) {
    console.error('[GoogleMapsNavigation] Failed to generate URL');
    return false;
  }
  
  try {
    // Open in new window/tab
    // On mobile, this will trigger the Google Maps app if installed
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
  } catch (error) {
    console.error('[GoogleMapsNavigation] Failed to open URL:', error);
    return false;
  }
}

/**
 * Check if stops have sufficient location data for navigation
 * 
 * @param {Array} stops - Array of stop objects
 * @returns {boolean} - True if at least 2 stops have valid locations
 */
export function canGenerateNavigation(stops) {
  if (!Array.isArray(stops) || stops.length < 2) {
    return false;
  }
  
  const validCount = stops.filter(stop => formatStopForUrl(stop) !== null).length;
  return validCount >= 2;
}
