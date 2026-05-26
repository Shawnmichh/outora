/**
 * ItineraryMap
 *
 * Renders an interactive Google Map for a generated outing plan itinerary.
 * Shows real road-network route polylines between stops using the Directions
 * API, with estimated travel durations between each leg displayed below the map.
 *
 * Required Google Cloud APIs:
 *  - Maps JavaScript API (core map rendering)
 *  - Places API (location data for stops)
 *  - Directions API (route calculation between stops)
 *  - Geocoding API (fallback address resolution)
 *
 * Configuration:
 *  - Set VITE_GOOGLE_MAPS_API_KEY in .env file
 *  - Ensure all 4 APIs are enabled in Google Cloud Console
 *  - Configure API key restrictions to allow all 4 APIs
 *  - Add your domain to HTTP referrer restrictions
 *
 * Troubleshooting:
 *  - See GOOGLE_MAPS_SETUP.md for initial setup
 *  - See GOOGLE_MAPS_API_RESTRICTIONS.md for ApiTargetBlockedMapError
 *  - See GOOGLE_MAPS_TROUBLESHOOTING.md for other issues
 *  - Error cards in the UI provide specific guidance
 *
 * Coordinate resolution strategy (in priority order):
 *  1. stop.location.{latitude,longitude} – direct Google Places coordinates.
 *  2. Geocoder API – geocode the stop name with a location bias.
 *  3. plan-level meta.location – user's origin as last-resort fallback.
 *
 * Directions strategy:
 *  - Requires ≥ 2 stops with valid, distinct coordinates.
 *  - Origin  = first resolved stop.
 *  - Destination = last resolved stop.
 *  - Waypoints = all stops in between (up to the Directions API limit of 8).
 *  - suppressMarkers = true  →  our custom OverlayView pins are preserved.
 *  - On failure → gracefully falls back to marker-only mode with manual bounds.
 *
 * Props:
 *  stops        – plan.stops[] from the API response
 *  planLocation – plan.meta.location { latitude, longitude } (user origin)
 *  className    – optional extra Tailwind classes for the outer wrapper
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  OverlayView,
  DirectionsRenderer,
} from '@react-google-maps/api';

// ─── Constants ────────────────────────────────────────────────────────────────

// Module-level constant so the reference is stable across renders
// (useJsApiLoader warns when `libraries` changes identity).
//
// Required libraries for full itinerary map functionality:
// - 'places': Location data and place details (used for stop coordinates)
// - 'geocoding': Address-to-coordinate conversion (fallback when Places data unavailable)
//
// IMPORTANT: Only include libraries that are actually used by the component.
// Each library requires the corresponding API to be enabled in Google Cloud:
// - 'places' requires Places API
// - 'geocoding' requires Geocoding API
//
// DO NOT include 'routes' - it's not a valid library name. The Directions API
// is accessed through the core Maps JavaScript API and doesn't require a separate library.
//
// If you get ApiTargetBlockedMapError, ensure your API key allows:
// 1. Maps JavaScript API (core)
// 2. Places API (for 'places' library)
// 3. Directions API (for DirectionsService)
// 4. Geocoding API (for 'geocoding' library)
//
// See GOOGLE_MAPS_API_RESTRICTIONS.md for detailed configuration instructions.
const GOOGLE_MAPS_LIBRARIES = ['places', 'geocoding'];

/** Dark-mode map styles matching the zinc-950 design system. */
const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#0f0f13' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#a1a1aa' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f0f13' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#27272a' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#71717a' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#a1a1aa' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#18181b' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#4b5563' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#27272a' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1c1c1f' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#52525b' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3f3f46' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#27272a' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#71717a' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1c1c1f' }] },
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#52525b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#09090b' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3f3f46' }] },
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#09090b' }] },
];

const MAP_OPTIONS = {
  styles: DARK_MAP_STYLES,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  clickableIcons: false,
  gestureHandling: 'cooperative',
};

/**
 * DirectionsRenderer options — styled to complement the dark map.
 * suppressMarkers keeps our custom OverlayView pins on top.
 */
const DIRECTIONS_RENDERER_OPTIONS = {
  suppressMarkers: true,
  suppressInfoWindows: true,
  polylineOptions: {
    strokeColor: '#10b981',   // emerald-500
    strokeOpacity: 0.85,
    strokeWeight: 4,
    geodesic: true,
  },
};

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 }; // India centroid fallback
const DEFAULT_ZOOM = 12;
const GEOCODE_TIMEOUT_MS = 8000;
// Google Directions API allows max 8 intermediate waypoints (10 total points).
const MAX_WAYPOINTS = 8;

