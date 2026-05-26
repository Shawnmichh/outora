import { formatCoordinates } from '../../utils/geolocation';

function LocationStatus({
  loading,
  error,
  permissionDenied,
  isSupported,
  hasCoordinates,
  latitude,
  longitude,
  onRetry,
}) {
  if (!isSupported) {
    return (
      <div
        role="status"
        className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
      >
        <p className="font-medium text-amber-100">Location not available</p>
        <p className="mt-1 text-amber-200/90">
          Your browser does not support geolocation. Plans will use a default city.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        role="status"
        className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-200"
      >
        <svg
          className="h-5 w-5 shrink-0 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>Detecting your location for nearby recommendations…</span>
      </div>
    );
  }

  if (hasCoordinates) {
    const coords = formatCoordinates(latitude, longitude);
    return (
      <div
        role="status"
        className="flex flex-col gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-3 text-emerald-200">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          <div>
            <p className="font-medium text-emerald-100">Location detected</p>
            <p className="mt-0.5 text-emerald-200/90">
              Recommendations will be tailored near{' '}
              <span className="font-mono text-emerald-100">{coords}</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 text-xs font-medium text-emerald-300 underline-offset-2 transition hover:text-white hover:underline"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-medium text-amber-100">
            {permissionDenied ? 'Location permission denied' : 'Location not detected'}
          </p>
          <p className="mt-1 text-amber-200/90">
            {error ??
              'We could not access your location. You can still generate a plan using a default area.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-lg border border-amber-500/40 bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-100 transition hover:bg-amber-500/30"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default LocationStatus;
