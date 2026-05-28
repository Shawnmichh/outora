import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { deleteTrip, fetchTrips } from '../services/tripsApi';
import { ApiError } from '../services/api/httpClient';
import { saveGeneratedPlan } from '../utils/generatedPlan';
import { ROUTES } from '../routes/paths';
import ShareButton from '../components/shared/ShareButton';

function formatTripDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadTrips() {
      try {
        const data = await fetchTrips();
        if (active) setTrips(data);
      } catch (err) {
        if (active) {
          setError(err instanceof ApiError ? err.message : 'Unable to load saved trips.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTrips();
    return () => {
      active = false;
    };
  }, []);

  const openTrip = (trip) => {
    saveGeneratedPlan(trip.itinerary);
    navigate(ROUTES.RESULTS, { state: { generatedPlan: trip.itinerary } });
  };

  const handleDelete = async (tripId) => {
    setDeletingId(tripId);
    setError('');
    try {
      await deleteTrip(tripId);
      setTrips((current) => current.filter((trip) => trip.id !== tripId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to delete this trip.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        <header className="mb-10 text-left sm:mb-12">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            My Trips
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-text-secondary)]">
            Reopen your saved plans, compare ideas, or clear out trips you no longer need.
          </p>
        </header>

        {error && (
          <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </p>
        )}

        {loading ? (
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-12 text-center text-[var(--color-text-muted)]">
            Loading saved trips…
          </div>
        ) : trips.length === 0 ? (
          <div className="rounded-xl border border-[var(--color-border)] bg-white p-12 text-center">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">No saved trips yet</h2>
            <p className="mt-2 text-base text-[var(--color-text-secondary)]">
              Generate an itinerary and save it here for later.
            </p>
            <Link
              to={ROUTES.QUESTIONNAIRE}
              className="mt-7 inline-flex rounded-lg bg-[var(--color-accent)] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--color-accent-hover)]"
            >
              Plan an outing
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {trips.map((trip) => (
              <article
                key={trip.id}
                className="group rounded-xl border border-[var(--color-border)] bg-white p-5 transition-all hover:border-[var(--color-accent)]/30 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      {formatTripDate(trip.created_at)}
                    </p>
                    <h2 className="mt-2 break-words text-lg font-bold leading-tight text-[var(--color-text-primary)]">
                      {trip.title}
                    </h2>
                  </div>
                  <span className="shrink-0 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-secondary)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)]">
                    {trip.itinerary?.stops?.length ?? 0} stops
                  </span>
                </div>

                <p className="mt-3 break-words text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {trip.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => openTrip(trip)}
                    className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[var(--color-accent-hover)]"
                  >
                    Open itinerary
                  </button>
                  <ShareButton
                    shareId={trip.share_id}
                    label="Copy Link"
                    className="rounded-lg border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-secondary)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleDelete(trip.id)}
                    disabled={deletingId === trip.id}
                    className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === trip.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default MyTrips;