// ─── Pure helpers ─────────────────────────────────────────────────────────────

/**
 * Parse Google Maps API load errors and return developer-friendly error info.
 * Detects common issues like API not enabled, invalid key, billing issues, etc.
 */
function parseGoogleMapsError(error) {
  if (!error) {
    return {
      title: 'Map Load Failed',
      message: 'Unable to load Google Maps. Please check your configuration.',
      details: null,
      actionLink: null,
    };
  }

  const errorString = error.toString().toLowerCase();
  const errorMessage = error.message || errorString;

  // API target blocked (API key restrictions blocking specific APIs)
  if (errorString.includes('apitargetblocked') || errorString.includes('target blocked')) {
    return {
      title: 'API Target Blocked',
      message: 'Your API key restrictions are blocking required Google Maps APIs. Ensure your API key allows: Maps JavaScript API, Places API, Directions API, and Geocoding API.',
      details: 'Error: ApiTargetBlockedMapError - Check API restrictions in Google Cloud Console',
      actionLink: {
        label: 'Configure API Key Restrictions',
        url: 'https://console.cloud.google.com/apis/credentials',
      },
    };
  }

  // API not activated/enabled
  if (errorString.includes('apinotactivated') || errorString.includes('not activated')) {
    return {
      title: 'Google Maps API Not Enabled',
      message: 'The Maps JavaScript API is not enabled in your Google Cloud project. Enable it in the Google Cloud Console.',
      details: 'Error: ApiNotActivatedMapError',
      actionLink: {
        label: 'Enable Maps JavaScript API',
        url: 'https://console.cloud.google.com/apis/library/maps-backend.googleapis.com',
      },
    };
  }

  // Invalid API key
  if (errorString.includes('invalidkey') || errorString.includes('invalid key')) {
    return {
      title: 'Invalid API Key',
      message: 'The Google Maps API key is invalid. Check that VITE_GOOGLE_MAPS_API_KEY is set correctly.',
      details: 'Error: InvalidKeyMapError',
      actionLink: {
        label: 'Manage API Keys',
        url: 'https://console.cloud.google.com/apis/credentials',
      },
    };
  }

  // Referer not allowed (API key restrictions)
  if (errorString.includes('referernotallowed') || errorString.includes('referer')) {
    return {
      title: 'API Key Restriction Error',
      message: 'This website is not authorized to use the API key. Update your API key restrictions in Google Cloud Console to allow this domain.',
      details: 'Error: RefererNotAllowedMapError - Add your domain to HTTP referrer restrictions',
      actionLink: {
        label: 'Configure API Restrictions',
        url: 'https://console.cloud.google.com/apis/credentials',
      },
    };
  }

  // Billing not enabled
  if (errorString.includes('billing') || errorString.includes('payment')) {
    return {
      title: 'Billing Not Enabled',
      message: 'Google Maps requires billing to be enabled on your Google Cloud project, even for free tier usage.',
      details: 'Error: Billing not enabled',
      actionLink: {
        label: 'Enable Billing',
        url: 'https://console.cloud.google.com/billing',
      },
    };
  }

  // Quota exceeded
  if (errorString.includes('quota') || errorString.includes('overlimit')) {
    return {
      title: 'API Quota Exceeded',
      message: 'You have exceeded your Google Maps API quota. Check your usage in Google Cloud Console.',
      details: 'Error: OverQuotaMapError',
      actionLink: {
        label: 'View API Usage',
        url: 'https://console.cloud.google.com/apis/dashboard',
      },
    };
  }

  // Network error
  if (errorString.includes('network') || errorString.includes('fetch')) {
    return {
      title: 'Network Error',
      message: 'Unable to connect to Google Maps servers. Check your internet connection.',
      details: errorMessage,
      actionLink: null,
    };
  }

  // Generic error
  return {
    title: 'Map Load Failed',
    message: 'An unexpected error occurred while loading Google Maps.',
    details: errorMessage,
    actionLink: {
      label: 'View Documentation',
      url: 'https://developers.google.com/maps/documentation/javascript/error-messages',
    },
  };
}

