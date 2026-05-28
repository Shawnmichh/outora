import { useCallback, useEffect, useRef, useState } from 'react';
import { getGeolocationErrorMessage } from '../utils/geolocation';

const DEFAULT_OPTIONS = {
  enableOnMount: true,
  enableHighAccuracy: false,
  maximumAge: 60_000,
  timeout: 15_000,
};

/**
 * Browser geolocation hook for outing plan generation.
 *
 * @param {object} options
 * @param {boolean} [options.enableOnMount=true] - Request location when mounted
 */
function useGeolocation(options = {}) {
  const {
    enableOnMount,
    enableHighAccuracy,
    maximumAge,
    timeout,
  } = { ...DEFAULT_OPTIONS, ...options };

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const isSupported =
    typeof navigator !== 'undefined' && Boolean(navigator.geolocation);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const requestLocation = useCallback(() => {
    if (!isSupported) {
      setError('Geolocation is not supported by your browser.');
      setPermissionDenied(false);
      return;
    }

    setLoading(true);
    setError(null);
    setPermissionDenied(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mountedRef.current) return;

        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLoading(false);
        setError(null);
        setPermissionDenied(false);
      },
      (geoError) => {
        if (!mountedRef.current) return;

        const denied = geoError.code === geoError.PERMISSION_DENIED;
        setPermissionDenied(denied);
        setError(getGeolocationErrorMessage(geoError.code));
        setLatitude(null);
        setLongitude(null);
        setLoading(false);
      },
      {
        enableHighAccuracy,
        maximumAge,
        timeout,
      },
    );
  }, [isSupported, enableHighAccuracy, maximumAge, timeout]);

  useEffect(() => {
    if (enableOnMount && isSupported) {
      let cancelled = false;
      const timer = setTimeout(() => {
        if (!cancelled) requestLocation();
      }, 0);

      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [enableOnMount, isSupported, requestLocation]);

  const hasCoordinates = latitude != null && longitude != null;

  return {
    latitude,
    longitude,
    loading,
    error,
    permissionDenied,
    isSupported,
    hasCoordinates,
    requestLocation,
  };
}

export default useGeolocation;
