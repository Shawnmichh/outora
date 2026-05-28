import { useCallback, useRef, useState } from 'react';

// Maps stop category strings → Google Places API type strings.
// Extend as new categories appear in the itinerary schema.
const CATEGORY_TO_PLACE_TYPE = {
  cafe: 'cafe',
  coffee: 'cafe',
  restaurant: 'restaurant',
  food: 'restaurant',
  museum: 'museum',
  gallery: 'art_gallery',
  park: 'park',
  garden: 'park',
  viewpoint: 'tourist_attraction',
  landmark: 'tourist_attraction',
  attraction: 'tourist_attraction',
  shopping: 'shopping_mall',
  market: 'shopping_mall',
  bar: 'bar',
  pub: 'bar',
  nightclub: 'night_club',
  entertainment: 'amusement_park',
  activity: 'amusement_park',
  sports: 'stadium',
  beach: 'natural_feature',
  nature: 'natural_feature',
  movie: 'movie_theater',
  cinema: 'movie_theater',
  theater: 'movie_theater',
};

function categoryToPlaceType(category) {
  if (!category) return 'point_of_interest';
  const key = category.toLowerCase().replace(/[_\s]+/g, '');
  // Try exact match first, then prefix match
  const direct = CATEGORY_TO_PLACE_TYPE[key];
  if (direct) return direct;
  for (const [k, v] of Object.entries(CATEGORY_TO_PLACE_TYPE)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return 'point_of_interest';
}

const DEFAULT_RADIUS_M = 1500;

/**
 * Hook that, given a reference to the currently-loaded Google Maps instance,
 * can search for a nearby replacement for any stop.
 *
 * Usage:
 *   const { replaceLoading, replaceError, findReplacement } = usePlaceReplacement();
 *   ...
 *   const result = await findReplacement(stop, currentStops);
 *   if (result) replaceStop(stop.order, result);
 */
function usePlaceReplacement() {
  // Track loading/error state per stop order
  const [loadingOrders, setLoadingOrders] = useState(new Set());
  const [errorOrders, setErrorOrders] = useState(new Map()); // order → message

  // Service instance — lazy created once Maps API is ready
  const serviceRef = useRef(null);

  function getService() {
    if (serviceRef.current) return serviceRef.current;
    if (!window.google?.maps?.places?.PlacesService) return null;
    // PlacesService requires a DOM node or a map instance.
    // We use a detached div as the attribution container.
    const attributionDiv = document.createElement('div');
    serviceRef.current = new window.google.maps.places.PlacesService(attributionDiv);
    return serviceRef.current;
  }

  /**
   * Find a replacement for `stop` that:
   *  - is nearby (within DEFAULT_RADIUS_M metres)
   *  - matches the stop's category
   *  - is NOT already in `currentStops`
   *
   * Returns a partial stop object { name, description, category, location }
   * or null on failure.
   */
  const findReplacement = useCallback(async (stop, currentStops) => {
    const order = stop.order;

    setLoadingOrders((prev) => new Set([...prev, order]));
    setErrorOrders((prev) => {
      const next = new Map(prev);
      next.delete(order);
      return next;
    });

    try {
      const service = getService();
      if (!service) {
        throw new Error('Google Places not available');
      }

      // Determine search centre from stop's location, falling back to
      // coordinates stored directly on the stop.
      const lat =
        stop.location?.latitude ??
        stop.location?.lat ??
        stop.latitude ??
        null;
      const lng =
        stop.location?.longitude ??
        stop.location?.lng ??
        stop.longitude ??
        null;

      if (lat == null || lng == null) {
        throw new Error('No coordinates available for this stop');
      }

      const center = new window.google.maps.LatLng(lat, lng);
      const placeType = categoryToPlaceType(stop.category);

      const existingNames = new Set(
        currentStops.map((s) => s.name?.toLowerCase().trim()),
      );

      const result = await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Search timed out')), 10000);

        service.nearbySearch(
          {
            location: center,
            radius: DEFAULT_RADIUS_M,
            type: placeType,
            rankBy: window.google.maps.places.RankBy.PROMINENCE,
          },
          (results, status) => {
            clearTimeout(timer);
            const OK = window.google.maps.places.PlacesServiceStatus.OK;
            const ZERO = window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS;
            if (status === OK && results?.length) {
              resolve(results);
            } else if (status === ZERO) {
              resolve([]);
            } else {
              reject(new Error(`Places search failed: ${status}`));
            }
          },
        );
      });

      // Pick first result not already in the itinerary
      const candidate = result.find(
        (place) =>
          place.name &&
          !existingNames.has(place.name.toLowerCase().trim()),
      );

      if (!candidate) {
        throw new Error('No new nearby places found');
      }

      const loc = candidate.geometry?.location;

      return {
        name: candidate.name,
        description: candidate.vicinity || candidate.formatted_address || '',
        category: stop.category, // keep the original category
        place_id: candidate.place_id,
        location: loc
          ? { latitude: loc.lat(), longitude: loc.lng() }
          : stop.location,
      };
    } catch (err) {
      const msg =
        err.message?.includes('No new nearby')
          ? "Couldn't find another nearby spot. Try again."
          : "Couldn't find another nearby spot. Try again.";

      setErrorOrders((prev) => {
        const next = new Map(prev);
        next.set(order, msg);
        return next;
      });
      return null;
    } finally {
      setLoadingOrders((prev) => {
        const next = new Set(prev);
        next.delete(order);
        return next;
      });
    }
  }, []);

  const clearError = useCallback((order) => {
    setErrorOrders((prev) => {
      const next = new Map(prev);
      next.delete(order);
      return next;
    });
  }, []);

  return {
    findReplacement,
    isReplacing: (order) => loadingOrders.has(order),
    getError: (order) => errorOrders.get(order) ?? null,
    clearError,
  };
}

export default usePlaceReplacement;