/** Returns true for finite lat/lng numbers within their valid ranges. */
function isValidLatLng(lat, lng) {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    isFinite(lat) &&
    isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/** Extract a { lat, lng } literal from a stop's `location` field. */
function latLngFromStopLocation(location) {
  if (!location || typeof location !== 'object') return null;
  const lat = Number(location.latitude ?? location.lat);
  const lng = Number(location.longitude ?? location.lng);
  return isValidLatLng(lat, lng) ? { lat, lng } : null;
}

/** Geocode a place name via the Maps JS Geocoder. Resolves null on failure. */
async function geocodeStopName(geocoder, name, biasCenter) {
  if (!geocoder || !name) return null;

  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), GEOCODE_TIMEOUT_MS);

    const params = { address: name };
    if (biasCenter) {
      params.location = biasCenter;
      params.radius = 50000; // 50 km soft bias
    }

    geocoder.geocode(params, (results, status) => {
      clearTimeout(timer);
      if (status === 'OK' && results?.[0]?.geometry?.location) {
        const loc = results[0].geometry.location;
        resolve({ lat: loc.lat(), lng: loc.lng() });
      } else {
        resolve(null);
      }
    });
  });
}

/**
 * Request a route from the Directions API.
 * Returns the raw DirectionsResult or null on any failure.
 * 
 * TODO: Migrate to new Routes API (google.maps.routes.Route.computeRoutes)
 * DirectionsService is deprecated and will be removed in a future version.
 * Migration guide: https://developers.google.com/maps/documentation/javascript/directions#migration
 * 
 * New API benefits:
 * - Better performance and accuracy
 * - More route customization options
 * - Traffic-aware routing
 * - Toll information
 * 
 * Migration requires:
 * 1. Enable Routes API in Google Cloud Console
 * 2. Update to use google.maps.routes.Route.computeRoutes()
 * 3. Adjust response parsing (different structure)
 * 4. Update DirectionsRenderer to work with new format
 */
async function fetchDirections(resolvedStops, travelMode) {
  console.log('[ItineraryMap] 🗺️ fetchDirections called');
  console.log('[ItineraryMap] resolvedStops count:', resolvedStops.length);
  console.log('[ItineraryMap] travelMode:', travelMode);

  if (!window.google?.maps?.DirectionsService) {
    console.error('[ItineraryMap] ❌ DirectionsService not available');
    return null;
  }
  
  if (resolvedStops.length < 2) {
    console.warn('[ItineraryMap] ⚠️ Not enough stops for directions (need ≥2):', resolvedStops.length);
    return null;
  }

  // Clamp to API limit: origin + up to 8 waypoints + destination = 10 points.
  const clamped =
    resolvedStops.length > MAX_WAYPOINTS + 2
      ? [
          resolvedStops[0],
          ...resolvedStops.slice(1, MAX_WAYPOINTS + 1),
          resolvedStops[resolvedStops.length - 1],
        ]
      : resolvedStops;

  const origin = clamped[0].position;
  const destination = clamped[clamped.length - 1].position;
  const waypoints = clamped.slice(1, -1).map(({ position }) => ({
    location: position,
    stopover: true,
  }));

  // Detailed logging of request parameters
  console.log('[ItineraryMap] 📍 Directions Request:');
  console.log('  Origin:', origin, `(${clamped[0].stop.name})`);
  console.log('  Destination:', destination, `(${clamped[clamped.length - 1].stop.name})`);
  console.log('  Waypoints count:', waypoints.length);
  waypoints.forEach((wp, i) => {
    console.log(`  Waypoint ${i + 1}:`, wp.location, `(${clamped[i + 1].stop.name})`);
  });
  console.log('  Travel mode:', travelMode);

  // Validate coordinates
  const invalidStops = [];
  resolvedStops.forEach(({ stop, position }) => {
    if (!isValidLatLng(position.lat, position.lng)) {
      invalidStops.push({ name: stop.name, position });
    }
  });
  
  if (invalidStops.length > 0) {
    console.error('[ItineraryMap] ❌ Invalid coordinates detected:', invalidStops);
  }

  const service = new window.google.maps.DirectionsService();

  return new Promise((resolve) => {
    const requestTime = Date.now();
    
    service.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode[travelMode] ?? window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false, // preserve itinerary order
      },
      (result, status) => {
        const responseTime = Date.now() - requestTime;
        console.log(`[ItineraryMap] 📡 Directions API response (${responseTime}ms):`, status);
        
        if (status === 'OK') {
          console.log('[ItineraryMap] ✅ Directions received successfully');
          console.log('  Routes count:', result.routes?.length);
          console.log('  Legs count:', result.routes?.[0]?.legs?.length);
          console.log('  Has overview_path:', !!result.routes?.[0]?.overview_path);
          console.log('  Has overview_polyline:', !!result.routes?.[0]?.overview_polyline);
          
          // Log each leg details
          result.routes?.[0]?.legs?.forEach((leg, i) => {
            console.log(`  Leg ${i + 1}:`, {
              distance: leg.distance?.text,
              duration: leg.duration?.text,
              steps: leg.steps?.length
            });
          });
          
          resolve(result);
        } else {
          // Log ALL failures with detailed information
          console.error('[ItineraryMap] ❌ Directions API failed:', status);
          
          // Provide specific guidance based on status
          switch (status) {
            case 'ZERO_RESULTS':
              console.error('  → No route found between these locations');
              break;
            case 'NOT_FOUND':
              console.error('  → One or more locations could not be geocoded');
              break;
            case 'INVALID_REQUEST':
              console.error('  → Invalid request parameters');
              console.error('  → Check origin, destination, and waypoints format');
              break;
            case 'REQUEST_DENIED':
              console.error('  → API key does not have Directions API enabled');
              console.error('  → Check Google Cloud Console API restrictions');
              break;
            case 'OVER_QUERY_LIMIT':
              console.error('  → API quota exceeded');
              break;
            case 'UNKNOWN_ERROR':
              console.error('  → Server error, retry may succeed');
              break;
            default:
              console.error('  → Unexpected status code');
          }
          
          resolve(null);
        }
      },
    );
  });
}

