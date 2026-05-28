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
        className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm"
      >
        <p className="font-semibold text-amber-800">Location not available</p>
        <p className="mt-0.5 text-amber-700">
          Your browser does not support geolocation. Plans will use a default city.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        role="status"
        className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text-secondary)]"
      >
        <svg
          className="h-4 w-4 shrink-0 animate-spin text-[var(--color-accent)]"
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
        <span>Detecting your location…</span>
      </div>
    );
  }

  if (hasCoordinates) {
    const coords = formatCoordinates(latitude, longitude);
    return (
      <div
        role="status"
        className="flex flex-col gap-2 rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
          <svg
            className="h-4 w-4 shrink-0 text-[var(--color-accent)]"
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
            <p className="font-semibold text-[var(--color-text-primary)]">Location detected</p>
            <p className="text-[var(--color-text-secondary)]">
              Near{' '}
              <span className="font-mono font-medium text-[var(--color-accent)]">{coords}</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 text-xs font-semibold text-[var(--color-accent)] underline-offset-2 transition hover:underline"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold text-amber-800">
            {permissionDenied ? 'Location permission denied' : 'Location not detected'}
          </p>
          <p className="mt-0.5 text-amber-700">
            {error ??
              'We could not access your location. You can still generate a plan using a default area.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-50"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default LocationStatus;