/** Extract per-leg travel duration strings from a DirectionsResult. */
function extractLegDurations(directionsResult) {
  if (!directionsResult?.routes?.[0]?.legs) return [];
  return directionsResult.routes[0].legs.map((leg) => leg.duration?.text ?? null);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Numbered pin rendered as a custom OverlayView above the map layer. */
function StopMarker({ stop, position, isFirst, isLast, travelDurationAfter }) {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(w, h) => ({ x: -(w / 2), y: -h })}
    >
      <div
        className="group relative flex flex-col items-center"
        role="img"
        aria-label={`Stop ${stop.order}: ${stop.name}`}
      >
        {/* Pin bubble */}
        <div
          className={[
            'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold shadow-lg transition-transform duration-200 group-hover:scale-110',
            isFirst
              ? 'border-emerald-400 bg-emerald-500 text-white shadow-emerald-500/40'
              : isLast
              ? 'border-rose-400 bg-rose-500 text-white shadow-rose-500/40'
              : 'border-emerald-500/60 bg-zinc-900 text-emerald-300 shadow-emerald-500/20',
          ].join(' ')}
        >
          {stop.order}
        </div>

        {/* Pin tail */}
        <div
          className={[
            'h-2.5 w-0.5',
            isFirst ? 'bg-emerald-500' : isLast ? 'bg-rose-500' : 'bg-emerald-500/60',
          ].join(' ')}
          aria-hidden
        />

        {/* Hover tooltip */}
        <div
          className="pointer-events-none absolute bottom-full mb-1 hidden min-w-max max-w-[220px] rounded-xl border border-white/10 bg-zinc-950/95 px-3 py-2 text-xs text-white shadow-xl backdrop-blur group-hover:block"
          role="tooltip"
        >
          <p className="font-semibold leading-tight">{stop.name}</p>
          <p className="mt-0.5 text-zinc-400">{stop.time}</p>
          {travelDurationAfter && !isLast && (
            <p className="mt-1 flex items-center gap-1 text-emerald-400">
              <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
              {travelDurationAfter} to next stop
            </p>
          )}
        </div>
      </div>
    </OverlayView>
  );
}

/** Animated loading state with pulsing map-pin icon. */
function MapSkeleton({ label }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-zinc-900/40">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20" />
        <svg
          className="h-7 w-7 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      </div>
      <p className="text-sm text-zinc-400">{label}</p>
    </div>
  );
}

/** Error state card shown when the map cannot be displayed at all. */
function MapError({ title, message, details, actionLink }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl border border-white/5 bg-zinc-900/40 px-6 py-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <div className="max-w-md">
        <p className="text-sm font-semibold text-red-400">{title}</p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-400">{message}</p>
        {details && (
          <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-left">
            <p className="text-[10px] font-mono text-zinc-500">{details}</p>
          </div>
        )}
        {actionLink && (
          <a
            href={actionLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20"
          >
            {actionLink.label}
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * A single travel-duration chip displayed between two stop names in the
 * bottom legend strip.
 */
function DurationChip({ duration }) {
  if (!duration) return null;
  return (
    <span
      className="mx-1 inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400"
      title="Estimated travel time"
    >
      <svg className="h-2.5 w-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {duration}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * @param {{
 *   stops: Array,
 *   planLocation?: { latitude: number, longitude: number } | null,
 *   travelMode?: 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT',
 *   className?: string
 * }} props
 */
export default function ItineraryMap({
  stops = [],
  planLocation = null,
  travelMode = 'DRIVING',
  className = '',
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey ?? '',
    libraries: GOOGLE_MAPS_LIBRARIES,
    id: 'google-map-script',
  });

  const mapRef = useRef(null);
  const geocoderRef = useRef(null);

  // Resolved markers (stop + LatLng position).
  const [resolvedStops, setResolvedStops] = useState([]);
  const [geocoding, setGeocoding] = useState(false);

  // Directions API state.
  const [directionsResult, setDirectionsResult] = useState(null);
  const [directionsLoading, setDirectionsLoading] = useState(false);
  const [directionsError, setDirectionsError] = useState(false); // true = fallback mode

  // Per-leg travel durations extracted from the Directions response.
  const legDurations = useMemo(
    () => extractLegDurations(directionsResult),
    [directionsResult],
  );

  // Bias centre from the plan's user-origin location.
  const biasCenter = useMemo(() => {
    if (!planLocation) return null;
    const lat = Number(planLocation.latitude ?? planLocation.lat);
    const lng = Number(planLocation.longitude ?? planLocation.lng);
    return isValidLatLng(lat, lng) ? { lat, lng } : null;
  }, [planLocation]);

  // ── Phase 1: Resolve coordinates for every stop ────────────────────────────
  useEffect(() => {
    if (!isLoaded || !stops?.length) {
      let cancelled = false;
      Promise.resolve().then(() => {
        if (!cancelled) setResolvedStops([]);
      });
      return () => { cancelled = true; };
    }

    let cancelled = false;

    async function resolveCoordinates() {
      console.log('[ItineraryMap] 🔍 Phase 1: Resolving coordinates for', stops.length, 'stops');
      setGeocoding(true);
      setDirectionsResult(null);
      setDirectionsError(false);

      if (!geocoderRef.current && window.google?.maps?.Geocoder) {
        geocoderRef.current = new window.google.maps.Geocoder();
        console.log('[ItineraryMap] Geocoder initialized');
      }

      const withCoords = await Promise.all(
        stops.map(async (stop, index) => {
          console.log(`[ItineraryMap] Resolving stop ${index + 1}/${stops.length}: ${stop.name}`);
          
          // Priority 1: direct Google Places location.
          const direct = latLngFromStopLocation(stop.location);
          if (direct) {
            console.log(`  ✅ Using Places API coordinates:`, direct);
            return { stop, position: direct, source: 'places' };
          }

          // Priority 2: geocode the stop name.
          console.log(`  🔎 Geocoding stop name...`);
          const geocoded = await geocodeStopName(geocoderRef.current, stop.name, biasCenter);
          if (geocoded) {
            console.log(`  ✅ Geocoded coordinates:`, geocoded);
            return { stop, position: geocoded, source: 'geocoded' };
          }

          // Priority 3: fallback to plan-level origin.
          if (biasCenter) {
            console.log(`  ⚠️ Using fallback (plan location):`, biasCenter);
            return { stop, position: biasCenter, source: 'fallback' };
          }

          console.error(`  ❌ Could not resolve coordinates for: ${stop.name}`);
          return null; // cannot resolve → omit from map
        }),
      );

      if (cancelled) return;

      const resolved = withCoords.filter(Boolean);
      console.log('[ItineraryMap] ✅ Coordinate resolution complete:', resolved.length, 'of', stops.length, 'stops resolved');
      
      // Log summary by source
      const sources = { places: 0, geocoded: 0, fallback: 0 };
      resolved.forEach(({ source }) => sources[source]++);
      console.log('[ItineraryMap] Resolution sources:', sources);

      setResolvedStops(resolved);
      setGeocoding(false);
    }

    resolveCoordinates();
    return () => { cancelled = true; };
  }, [isLoaded, stops, biasCenter]);

  // ── Phase 2: Fetch directions once markers are resolved ────────────────────
  useEffect(() => {
    if (!isLoaded || geocoding || resolvedStops.length < 2) {
      // Not enough points — stay in marker-only mode.
      let cancelled = false;
      Promise.resolve().then(() => {
        if (cancelled) return;
        setDirectionsResult(null);
        setDirectionsError(false);
      });
      return () => { cancelled = true; };
    }

    let cancelled = false;

    async function loadDirections() {
      console.log('[ItineraryMap] 🚗 Phase 2: Fetching directions');
      setDirectionsLoading(true);
      setDirectionsError(false);

      const result = await fetchDirections(resolvedStops, travelMode);

      if (cancelled) return;

      if (result) {
        console.log('[ItineraryMap] ✅ Directions loaded successfully, setting state');
        setDirectionsResult(result);
        setDirectionsError(false);
      } else {
        console.warn('[ItineraryMap] ⚠️ Directions failed, entering fallback mode (markers only)');
        setDirectionsResult(null);
        setDirectionsError(true); // graceful fallback
      }

      setDirectionsLoading(false);
    }

    loadDirections();
    return () => { cancelled = true; };
  }, [isLoaded, geocoding, resolvedStops, travelMode]);

  // ── Fit bounds to markers (fallback when Directions unavailable) ───────────
  const fitMarkerBounds = useCallback(() => {
    if (!mapRef.current || !resolvedStops.length || !window.google?.maps) return;

    if (resolvedStops.length === 1) {
      mapRef.current.setCenter(resolvedStops[0].position);
      mapRef.current.setZoom(DEFAULT_ZOOM);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    resolvedStops.forEach(({ position }) => bounds.extend(position));
    mapRef.current.fitBounds(bounds, { top: 60, right: 40, bottom: 60, left: 40 });
  }, [resolvedStops]);

  // Auto-fit when directions arrive — use the route's own bounds (more accurate).
  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;

    if (directionsResult?.routes?.[0]?.bounds) {
      mapRef.current.fitBounds(directionsResult.routes[0].bounds, {
        top: 60, right: 40, bottom: 60, left: 40,
      });
    } else if (!directionsLoading && resolvedStops.length > 0) {
      fitMarkerBounds();
    }
  }, [directionsResult, directionsLoading, resolvedStops, fitMarkerBounds]);

  const onMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
      // Initial fit — directions will re-fit once they arrive.
      if (resolvedStops.length > 0) fitMarkerBounds();
    },
    [resolvedStops, fitMarkerBounds],
  );

  // ── Derived state helpers ──────────────────────────────────────────────────
  const isWorking = geocoding || directionsLoading;
  const hasRoute = Boolean(directionsResult);
  const showFallbackWarning = directionsError && resolvedStops.length >= 2;

  // ── Guard: missing API key ─────────────────────────────────────────────────
  if (!apiKey) {
    return (
      <div className={`h-80 ${className}`}>
        <MapError
          title="Missing API Key"
          message="VITE_GOOGLE_MAPS_API_KEY environment variable is not configured. Add it to your .env file."
          details="Required: VITE_GOOGLE_MAPS_API_KEY=your_api_key_here"
          actionLink={{
            label: 'Get API Key',
            url: 'https://console.cloud.google.com/apis/credentials',
          }}
        />
      </div>
    );
  }

  // ── Guard: loader error ────────────────────────────────────────────────────
  if (loadError) {
    const errorInfo = parseGoogleMapsError(loadError);
    return (
      <div className={`h-80 ${className}`}>
        <MapError {...errorInfo} />
      </div>
    );
  }

  // ── Guard: no stops ────────────────────────────────────────────────────────
  if (!stops?.length) {
    return (
      <div className={`h-80 ${className}`}>
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-white/5 bg-zinc-900/40">
          <svg className="h-8 w-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
          <p className="text-sm text-zinc-600">No stops to display on the map.</p>
        </div>
      </div>
    );
  }

  const initialCenter = biasCenter ?? DEFAULT_CENTER;

  return (
    <div className={`overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 ${className}`}>

      {/* ── Header bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </span>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Route Map
            </h3>
            <p className="text-xs text-zinc-500">
              {geocoding
                ? 'Locating stops…'
                : directionsLoading
                ? 'Calculating route…'
                : hasRoute
                ? `${resolvedStops.length} stops · real road route`
                : directionsError
                ? `${resolvedStops.length} stops · markers only`
                : `${resolvedStops.length} stop${resolvedStops.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden items-center gap-4 sm:flex">
          {hasRoute && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="inline-block h-1 w-5 rounded-full bg-emerald-500 opacity-80" />
              Route
            </span>
          )}
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Start
          </span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" />
            End
          </span>
        </div>
      </div>

      {/* ── Directions-unavailable warning banner (fallback mode) ────────────── */}
      {showFallbackWarning && (
        <div className="flex items-center gap-2 border-b border-amber-500/10 bg-amber-500/5 px-5 py-2.5 text-xs text-amber-400">
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          Route directions unavailable for this itinerary — showing stop markers only.
        </div>
      )}

      {/* ── Map canvas ──────────────────────────────────────────────────────── */}
      <div className="relative h-[420px] sm:h-[520px]">

        {/* Loading overlay */}
        {(!isLoaded || isWorking) && (
          <div className="absolute inset-0 z-10">
            <MapSkeleton
              label={
                !isLoaded
                  ? 'Loading map…'
                  : geocoding
                  ? 'Resolving stop locations…'
                  : 'Calculating route…'
              }
            />
          </div>
        )}

        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={initialCenter}
            zoom={DEFAULT_ZOOM}
            options={MAP_OPTIONS}
            onLoad={onMapLoad}
          >
            {/* Route polyline — only when Directions succeeded */}
            {hasRoute && (
              <>
                {console.log('[ItineraryMap] 🎨 Rendering DirectionsRenderer with result:', directionsResult)}
                <DirectionsRenderer
                  directions={directionsResult}
                  options={DIRECTIONS_RENDERER_OPTIONS}
                  onLoad={(renderer) => {
                    console.log('[ItineraryMap] ✅ DirectionsRenderer loaded:', renderer);
                    console.log('[ItineraryMap] Polyline options:', DIRECTIONS_RENDERER_OPTIONS.polylineOptions);
                  }}
                  onDirectionsChanged={() => {
                    console.log('[ItineraryMap] 📍 DirectionsRenderer: directions changed');
                  }}
                />
              </>
            )}

            {/* Custom numbered markers — always rendered above the polyline */}
            {!isWorking &&
              resolvedStops.map(({ stop, position }, index) => (
                <StopMarker
                  key={`${stop.order}-${stop.name}`}
                  stop={stop}
                  position={position}
                  isFirst={index === 0}
                  isLast={index === resolvedStops.length - 1}
                  travelDurationAfter={legDurations[index] ?? null}
                />
              ))}
          </GoogleMap>
        )}
      </div>

      {/* ── Bottom strip: stop legend + travel durations ─────────────────────── */}
      {!isWorking && resolvedStops.length > 0 && (
        <div className="border-t border-white/5 px-5 py-4">

          {/* Travel summary row (only when directions succeeded) */}
          {hasRoute && legDurations.length > 0 && (
            <div className="mb-3 flex flex-wrap items-center gap-y-1 text-xs text-zinc-500">
              <span className="mr-1 font-medium text-zinc-400">Travel time:</span>
              {legDurations.map((dur, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="text-zinc-600">
                    {resolvedStops[i]?.stop.name.split(' ')[0]}
                  </span>
                  <svg className="h-3 w-3 shrink-0 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                  <DurationChip duration={dur} />
                  {i < legDurations.length - 1 && <span className="text-zinc-700">·</span>}
                </span>
              ))}
            </div>
          )}

          {/* Numbered stop list */}
          <ol className="flex flex-wrap gap-x-5 gap-y-2">
            {resolvedStops.map(({ stop }, index) => (
              <li key={stop.order} className="flex items-center gap-2 text-xs text-zinc-400">
                <span
                  className={[
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                    index === 0
                      ? 'bg-emerald-500 text-white'
                      : index === resolvedStops.length - 1
                      ? 'bg-rose-500 text-white'
                      : 'border border-emerald-500/40 bg-zinc-800 text-emerald-300',
                  ].join(' ')}
                  aria-hidden
                >
                  {stop.order}
                </span>
                <span className="max-w-[140px] truncate">{stop.name}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
